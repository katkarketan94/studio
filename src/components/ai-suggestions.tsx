"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { suggestRouteUpgrades } from "@/ai/flows/suggest-route-upgrades";
import type { NetworkData, Player, SuggestedUpgrade } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface AiSuggestionsProps {
  networkData: NetworkData;
  player: Player;
  onUpgradeRoute: (routeId: string) => void;
}

export function AiSuggestions({ networkData, player, onUpgradeRoute }: AiSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedUpgrade[] | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setReasoning("");

    try {
      const result = await suggestRouteUpgrades({
        networkData: JSON.stringify(networkData),
        playerResources: JSON.stringify(player),
      });
      
      const parsedSuggestions = JSON.parse(result.suggestedUpgrades);
      setSuggestions(parsedSuggestions);
      setReasoning(result.reasoning);
    } catch (e) {
      console.error(e);
      setError("Failed to get suggestions from AI. The network might be too complex or an unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSheetOpen = (open: boolean) => {
    setIsOpen(open);
    if(open && !suggestions && !loading) {
      getSuggestions();
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-amber-500">
          <Lightbulb className="mr-2 h-4 w-4" />
          AI Suggestions
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6">
          <SheetTitle>AI Route Upgrade Suggestions</SheetTitle>
          <SheetDescription>
            Let our AI assistant analyze your network and suggest the most profitable upgrades.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <div className="px-6 pb-6 space-y-4">
            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Analyzing network...</p>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            
            {suggestions && (
              <Card>
                <CardHeader>
                  <CardTitle>Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{reasoning}</p>
                </CardContent>
              </Card>
            )}
            
            {suggestions?.map((suggestion, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Upgrade Route {suggestion.routeId.toUpperCase()}</CardTitle>
                  <CardDescription>Cost: {suggestion.cost} Currency</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{suggestion.reason}</p>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      onUpgradeRoute(suggestion.routeId);
                      setIsOpen(false);
                    }}
                    disabled={player.currency < suggestion.cost}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Apply Upgrade
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="p-6 bg-background/95 border-t">
          <Button onClick={getSuggestions} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Re-analyze Network
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
