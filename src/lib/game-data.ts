import type { City, Route, Player } from '@/types';

export const UPGRADE_COST = 1500;
export const UNLOCK_COST = 5000;
export const BUILD_ROUTE_COST = 2500;
export const WIN_CONDITION_CURRENCY = 1000000;

export const XP_FOR_UPGRADE = 50;
export const XP_FOR_UNLOCK = 250;
export const XP_FOR_BUILD = 100;
export const getXpForNextLevel = (level: number) => 100 * Math.pow(level, 1.5);

// Cities based on India map
export const initialCities: City[] = [
  // Zone A (West - Unlocked by default)
  { id: 'c1', name: 'Mumbai', x: 25, y: 60, demand: 10, isUnlocked: true, zone: 'A' },
  { id: 'c2', name: 'Pune', x: 30, y: 65, demand: 8, isUnlocked: true, zone: 'A' },
  { id: 'c3', name: 'Ahmedabad', x: 20, y: 45, demand: 7, isUnlocked: true, zone: 'A' },
  
  // Zone B (South - Locked)
  { id: 'c4', name: 'Bengaluru', x: 45, y: 80, demand: 15, isUnlocked: false, zone: 'B' },
  { id: 'c5', name: 'Chennai', x: 58, y: 82, demand: 14, isUnlocked: false, zone: 'B' },
  { id: 'c6', name: 'Hyderabad', x: 50, y: 70, demand: 12, isUnlocked: false, zone: 'B' },

  // Zone C (North - Locked)
  { id: 'c7', name: 'New Delhi', x: 48, y: 25, demand: 25, isUnlocked: false, zone: 'C' },
  { id: 'c8', name: 'Jaipur', x: 40, y: 32, demand: 9, isUnlocked: false, zone: 'C' },
  { id: 'c9', name: 'Kolkata', x: 85, y: 48, demand: 18, isUnlocked: false, zone: 'C' },
];

// Routes based on Indian cities
export const initialRoutes: Route[] = [
  // Zone A routes
  { id: 'r1', from: 'c1', to: 'c2', level: 1, capacity: 5, isUnlocked: true }, // Mumbai - Pune
  { id: 'r2', from: 'c1', to: 'c3', level: 1, capacity: 5, isUnlocked: true }, // Mumbai - Ahmedabad

  // Connecting Zone A to B
  { id: 'r3', from: 'c2', to: 'c6', level: 1, capacity: 5, isUnlocked: false }, // Pune - Hyderabad
  
  // Zone B routes
  { id: 'r4', from: 'c6', to: 'c4', level: 1, capacity: 5, isUnlocked: false }, // Hyderabad - Bengaluru
  { id: 'r5', from: 'c4', to: 'c5', level: 1, capacity: 5, isUnlocked: false }, // Bengaluru - Chennai

  // Connecting Zone A to C
  { id: 'r6', from: 'c3', to: 'c8', level: 1, capacity: 5, isUnlocked: false }, // Ahmedabad - Jaipur
  { id: 'r7', from: 'c1', to: 'c7', level: 1, capacity: 5, isUnlocked: false }, // Mumbai - Delhi (long route)
  
  // Zone C routes
  { id: 'r8', from: 'c7', to: 'c8', level: 1, capacity: 5, isUnlocked: false }, // Delhi - Jaipur
  { id: 'r9', from: 'c7', to: 'c9', level: 1, capacity: 5, isUnlocked: false }, // Delhi - Kolkata

  // Connecting B to C
  { id: 'r10', from: 'c6', to: 'c9', level: 1, capacity: 5, isUnlocked: false }, // Hyderabad - Kolkata
];


export const initialPlayer: Player = {
  currency: 2000,
  level: 1,
  xp: 0,
};
