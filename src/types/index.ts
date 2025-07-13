export interface City {
  id: string;
  name: string;
  x: number;
  y: number;
  demand: number;
  isUnlocked: boolean;
  zone: 'A' | 'B' | 'C';
}

export interface Route {
  id: string;
  from: string; // cityId
  to: string; // cityId
  level: number;
  capacity: number; // How many resources can flow per tick
  isUnlocked: boolean;
}

export interface Player {
  currency: number;
  level: number;
  xp: number;
}

export type SuggestedUpgrade = {
  routeId: string;
  upgradeType: 'capacity' | 'new_route';
  cost: number;
  reason: string;
};

export type NetworkData = {
  cities: City[];
  routes: Route[];
}
