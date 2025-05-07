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
import {getTelecomPlans, TelecomPlan, TelecomPlanFilter} from '@/services/telecom-plans';

const RecommendPlanInputSchema = z.object({
  query: z.string().describe('The user query for plan recommendations.'),
});
export type RecommendPlanInput = z.infer<typeof RecommendPlanInputSchema>;

const RecommendPlanOutputSchema = z.object({
  planRecommendation: z.string().describe('A recommendation of telecom plans based on the user query.'),
  plans: z.array(z.any()).describe('List of telecom plans based on the recommendation'),
});
export type RecommendPlanOutput = z.infer<typeof RecommendPlanOutputSchema>;

export async function recommendPlan(input: RecommendPlanInput): Promise<RecommendPlanOutput> {
  return recommendPlanFlow(input);
}

const getFilteredPlans = ai.defineTool({
  name: 'getFilteredPlans',
  description: 'Retrieves a list of telecom plans based on specified filters.',
  inputSchema: z.object({
    operator: z.string().optional().describe('The telecom operator (e.g., Airtel, Jio, Vi).'),
    minPrice: z.number().optional().describe('The minimum price of the plan.'),
    maxPrice: z.number().optional().describe('The maximum price of the plan.'),
    dataPerDay: z.string().optional().describe('The amount of data per day (e.g., 1GB, 2GB).'),
    validity: z.number().optional().describe('The validity of the plan in days.'),
  }),
  outputSchema: z.array(z.any()),
},
async (input) => {
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
  prompt: `You are a telecom plan recommendation expert. A user will provide a query, and you will recommend a telecom plan based on their needs.

  In your response, use the getFilteredPlans tool to find plans that match the user's query. If the user mentions a specific operator, price range, data, or validity, use those as filters.

  User Query: {{{query}}}

  Example:
  User: I need a Jio plan under ₹500 with good data for 3 months
  Assistant: Based on your needs, I recommend the following plans:
  
  Here are the available plans based on your requirements: {{toolResult name='getFilteredPlans'}}`,
});

const recommendPlanFlow = ai.defineFlow(
  {
    name: 'recommendPlanFlow',
    inputSchema: RecommendPlanInputSchema,
    outputSchema: RecommendPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
