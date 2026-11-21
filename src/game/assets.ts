import Phaser from 'phaser';
/** Optional art and sound. public/assets/manifest.json lists the files that exist; anything not listed is skipped and the game keeps its built-in shapes and silence. */
interface Manifest { images?: Record<string, string>; audio?: Record<string, string | string[]> }
export const loadManifest = (s: Phaser.Scene) => {
  s.load.json('manifest', 'assets/manifest.json');
  s.load.once('filecomplete-json-manifest', (_k: string, _t: string, m: Manifest) => { Object.entries(m?.images ?? {}).forEach(([k, f]) => s.load.image(k, `assets/${f}`)); Object.entries(m?.audio ?? {}).forEach(([k, f]) => s.load.audio(k, [f].flat().map(x => `assets/${x}`))); });
};
export const hasImg = (s: Phaser.Scene, k: string) => s.textures.exists(k);
const last: Record<string, number> = {}, GAP: Record<string, number> = { cough: 1800, spark: 500, drip: 900, lightsout: 600 };
/** Plays a sound if it exists, at most once per GAP[k] ms so busy moments do not stack into noise. */
export const sfx = (s: Phaser.Scene, k: string, o: Phaser.Types.Sound.SoundConfig = {}) => { const now = performance.now(); if (!s.cache.audio.exists(k) || now - (last[k] ?? -1e9) < (GAP[k] ?? 0)) return; last[k] = now; s.sound.play(k, { volume: 0.6, ...o }); };
export const music = (s: Phaser.Scene, k: string) => { if (s.cache.audio.exists(k) && !s.sound.get(k)) s.sound.play(k, { loop: true, volume: 0.3 }); };
