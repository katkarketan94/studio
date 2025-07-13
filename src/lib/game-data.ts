import type { City, Route, Player } from '@/types';

export const UPGRADE_COST = 1500;
export const UNLOCK_COST = 5000;

export const initialCities: City[] = [
  { id: 'c1', name: 'Aethelburg', x: 15, y: 20, demand: 5, isUnlocked: true, zone: 'A' },
  { id: 'c2', name: 'Westford', x: 25, y: 45, demand: 8, isUnlocked: true, zone: 'A' },
  { id: 'c3', name: 'Northbridge', x: 10, y: 70, demand: 6, isUnlocked: true, zone: 'A' },
  
  { id: 'c4', name: 'Stonewall', x: 45, y: 15, demand: 12, isUnlocked: false, zone: 'B' },
  { id: 'c5', name: 'Ironstead', x: 60, y: 35, demand: 15, isUnlocked: false, zone: 'B' },
  { id: 'c6', name: 'Goldhaven', x: 50, y: 65, demand: 10, isUnlocked: false, zone: 'B' },

  { id: 'c7', name: 'Silvercoast', x: 85, y: 25, demand: 20, isUnlocked: false, zone: 'C' },
  { id: 'c8', name: 'Port Azure', x: 90, y: 50, demand: 25, isUnlocked: false, zone: 'C' },
  { id: 'c9', name: 'Crystal Falls', x: 80, y: 80, demand: 18, isUnlocked: false, zone: 'C' },
];

export const initialRoutes: Route[] = [
  { id: 'r1', from: 'c1', to: 'c2', level: 1, capacity: 5, isUnlocked: true },
  { id: 'r2', from: 'c2', to: 'c3', level: 1, capacity: 5, isUnlocked: true },

  { id: 'r3', from: 'c1', to: 'c4', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r4', from: 'c2', to: 'c5', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r5', from: 'c4', to: 'c5', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r6', from: 'c5', to: 'c6', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r7', from: 'c3', to: 'c6', level: 1, capacity: 5, isUnlocked: false },

  { id: 'r8', from: 'c5', to: 'c7', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r9', from: 'c7', to: 'c8', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r10', from: 'c6', to: 'c9', level: 1, capacity: 5, isUnlocked: false },
  { id: 'r11', from: 'c8', to: 'c9', level: 1, capacity: 5, isUnlocked: false },
];

export const initialPlayer: Player = {
  currency: 2000,
};
