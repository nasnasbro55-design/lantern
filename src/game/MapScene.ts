// Owner: Naz. The Hollow: 12 stacked levels, fog of truth, sensor placement, lights, taps, coughing, check-in sparks.
import Phaser from 'phaser';
import { ALLOC, COST, LEVELS, TICKS, type Sim, type WorldState } from '../sim';

export interface Hooks { onState(w: WorldState): void; onSelect(level: number): void; onAllocate(): void; onEnd(w: WorldState): void; }
type Tool = 'inspect' | 'sensor' | 'relay' | 'shaft';
const X0 = 60, RW = 60, Y0 = 44, RH = 46, TOOLS: Tool[] = ['inspect', 'sensor', 'relay', 'shaft'];
const rowY = (level: number) => Y0 + (level - 1) * RH;

export class MapScene extends Phaser.Scene {
  private w!: WorldState; private tool: Tool = 'inspect'; private running = false; private sel = 12; private g!: Phaser.GameObjects.Graphics;
  private vals: Phaser.GameObjects.Text[] = []; private status!: Phaser.GameObjects.Text; private toolTxt: Phaser.GameObjects.Text[] = []; private intro!: Phaser.GameObjects.Text; private timer?: Phaser.Time.TimerEvent;
  constructor(private sim: Sim, private hooks: Hooks) { super('map'); }

