// Data contract between the simulation core and the game. The sim lead owns this file; the game and UI only read it.
export type Kind = 'voltage' | 'temp' | 'water' | 'cough';
export interface LevelState { level: number; truth: Record<Kind, number>; official: Record<Kind, number>; sensed: boolean; powered: boolean; }
export interface Alert { level: number; kind: Kind; eta: number; severity: 'watch' | 'high' | 'critical'; }
export interface WorldState { tick: number; levels: LevelState[]; alerts: Alert[]; netUp: boolean; supply: number; }
export interface Sim { reset(seed: number): WorldState; step(): WorldState; act(a: { type: 'sensor' | 'relay' | 'shaft'; level: number; x: number }): WorldState; }
