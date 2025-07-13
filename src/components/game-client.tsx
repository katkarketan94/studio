"use client";

import { useState, useEffect } from "react";
import { GameLayout } from "./game-layout";
import type { City, Route, Player } from "@/types";
import { initialCities, initialRoutes, initialPlayer, UPGRADE_COST, UNLOCK_COST } from "@/lib/game-data";
import { useToast } from "@/hooks/use-toast";

export default function GameClient() {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const { toast } = useToast();

  // Game loop for passive income
  useEffect(() => {
    const gameInterval = setInterval(() => {
      let income = 0;
      routes.forEach(route => {
        if (route.isUnlocked) {
          const fromCity = cities.find(c => c.id === route.from);
          const toCity = cities.find(c => c.id === route.to);
          if (fromCity?.isUnlocked && toCity?.isUnlocked) {
            income += route.level * route.capacity * 2; // Income formula
          }
        }
      });
      setPlayer(p => ({ ...p, currency: p.currency + income }));
    }, 2000); // Income tick every 2 seconds

    return () => clearInterval(gameInterval);
  }, [routes, cities]);

  const handleUpgradeRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return;
    
    const cost = UPGRADE_COST * route.level;

    if (player.currency >= cost) {
      setPlayer(p => ({ ...p, currency: p.currency - cost }));
      setRoutes(prevRoutes =>
        prevRoutes.map(r =>
          r.id === routeId
            ? { ...r, level: r.level + 1, capacity: r.capacity + 5 }
            : r
        )
      );
      toast({
        title: "Route Upgraded!",
        description: `Route ${routeId.toUpperCase()} is now level ${route.level + 1}.`,
      });
    } else {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough currency to upgrade this route.",
        variant: "destructive",
      });
    }
  };
  
  const handleUnlockZone = (zone: 'B' | 'C') => {
    if (player.currency >= UNLOCK_COST) {
      setPlayer(p => ({...p, currency: p.currency - UNLOCK_COST}));
      setCities(prevCities => prevCities.map(c => c.zone === zone ? {...c, isUnlocked: true} : c));

      // Unlock routes that are now fully within unlocked zones
      setRoutes(prevRoutes => {
        const cityMap = new Map(cities.map(c => c.zone === zone ? {...c, isUnlocked: true} : c).map(c => [c.id, c]));
        return prevRoutes.map(r => {
          const fromCity = cityMap.get(r.from);
          const toCity = cityMap.get(r.to);
          if (fromCity?.isUnlocked && toCity?.isUnlocked) {
            return {...r, isUnlocked: true};
          }
          return r;
        })
      });

      toast({
        title: `Zone ${zone} Unlocked!`,
        description: `New cities and routes are now available.`,
      });

    } else {
       toast({
        title: "Insufficient Funds",
        description: `You need ${UNLOCK_COST} currency to unlock Zone ${zone}.`,
        variant: "destructive",
      });
    }
  }

  const networkData = { cities, routes };

  return (
    <GameLayout 
      player={player} 
      networkData={networkData} 
      onUpgradeRoute={handleUpgradeRoute}
      onUnlockZone={handleUnlockZone}
    />
  );
}
