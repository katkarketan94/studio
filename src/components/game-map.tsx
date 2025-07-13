"use client";

import { useState } from "react";
import type { City, Route, Player, NetworkData } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Lock, Zap, Hammer, X } from "lucide-react";
import { UNLOCK_COST, UPGRADE_COST, BUILD_ROUTE_COST } from "@/lib/game-data";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GameMapProps {
  networkData: NetworkData;
  player: Player;
  onUpgradeRoute: (routeId: string) => void;
  onUnlockZone: (zone: 'B' | 'C') => void;
  onBuildRoute: (fromCityId: string, toCityId: string) => void;
}

export function GameMap({ networkData, player, onUpgradeRoute, onUnlockZone, onBuildRoute }: GameMapProps) {
  const { cities, routes } = networkData;
  const cityMap = new Map(cities.map(c => [c.id, c]));

  const [isBuildMode, setIsBuildMode] = useState(false);
  const [firstCity, setFirstCity] = useState<City | null>(null);

  const getCity = (id: string) => cityMap.get(id);

  const zones = {
    B: { x: 35, y: 10, width: 35, height: 80, unlocked: cities.some(c => c.zone === 'B' && c.isUnlocked) },
    C: { x: 70, y: 10, width: 25, height: 80, unlocked: cities.some(c => c.zone === 'C' && c.isUnlocked) },
  };

  const handleCityClick = (city: City) => {
    if (!isBuildMode || !city.isUnlocked) return;

    if (!firstCity) {
      setFirstCity(city);
    } else {
      if (firstCity.id !== city.id) {
        onBuildRoute(firstCity.id, city.id);
      }
      setFirstCity(null);
      setIsBuildMode(false);
    }
  };

  const toggleBuildMode = () => {
    setIsBuildMode(!isBuildMode);
    setFirstCity(null);
  };

  return (
    <div className="w-full h-full bg-background rounded-lg shadow-inner overflow-hidden relative">
       <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button onClick={toggleBuildMode} variant={isBuildMode ? "secondary" : "outline"} disabled={player.currency < BUILD_ROUTE_COST}>
          {isBuildMode ? <X className="mr-2" /> : <Hammer className="mr-2" />}
          {isBuildMode ? "Cancel Build" : `Build Route (${BUILD_ROUTE_COST} C)`}
        </Button>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* India Map Background */}
        <image 
          href="https://storage.googleapis.com/prototyper-media/india-map-outline.svg" 
          x="10" y="5" width="80" height="90"
          className="opacity-10"
          data-ai-hint="india map"
        />

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
            <g key={route.id} className={cn(!isInteractable && "pointer-events-none", isBuildMode && "opacity-50 pointer-events-none")}>
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
          <g 
            key={city.id} 
            className={cn(
              !city.isUnlocked && "opacity-50 pointer-events-none", 
              isBuildMode && city.isUnlocked && "cursor-pointer",
              isBuildMode && !city.isUnlocked && "cursor-not-allowed"
            )}
            onClick={() => handleCityClick(city)}
          >
            <circle 
              cx={city.x} 
              cy={city.y} 
              r="2.5" 
              className={cn(
                "fill-transparent transition-all",
                firstCity?.id === city.id && "fill-accent/50 stroke-accent stroke-2",
                isBuildMode && city.isUnlocked && "hover:fill-accent/30"
              )} 
            />
            <circle cx={city.x} cy={city.y} r="2" className="fill-primary" />
            <circle cx={city.x} cy={city.y} r="1.5" className="fill-background" />
            <text x={city.x} y={city.y - 3} className="text-[2px] font-bold fill-foreground text-anchor-middle">
              {city.name}
            </text>
          </g>
        ))}
        
        {isBuildMode && firstCity && (
          <text x="50" y="95" className="text-[2px] font-bold fill-foreground text-anchor-middle animate-pulse">
            Select a second city to build a route from {firstCity.name}.
          </text>
        )}
      </svg>
    </div>
  );
}
