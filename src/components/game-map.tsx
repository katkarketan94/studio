"use client";

import type { City, Route, Player, NetworkData } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Lock, Zap } from "lucide-react";
import { UNLOCK_COST, UPGRADE_COST } from "@/lib/game-data";
import { cn } from "@/lib/utils";

interface GameMapProps {
  networkData: NetworkData;
  player: Player;
  onUpgradeRoute: (routeId: string) => void;
  onUnlockZone: (zone: 'B' | 'C') => void;
}

export function GameMap({ networkData, player, onUpgradeRoute, onUnlockZone }: GameMapProps) {
  const { cities, routes } = networkData;
  const cityMap = new Map(cities.map(c => [c.id, c]));

  const getCity = (id: string) => cityMap.get(id);

  const zones = {
    B: { x: 35, y: 10, width: 35, height: 80, unlocked: cities.some(c => c.zone === 'B' && c.isUnlocked) },
    C: { x: 70, y: 10, width: 25, height: 80, unlocked: cities.some(c => c.zone === 'C' && c.isUnlocked) },
  };

  return (
    <div className="w-full h-full bg-background rounded-lg shadow-inner overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Zone Rectangles */}
        {Object.entries(zones).map(([zone, data]) => (
          !data.unlocked && (
            <g key={zone} onClick={() => onUnlockZone(zone as 'B' | 'C')}>
              <rect
                x={data.x}
                y={data.y}
                width={data.width}
                height={data.height}
                className={cn(
                  "fill-muted/50 stroke-border stroke-2 stroke-dashed rounded-lg transition-all",
                   player.currency >= UNLOCK_COST ? "cursor-pointer hover:fill-primary/20 hover:stroke-primary" : "cursor-not-allowed"
                )}
              />
              <Lock
                x={data.x + data.width / 2 - 2}
                y={data.y + data.height / 2 - 2}
                className="text-muted-foreground w-4 h-4"
              />
               <text x={data.x + data.width / 2} y={data.y + data.height / 2 + 6} className="text-[2px] font-bold fill-muted-foreground text-anchor-middle">
                Unlock Zone {zone}
              </text>
              <text x={data.x + data.width / 2} y={data.y + data.height / 2 + 9} className="text-[1.5px] fill-muted-foreground text-anchor-middle">
                Cost: {UNLOCK_COST}
              </text>
            </g>
          )
        ))}

        {/* Routes */}
        {routes.map(route => {
          const fromCity = getCity(route.from);
          const toCity = getCity(route.to);
          if (!fromCity || !toCity) return null;

          const isInteractable = route.isUnlocked || (fromCity.isUnlocked && toCity.isUnlocked);
          const canAffordUpgrade = player.currency >= UPGRADE_COST * route.level;

          return (
            <g key={route.id} className={cn(!isInteractable && "pointer-events-none")}>
              <Popover>
                <PopoverTrigger asChild disabled={!route.isUnlocked}>
                  <line
                    x1={fromCity.x}
                    y1={fromCity.y}
                    x2={toCity.x}
                    y2={toCity.y}
                    className={cn(
                      "transition-all duration-300",
                      route.isUnlocked ? "stroke-primary/50 hover:stroke-accent cursor-pointer" : "stroke-border stroke-dashed",
                    )}
                    strokeWidth={route.isUnlocked ? 0.5 + route.level * 0.2 : 0.3}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg">Route {route.id.toUpperCase()}</h4>
                      <p className="text-sm text-muted-foreground">Level {route.level}</p>
                    </div>
                    <p>Capacity: {route.capacity} units/sec</p>
                    <Button
                      className="w-full"
                      onClick={() => onUpgradeRoute(route.id)}
                      disabled={!canAffordUpgrade}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade (Cost: {UPGRADE_COST * route.level})
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Animated flow */}
              {route.isUnlocked && (
                <circle r="0.4" className="fill-accent">
                  <animateMotion
                    dur={`${10 / route.level}s`}
                    repeatCount="indefinite"
                    path={`M ${fromCity.x} ${fromCity.y} L ${toCity.x} ${toCity.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Cities */}
        {cities.map(city => (
          <g key={city.id} className={cn(!city.isUnlocked && "opacity-50 pointer-events-none")}>
            <circle cx={city.x} cy={city.y} r="2" className="fill-primary" />
            <circle cx={city.x} cy={city.y} r="1.5" className="fill-background" />
            <text x={city.x} y={city.y - 3} className="text-[2px] font-bold fill-foreground text-anchor-middle">
              {city.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
