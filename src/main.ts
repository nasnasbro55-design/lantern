import './game/hudBase.css';
import './ui/hud.css';
import Phaser from 'phaser';
import { MapScene } from './game/MapScene';
import { fallbackAllocation, fallbackEnd, fallbackPanel, fallbackWarnings } from './game/fallbackHud';
import { createSim } from './sim';
import { renderWarnings } from './ui/WarningFeed';
import { renderPanel } from './ui/DirectoratePanel';
import { showAllocation } from './ui/AllocationScreen';
import { showEnd } from './ui/EndScreens';

// HUD stage: a 960x640 layer over the canvas. Each HUD module gets its own container so none can overwrite another.
const stage = Object.assign(document.createElement('div'), { id: 'hud-stage' });
stage.style.cssText = 'position:absolute;left:50%;top:50%;width:960px;height:640px;transform:translate(-50%,-50%);pointer-events:none';
document.getElementById('hud')!.append(stage);
const slot = (id: string, css: string) => { const e = Object.assign(document.createElement('div'), { id }); e.style.cssText = `position:absolute;${css}`; stage.append(e); return e; };
const feed = slot('hud-warnings', 'left:760px;top:44px;width:190px'), panel = slot('hud-panel', 'left:760px;top:380px;width:190px'), modal = slot('hud-modal', ''), sim = createSim();
/** Run the real HUD module; if it drew nothing, draw the fallback instead. */
const draw = (el: HTMLElement, real: (el: HTMLElement) => void, fb: (el: HTMLElement) => void) => { el.replaceChildren(); real(el); if (!el.firstChild) fb(el); };
let sel = 12, scene: MapScene;

new Phaser.Game({
  type: Phaser.AUTO, parent: 'game', width: 960, height: 640, backgroundColor: '#0b0d12',
  scene: (scene = new MapScene(sim, {
    onState: w => { if (w.rule !== null && w.outcome === 'playing') modal.replaceChildren(); draw(feed, e => renderWarnings(e, w.alerts), e => fallbackWarnings(e, w.alerts)); draw(panel, e => renderPanel(e, w.levels[sel - 1]), e => fallbackPanel(e, w.levels[sel - 1])); },
    onSelect: l => { sel = l; },
    onAllocate: () => draw(modal, e => showAllocation(e, r => { sim.act({ type: 'alloc', level: 0, x: r === 'fair' ? 1 : 0 }); modal.replaceChildren(); scene.resume(); }), e => fallbackAllocation(e, r => { sim.act({ type: 'alloc', level: 0, x: r === 'fair' ? 1 : 0 }); modal.replaceChildren(); scene.resume(); })),
    onEnd: w => { draw(modal, e => showEnd(e, w.outcome === 'won'), e => fallbackEnd(e, w)); modal.append(Object.assign(document.createElement('p'), { textContent: w.note }), Object.assign(document.createElement('button'), { textContent: 'Play again', onclick: () => location.reload() })); },
  })),
});

// Dev-only hook for playtesting from the console; not present in production builds.
if ((import.meta as any).env?.DEV) (window as any).lantern = { sim, scene };
