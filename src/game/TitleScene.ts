import Phaser from 'phaser';
import { hasImg, loadManifest } from './assets';

/** Loads optional art and sound, shows the title, and starts the Hollow on SPACE or click. Add ?skip to the URL to jump straight in. */
export class TitleScene extends Phaser.Scene {
  constructor() { super('title'); }
  preload() { loadManifest(this); }
  create() {
    this.add.rectangle(480, 320, 960, 640, 0x0b0d12);
    if (hasImg(this, 'title')) this.add.image(480, 320, 'title').setScale(640 / 540);
    else this.add.text(480, 240, 'LANTERN', { color: '#f5c36b', fontSize: '72px', fontFamily: 'monospace' }).setOrigin(0.5);
    const t = (y: number, s: string, c: string, z: number) => this.add.text(480, y, s, { color: c, fontSize: `${z}px`, fontFamily: 'monospace', align: 'center' }).setOrigin(0.5);
    if (!hasImg(this, 'title')) t(310, 'the Hollow: twelve levels, forty-eight hours, one honest signal', '#cfd6e4', 16);
    this.tweens.add({ targets: t(hasImg(this, 'title') ? 606 : 520, 'Press SPACE or click to descend', '#f5c36b', 20), alpha: 0.25, duration: 800, yoyo: true, repeat: -1 });
    const go = () => this.scene.start('map');
    this.input.keyboard!.once('keydown-SPACE', go); this.input.once('pointerdown', go);
    if (location.search.includes('skip')) go();
  }
}
