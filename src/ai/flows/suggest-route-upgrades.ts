'use server';

/**
 * @fileOverview An AI agent that suggests route upgrades based on current resource flow and demand.
 *
 * - suggestRouteUpgrades - A function that provides suggestions for route upgrades.
 * - SuggestRouteUpgradesInput - The input type for the suggestRouteUpgrades function.
 * - SuggestRouteUpgradesOutput - The return type for the suggestRouteUpgrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRouteUpgradesInputSchema = z.object({
  networkData: z
    .string()
    .describe(
      'A stringified JSON representing the current state of the network, including cities, routes, resources, and demand.'
    ),
  playerResources: z
    .string()
    .describe('A stringified JSON representing the current resources of the player.'),
});
export type SuggestRouteUpgradesInput = z.infer<typeof SuggestRouteUpgradesInputSchema>;

const SuggestRouteUpgradesOutputSchema = z.object({
  suggestedUpgrades: z
    .string()
    .describe(
      'A stringified JSON array of suggestions for route upgrades, including the route ID, upgrade type, and cost.'
    ),
  reasoning: z
    .string()
    .describe('The AI agents reasoning for the suggested route upgrades'),
});
export type SuggestRouteUpgradesOutput = z.infer<typeof SuggestRouteUpgradesOutputSchema>;

export async function suggestRouteUpgrades(
  input: SuggestRouteUpgradesInput
): Promise<SuggestRouteUpgradesOutput> {
  return suggestRouteUpgradesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRouteUpgradesPrompt',
  input: {schema: SuggestRouteUpgradesInputSchema},
  output: {schema: SuggestRouteUpgradesOutputSchema},
  prompt: `You are an expert network optimization consultant for a resource transport game.  Based on the current network state and the player's resources, suggest the best route upgrades to improve resource flow and increase the player's income.  Provide your suggestions in JSON format.

Network Data: {{{networkData}}}
Player Resources: {{{playerResources}}}

Consider these factors when forming your suggestions:
* Current resource flow and bottlenecks
* Demand in different cities
* Cost of upgrades
* Player's available resources

Your response should be a JSON object with two keys:
* suggestedUpgrades: A JSON array of suggestions for route upgrades, including the route ID, upgrade type, and cost.
* reasoning: A string explaining why you are making these suggestions.

Make sure the suggestedUpgrades field is a valid JSON string, and the reasoning field is a well written explanation.
`,
});

const suggestRouteUpgradesFlow = ai.defineFlow(
  {
    name: 'suggestRouteUpgradesFlow',
    inputSchema: SuggestRouteUpgradesInputSchema,
    outputSchema: SuggestRouteUpgradesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
