"use client";

import type { Player, NetworkData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Coins, HelpCircle } from "lucide-react";
import { AiSuggestions } from "./ai-suggestions";
import { Separator } from "./ui/separator";

interface InfoPanelProps {
  player: Player;
  networkData: NetworkData;
  onUpgradeRoute: (routeId: string) => void;
}

export function InfoPanel({ player, networkData, onUpgradeRoute }: InfoPanelProps) {
  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-sidebar text-sidebar-foreground">
      <Card className="bg-sidebar-accent text-sidebar-accent-foreground">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Coins className="mr-2 text-amber-400" />
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold tracking-tighter">
            {player.currency.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">CURRENCY</p>
        </CardContent>
      </Card>

      <div className="flex-grow">
        <AiSuggestions 
          networkData={networkData}
          player={player}
          onUpgradeRoute={onUpgradeRoute}
        />
      </div>

      <Separator className="my-4 bg-sidebar-border" />

      <Card className="bg-transparent border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <HelpCircle className="mr-2 h-5 w-5" />
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>
            <strong className="text-sidebar-foreground">Goal:</strong> Maximize your income by building an efficient transport network.
          </p>
          <p>
            <strong className="text-sidebar-foreground">Actions:</strong> Click on routes to upgrade them or on locked zones to expand your network.
          </p>
          <p>
            <strong className="text-sidebar-foreground">AI Help:</strong> Use the AI Suggestions to find the best opportunities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
