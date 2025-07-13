"use client";

import type { Player, NetworkData } from "@/types";
import { SidebarProvider, Sidebar, SidebarInset } from "./ui/sidebar";
import { InfoPanel } from "./info-panel";
import { GameMap } from "./game-map";

interface GameLayoutProps {
  player: Player;
  networkData: NetworkData;
  onUpgradeRoute: (routeId: string) => void;
  onUnlockZone: (zone: 'B' | 'C') => void;
  onBuildRoute: (fromCityId: string, toCityId: string) => void;
}

export function GameLayout({ player, networkData, onUpgradeRoute, onUnlockZone, onBuildRoute }: GameLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-screen flex">
        <Sidebar side="right" className="w-80 border-l" collapsible="none">
          <InfoPanel 
            player={player} 
            networkData={networkData}
            onUpgradeRoute={onUpgradeRoute}
          />
        </Sidebar>
        <SidebarInset className="flex-1 p-4">
          <GameMap 
            player={player} 
            networkData={networkData}
            onUpgradeRoute={onUpgradeRoute}
            onUnlockZone={onUnlockZone}
            onBuildRoute={onBuildRoute}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
