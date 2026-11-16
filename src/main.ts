import Phaser from 'phaser';
import { MapScene } from './game/MapScene';

new Phaser.Game({ type: Phaser.AUTO, parent: 'game', width: 960, height: 640, backgroundColor: '#0b0d12', scene: [MapScene] });
