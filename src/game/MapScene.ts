import Phaser from 'phaser';

export class MapScene extends Phaser.Scene {
  constructor() { super('map'); }

  create() { this.add.text(24, 24, 'Lantern: simulated Hollow', { color: '#f5c36b', fontSize: '20px' }); }
}