  create() {
    this.w = this.sim.reset(Date.now() % 100000); this.g = this.add.graphics();
    this.add.text(X0, 12, 'LANTERN  the Hollow', { color: '#f5c36b', fontSize: '16px', fontFamily: 'monospace' });
    for (let l = 1; l <= LEVELS; l++) {
      this.add.text(8, rowY(l) + 14, `L${l}`, { color: '#8892a6', fontSize: '13px', fontFamily: 'monospace' });
      this.vals.push(this.add.text(X0 + 10 * RW + 8, rowY(l) + 6, '', { fontSize: '11px', fontFamily: 'monospace', lineSpacing: 2 }));
    }
    this.status = this.add.text(8, 604, '', { color: '#cfd6e4', fontSize: '12px', fontFamily: 'monospace' });
    TOOLS.forEach((t, i) => this.toolTxt.push(this.add.text(8 + i * 118, 622, `${i + 1} ${t}${t === 'inspect' ? '' : ' ' + COST[t]}`, { fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#1b2030', padding: { x: 5, y: 2 } }).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.setTool(t))));
    this.intro = this.add.text(X0 + 5 * RW, 300, 'Press SPACE to begin\n1 inspect  2 sensor  3 relay  4 shaft\nClick a room to build or inspect.\nShafts link levels so check-ins reach L1.', { color: '#f5c36b', fontSize: '15px', fontFamily: 'monospace', align: 'center', backgroundColor: '#0b0d12cc', padding: { x: 14, y: 10 } }).setOrigin(0.5);
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      const l = Math.floor((p.y - Y0) / RH) + 1, x = Math.floor((p.x - X0) / RW);
      if (l < 1 || l > LEVELS || x < 0 || x > 9) return;
      this.sel = l; this.hooks.onSelect(l);
      if (this.tool !== 'inspect') this.w = this.sim.act({ type: this.tool, level: l, x });
      this.draw();
    });
    this.input.keyboard!.on('keydown-SPACE', () => this.toggle());
    TOOLS.forEach((t, i) => this.input.keyboard!.on(`keydown-${['ONE', 'TWO', 'THREE', 'FOUR'][i]}`, () => this.setTool(t)));
    this.timer = this.time.addEvent({ delay: 1100, loop: true, callback: () => this.running && this.tickOnce() });
    this.draw(); this.hooks.onSelect(this.sel);
  }

  private setTool(t: Tool) { this.tool = t; this.draw(); }
  private toggle() { if (this.w.outcome !== 'playing' || (this.w.tick === ALLOC - 1 && this.w.rule === null)) return; this.running = !this.running; this.intro.setVisible(false); this.draw(); }
  /** Called by main.ts once the player picked an allocation rule. */
  resume() { this.running = true; this.draw(); }

  private tickOnce() {
    this.w = this.sim.step();
    this.w.checkins.forEach(c => this.spark(c.level, c.ok));
    if (this.w.outcome !== 'playing') { this.running = false; this.hooks.onEnd(this.w); }
    else if (this.w.tick === ALLOC - 1 && this.w.rule === null) { this.running = false; this.hooks.onAllocate(); }
    this.draw();
  }

  private spark(level: number, ok: boolean) {
    const x = X0 + 5 * RW + Phaser.Math.Between(-90, 90), c = this.add.circle(x, rowY(level) + 22, 4, 0xf5c36b);
    this.tweens.add({ targets: c, y: ok ? rowY(1) + 22 : rowY(level) - Phaser.Math.Between(40, 140), alpha: ok ? 1 : 0, duration: 900, onComplete: () => c.destroy() });
  }

  private cough(level: number) {
    const t = this.add.text(X0 + Phaser.Math.Between(10, 9 * RW), rowY(level) + 10, Phaser.Math.RND.pick(['*cough*', 'hack', 'ahem']), { color: '#d9a066', fontSize: '10px', fontFamily: 'monospace' });
    this.tweens.add({ targets: t, y: t.y - 14, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  }

  update() { if (this.running) this.draw(); }

  private draw() {
    const g = this.g.clear(), w = this.w;
    w.levels.forEach(l => {
      const y = rowY(l.level), v = l.truth.voltage, flick = l.powered && v < 45 && Math.random() < 0.18, lit = !l.powered ? 0.04 : flick ? 0.25 : Math.min(1, v / 60);
      for (let x = 0; x < 10; x++) {
        g.fillStyle(0x2a2f40, 1).fillRect(X0 + x * RW + 1, y, RW - 2, RH - 4);
        g.fillStyle(0xf5d98a, 0.16 * lit).fillRect(X0 + x * RW + 1, y, RW - 2, RH - 4);
        if (l.powered || true) for (let r = 0; r < 2; r++) g.fillStyle(l.powered ? 0x9fb4d6 : 0x3a4152, 1).fillCircle(X0 + x * RW + 16 + r * 14 + ((x * 7 + l.level) % 5), y + RH - 12, 3);
      }
      g.fillStyle(0x0b0d12, 1 - lit * 0.9).fillRect(X0, y, 10 * RW, RH - 4);
      if (!l.sensed) g.fillStyle(0x6b7280, 0.38).fillRect(X0, y, 10 * RW, RH - 4);
      else g.lineStyle(2, 0xf5c36b, 1).strokeRect(X0, y, 10 * RW, RH - 4);
      if (l.level === this.sel) g.lineStyle(1, 0xffffff, 0.9).strokeRect(X0 - 2, y - 2, 10 * RW + 4, RH);
      const brown = l.sensed && l.truth.water < 40;
      g.fillStyle(brown ? 0x7a4a1d : 0x4aa3df, 1).fillCircle(X0 - 8, y + 12, 5);
      const t = this.vals[l.level - 1], r = l.sensed ? l.truth : l.official;
      t.setText(`V${Math.round(r.voltage)} T${Math.round(r.temp)}\nW${Math.round(r.water)} C${Math.round(r.cough)}${l.sensed ? '' : ' ?'}`).setColor(l.sensed ? '#f5c36b' : '#7d8596');
      if (l.sensed && l.truth.cough > 10 && this.running && Math.random() < Math.min(0.5, l.truth.cough / 60)) this.cough(l.level);
    });
    w.nodes.forEach(n => {
      const y = rowY(n.level) + RH / 2 - 2, x = X0 + n.x * RW + RW / 2;
      w.nodes.filter(m => m.link === n.link && n.link >= 0 && m.level === n.level - 1).forEach(m => g.lineStyle(3, 0x66d9e8, 1).lineBetween(x, y, X0 + m.x * RW + RW / 2, rowY(m.level) + RH / 2 - 2));
      w.nodes.filter(m => m !== n && m.level === n.level && m.x > n.x && m.x - n.x <= 4).forEach(m => g.lineStyle(1, 0x66d9e8, 0.6).lineBetween(x, y, X0 + m.x * RW + RW / 2, y));
      g.fillStyle(n.type === 'shaft' ? 0xff9f43 : 0x66d9e8, 1).fillRect(x - 5, y - 5, 10, 10);
    });
    w.levels.forEach(l => { if (l.sensed) { const sx = X0 + 9 * RW + RW / 2 - 24; g.fillStyle(0xf5c36b, 1).fillCircle(sx, rowY(l.level) + 10, 5).lineStyle(1, 0xf5c36b, 0.5).strokeCircle(sx, rowY(l.level) + 10, 9); } });
    this.toolTxt.forEach((t, i) => t.setColor(TOOLS[i] === this.tool ? '#f5c36b' : '#8892a6'));
    this.status.setText(`hour ${w.tick}/${TICKS}   build points ${w.points}   network ${w.netUp ? 'up' : 'CUT'}   ${this.running ? 'running' : 'paused (SPACE)'}   ${w.note}`);
    this.hooks.onState(w);
  }
}
