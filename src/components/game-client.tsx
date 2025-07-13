"use client";

import { useState, useEffect, useCallback } from "react";
import { GameLayout } from "./game-layout";
import type { City, Route, Player } from "@/types";
import { 
  initialCities, 
  initialRoutes, 
  initialPlayer, 
  UPGRADE_COST, 
  UNLOCK_COST, 
  BUILD_ROUTE_COST,
  XP_FOR_UPGRADE,
  XP_FOR_UNLOCK,
  XP_FOR_BUILD,
  getXpForNextLevel,
  WIN_CONDITION_CURRENCY
} from "@/lib/game-data";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PartyPopper } from "lucide-react";

export default function GameClient() {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [isGameWon, setIsGameWon] = useState(false);
  const { toast } = useToast();

  const checkWinCondition = useCallback((updatedPlayer: Player, updatedCities: City[]) => {
    const allZonesUnlocked = updatedCities.filter(c => c.zone !== 'A').every(c => c.isUnlocked);
    if (allZonesUnlocked && updatedPlayer.currency >= WIN_CONDITION_CURRENCY) {
      setIsGameWon(true);
    }
  }, []);

  const handleLevelUp = useCallback((currentXp: number, currentLevel: number): Partial<Player> => {
    let newXp = currentXp;
    let newLevel = currentLevel;
    let xpForNextLevel = getXpForNextLevel(newLevel);
    let leveledUp = false;

    while (newXp >= xpForNextLevel) {
      newXp -= xpForNextLevel;
      newLevel++;
      xpForNextLevel = getXpForNextLevel(newLevel);
      leveledUp = true;
    }

    if (leveledUp) {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${newLevel}.`,
      });
    }

    return { level: newLevel, xp: newXp };
  }, [toast]);

  const addXp = useCallback((amount: number) => {
    setPlayer(p => {
      const newTotalXp = p.xp + amount;
      const levelUpdates = handleLevelUp(newTotalXp, p.level);
      const updatedPlayer = { ...p, ...levelUpdates };
      checkWinCondition(updatedPlayer, cities);
      return updatedPlayer;
    });
  }, [handleLevelUp, checkWinCondition, cities]);

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
      setPlayer(p => {
        const updatedPlayer = { ...p, currency: p.currency + income };
        checkWinCondition(updatedPlayer, cities);
        return updatedPlayer;
      });
    }, 1000); // Income tick every 1 second

    return () => clearInterval(gameInterval);
  }, [routes, cities, checkWinCondition]);

  const handleUpgradeRoute = (routeId: string) => {
    if (isGameWon) return;
    const route = routes.find(r => r.id === routeId);
    if (!route) return;
    
    const cost = UPGRADE_COST * route.level;

    if (player.currency >= cost) {
      setPlayer(p => {
        const updatedPlayer = { ...p, currency: p.currency - cost };
        checkWinCondition(updatedPlayer, cities);
        return updatedPlayer;
      });
      addXp(XP_FOR_UPGRADE);
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
    if (isGameWon) return;
    if (player.currency >= UNLOCK_COST) {
      const updatedCities = cities.map(c => c.zone === zone ? {...c, isUnlocked: true} : c);
      setCities(updatedCities);

      setPlayer(p => {
        const updatedPlayer = {...p, currency: p.currency - UNLOCK_COST};
        checkWinCondition(updatedPlayer, updatedCities);
        return updatedPlayer;
      });
      addXp(XP_FOR_UNLOCK);

      // This is a bit complex, so we'll do it in steps.
      // First, create a new map of cities with the updated unlocked status.
      const cityMap = new Map(updatedCities.map(c => [c.id, c]));

      // Then, unlock routes where both connected cities are now unlocked.
      setRoutes(prevRoutes => {
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

  const handleBuildRoute = (fromCityId: string, toCityId: string) => {
    if (isGameWon) return;
    if (player.currency < BUILD_ROUTE_COST) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${BUILD_ROUTE_COST} currency to build a new route.`,
        variant: "destructive",
      });
      return;
    }

    const routeExists = routes.some(r => 
      (r.from === fromCityId && r.to === toCityId) || (r.from === toCityId && r.to === fromCityId)
    );

    if (routeExists) {
      toast({
        title: "Route Exists",
        description: "A route between these two cities already exists.",
        variant: "destructive",
      });
      return;
    }
    
    setPlayer(p => {
      const updatedPlayer = {...p, currency: p.currency - BUILD_ROUTE_COST};
      checkWinCondition(updatedPlayer, cities);
      return updatedPlayer;
    });
    addXp(XP_FOR_BUILD);
    
    const newRoute: Route = {
      id: `r${routes.length + 1}`,
      from: fromCityId,
      to: toCityId,
      level: 1,
      capacity: 5,
      isUnlocked: true,
    };
    
    setRoutes(prevRoutes => [...prevRoutes, newRoute]);
    
    const fromCity = cities.find(c => c.id === fromCityId);
    const toCity = cities.find(c => c.id === toCityId);

    toast({
      title: "Route Built!",
      description: `New route created between ${fromCity?.name} and ${toCity?.name}.`,
    });
  };

  const networkData = { cities, routes };

  return (
    <>
      <GameLayout 
        player={player} 
        networkData={networkData} 
        onUpgradeRoute={handleUpgradeRoute}
        onUnlockZone={handleUnlockZone}
        onBuildRoute={handleBuildRoute}
      />
      <AlertDialog open={isGameWon}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-2xl">
              <PartyPopper className="mr-4 h-8 w-8 text-accent" />
              Congratulations, Tycoon!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You've successfully connected the entire nation and built a massive fortune. 
              Your transport empire is a marvel of efficiency. You have won the game!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsGameWon(false)}>Continue Playing</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
