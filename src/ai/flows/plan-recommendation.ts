
// src/ai/flows/plan-recommendation.ts
'use server';
/**
 * @fileOverview Recommends telecom plans based on user's needs.
 *
 * - recommendPlan - A function that handles the plan recommendation process.
 * - RecommendPlanInput - The input type for the recommendPlan function.
 * - RecommendPlanOutput - The return type for the recommendPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getTelecomPlans, TelecomPlanFilter, TelecomPlanSchema} from '@/services/telecom-plans'; // Import TelecomPlanSchema

const RecommendPlanInputSchema = z.object({
  query: z.string().describe('The user query for plan recommendations.'),
});
export type RecommendPlanInput = z.infer<typeof RecommendPlanInputSchema>;

const RecommendPlanOutputSchema = z.object({
  planRecommendation: z.string().describe('A textual recommendation of telecom plans based on the user query. This should summarize findings or provide advice, not list full plan details.'),
  plans: z.array(TelecomPlanSchema).describe('List of telecom plan objects based on the recommendation. This should be populated using the results from the getFilteredPlans tool. If no plans are found, this should be an empty array.'),
});
export type RecommendPlanOutput = z.infer<typeof RecommendPlanOutputSchema>;

export async function recommendPlan(input: RecommendPlanInput): Promise<RecommendPlanOutput> {
  return recommendPlanFlow(input);
}

const getFilteredPlans = ai.defineTool({
  name: 'getFilteredPlans',
  description: 'Retrieves a list of telecom plans based on specified filters like operator, price range, data per day, and validity. Use this tool to find plans that match user requirements.',
  inputSchema: z.object({
    operator: z.string().optional().describe('The telecom operator (e.g., Airtel, Jio, Vi). Case-insensitive.'),
    minPrice: z.number().optional().describe('The minimum price of the plan.'),
    maxPrice: z.number().optional().describe('The maximum price of the plan.'),
    dataPerDay: z.string().optional().describe('The amount of data, typically per day (e.g., "1GB", "1.5GB", "2GB"). Can also be "Other" for bulk data plans not specified per day. The tool will try to match this string within the plan\'s data description.'),
    validity: z.number().optional().describe('The validity of the plan in days.'),
  }),
  outputSchema: z.array(TelecomPlanSchema), // Use TelecomPlanSchema
},
async (input) => {
  // The getTelecomPlans service now has basic filtering
  return getTelecomPlans(input as TelecomPlanFilter);
});

const prompt = ai.definePrompt({
  name: 'recommendPlanPrompt',
  input: {
    schema: RecommendPlanInputSchema,
  },
  output: {
    schema: RecommendPlanOutputSchema,
  },
  tools: [getFilteredPlans],
  prompt: `You are a telecom plan recommendation expert for Indian mobile operators (Jio, Airtel, Vi).
A user will provide a query ({{{query}}}), and you will recommend telecom plans based on their needs.

Your goal is to provide a helpful textual recommendation AND a list of matching plan objects.

Instructions:
1. Analyze the user's query: {{{query}}}
2. Identify any specific criteria mentioned by the user:
    - Operator: (e.g., "Jio", "Airtel", "Vi").
    - Price: (e.g., "under 300", "around 500", "between 200 and 400"). Extract minPrice and maxPrice if possible.
    - Data: (e.g., "1GB per day", "lots of data", "2GB data"). Extract dataPerDay (e.g. "1GB", "1.5GB", "2GB"). If user asks for bulk data or something not daily, you might try "Other" for dataPerDay or omit it.
    - Validity: (e.g., "for a month", "28 days", "3 months", "84 days"). Extract validity in days.
3. If specific criteria are identified, use the 'getFilteredPlans' tool to fetch plans matching these criteria. Pass the identified criteria as input to the tool. Be precise with tool parameters. For example, if user says "1GB per day", pass dataPerDay: "1GB".
4. After obtaining the results from the 'getFilteredPlans' tool (or if the tool is not applicable because no specific criteria were given or understood):
   a. Populate the 'plans' field in the output with the array of plan objects returned by the 'getFilteredPlans' tool. If no plans are found or the tool was not used, this field MUST be an empty array [].
   b. Generate a concise and helpful 'planRecommendation' string. This string should:
      - Acknowledge the user's query.
      - Briefly state what you looked for.
      - Mention if plans were found and how many (e.g., "I found 3 plans matching your criteria:", "I couldn't find exact matches for that, but here are some alternatives:", "Based on your request for a Jio plan...").
      - If no specific query was made, or it was too vague to use the tool, you can provide a general greeting or ask for more details (e.g., "I can help find mobile plans. What are you looking for?"). In this case, the 'plans' array should be empty.
      - Do NOT repeat the full details of each plan (price, data, validity etc.) in this 'planRecommendation' string, as those details will be in the structured 'plans' array. A summary or an introductory sentence is sufficient.

Example User Query: "I need a Jio plan under ₹300 with at least 1.5GB/day data for about 28 days."

Conceptual Tool Call (You decide parameters based on the query):
getFilteredPlans({ operator: "Jio", maxPrice: 300, dataPerDay: "1.5GB", validity: 28 })

Expected Output Structure (Your response MUST follow this structure):
{
  "planRecommendation": "Okay, I looked for Jio plans under ₹300 with 1.5GB/day data for 28 days. I found a couple of options for you.",
  "plans": [ /* array of plan objects from the tool, e.g., [{operator: 'Jio', price: 299, ...}, ...] */ ]
}

If no plans are found by the tool for specific criteria:
{
  "planRecommendation": "I searched for Jio plans under ₹100, but couldn't find any matching that criteria.",
  "plans": []
}

If query is too vague:
{
  "planRecommendation": "Sure, I can help with mobile plans. Could you tell me more about what you need? For example, which operator, your budget, or data requirements?",
  "plans": []
}

Strictly adhere to providing the output in the specified JSON structure with 'planRecommendation' (string) and 'plans' (array of plan objects or empty array).
`,
});

const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null and plans is an array, even if empty
    if (output && !output.plans) {
      output.plans = [];
    }
    return output || { planRecommendation: "Sorry, I encountered an issue. Please try again.", plans: [] };
  }
);

