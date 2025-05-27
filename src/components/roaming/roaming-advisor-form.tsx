// src/components/roaming/roaming-advisor-form.tsx
"use client";

import { useState } from "react";
// Removed Image import: import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import type { RoamingAdvisorInput } from "@/types/roaming";
import { mockCountries } from "@/services/international-roaming";

const formSchema = z.object({
  destinationCountry: z.string().min(1, { message: "Please select a destination country." }),
  departureDate: z.date().optional(),
  returnDate: z.date().optional(),
  primaryUsage: z.enum(['data', 'calls', 'balanced', ''], {
    errorMap: () => ({ message: "Please select your primary usage." }),
  }),
}).refine(data => {
    if (data.departureDate && data.returnDate && data.departureDate > data.returnDate) {
        return false;
    }
    return true;
}, {
    message: "Return date must be after departure date.",
    path: ["returnDate"],
});

type RoamingAdvisorFormValues = z.infer<typeof formSchema>;

interface RoamingAdvisorFormProps {
  onSubmit: (data: RoamingAdvisorInput) => void;
  isLoading: boolean;
}

export function RoamingAdvisorForm({ onSubmit, isLoading }: RoamingAdvisorFormProps) {
  // Removed selectedCountryLabel state
  // const [selectedCountryLabel, setSelectedCountryLabel] = useState<string | null>(null);

  const form = useForm<RoamingAdvisorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationCountry: "",
      departureDate: undefined,
      returnDate: undefined,
      primaryUsage: "",
    },
  });

  function handleFormSubmit(values: RoamingAdvisorFormValues) {
    onSubmit(values as RoamingAdvisorInput);
  }

  // Simplified or removed handleCountryChange if it was only for the image
  const handleCountryChange = (value: string) => {
    form.setValue("destinationCountry", value); // Update form state
    // Removed logic for setting selectedCountryLabel
  };
  
  // Removed getDataAiHint function as it's no longer needed
  // const getDataAiHint = (label: string | null): string => { ... }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="destinationCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which country are you visiting?</FormLabel>
              <Select onValueChange={handleCountryChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockCountries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Removed Image display logic */}
        {/* {selectedCountryLabel && ( ... )} */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Departure Date from India</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Return Date to India</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        (form.getValues("departureDate") && date < form.getValues("departureDate")!) ||
                        date < new Date(new Date().setHours(0,0,0,0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="primaryUsage"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>What will be your primary use of mobile services abroad?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="data" />
                    </FormControl>
                    <FormLabel className="font-normal">Mostly Data</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="calls" />
                    </FormControl>
                    <FormLabel className="font-normal">Calls & SMS</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="balanced" />
                    </FormControl>
                    <FormLabel className="font-normal">Balanced Use</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin" />
              Finding Plans...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Roaming Plans
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
