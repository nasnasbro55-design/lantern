// Owner: Naz. Minimal stand-ins so the game is playable before the real HUD modules land. Each runs only when the real module drew nothing.
import type { Alert, LevelState, WorldState } from '../sim';
import type { AllocationRule } from '../ui/AllocationScreen';

const box = (el: HTMLElement, css: string) => { el.style.cssText += `;font:12px monospace;color:#cfd6e4;background:#141826dd;padding:8px;pointer-events:auto;${css}`; return el; };
const row = (el: HTMLElement, txt: string, color = '') => { const d = document.createElement('div'); d.textContent = txt; d.style.color = color; el.append(d); };

export function fallbackWarnings(el: HTMLElement, alerts: Alert[]) {
  box(el, 'max-height:300px;overflow:hidden'); row(el, 'EARLY WARNINGS', '#f5c36b');
  alerts.slice(0, 12).forEach(a => row(el, `L${a.level} ${a.kind} ${a.eta ? `in ~${a.eta}h` : 'NOW'}`, { watch: '#9fb4d6', high: '#ff9f43', critical: '#ff5d5d' }[a.severity]));
  if (!alerts.length) row(el, 'No sensed levels at risk.', '#7d8596');
}
export function fallbackPanel(el: HTMLElement, l: LevelState) {
  box(el, ''); row(el, `LEVEL ${l.level}`, '#f5c36b'); row(el, l.sensed ? 'Lantern says (truth)' : 'Directorate says (official)', l.sensed ? '#f5c36b' : '#7d8596');
  const v = l.sensed ? l.truth : l.official; row(el, `power ${Math.round(v.voltage)}  heat ${Math.round(v.temp)}`); row(el, `water ${Math.round(v.water)}  cough ${Math.round(v.cough)}`);
}
export function fallbackAllocation(root: HTMLElement, onChoose: (r: AllocationRule) => void) {
  const el = root.appendChild(document.createElement('div')); box(el, 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:360px;font-size:14px;text-align:center'); row(el, 'Supply is running short. Who gets power, water and food?', '#f5c36b');
  ([['directorate', 'Directorate: upper levels first'], ['fair', 'Fair share: hardest hit levels first']] as const).forEach(([r, label]) => { const b = document.createElement('button'); b.textContent = label; b.style.cssText = 'display:block;width:100%;margin:8px 0;padding:8px;font:inherit;cursor:pointer'; b.onclick = () => onChoose(r); el.append(b); });
}
export function fallbackEnd(root: HTMLElement, w: WorldState) {
  const el = root.appendChild(document.createElement('div')); box(el, 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:440px;box-sizing:border-box;padding:18px 24px;line-height:1.5;font-size:15px;text-align:center'); row(el, w.outcome === 'won' ? 'THE HOLLOW HOLDS' : 'THE LIGHTS WENT OUT', '#f5c36b'); row(el, w.note);
  const b = document.createElement('button'); b.textContent = 'Play again'; b.style.cssText = 'margin-top:10px;padding:8px 16px;font:inherit;cursor:pointer'; b.onclick = () => location.reload(); el.append(b);
}
