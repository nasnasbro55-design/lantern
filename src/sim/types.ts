// Data contract between the simulation core and the game. The sim lead owns this file; the game and UI only read it.
// Fields below the original five were added additively (points, nodes, checkins, rule, surface, outcome, note), nothing was renamed.
export type Kind = 'voltage' | 'temp' | 'water' | 'cough';
export interface LevelState { level: number; truth: Record<Kind, number>; official: Record<Kind, number>; sensed: boolean; powered: boolean; }
export interface Alert { level: number; kind: Kind; eta: number; severity: 'watch' | 'high' | 'critical'; }
/** A built mesh point. Shafts create two linked points (level and the level above); a shaft on level 1 is the surface exit. */
export interface MeshPoint { type: 'relay' | 'shaft'; level: number; x: number; link: number; }
export interface Checkin { level: number; ok: boolean; }
export interface WorldState {
  tick: number; levels: LevelState[]; alerts: Alert[]; netUp: boolean; supply: number;
  points: number; nodes: MeshPoint[]; checkins: Checkin[]; rule: 'directorate' | 'fair' | null;
  surface: boolean; outcome: 'playing' | 'won' | 'lost'; note: string;
}
/** act: sensor, relay, shaft place a build on (level, x 0 to 9). alloc picks the rule: x = 0 Directorate, x = 1 fair share. */
export interface Sim { reset(seed: number): WorldState; step(): WorldState; act(a: { type: 'sensor' | 'relay' | 'shaft' | 'alloc'; level: number; x: number }): WorldState; }
