import Phaser from "phaser";
import WebFontFile from "../fonts/WebFontFile";
import config from "../config";

const { fontFamily } = config;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image("slot", "images/slot.png");
    this.load.image("level1", "images/level1.png");
    this.load.image("level2", "images/level2.png");
    this.load.image("level3", "images/level3.png");
    this.load.image("level4", "images/level4.png");
    this.load.image("bg", "images/bg.png");
    this.load.addFile(new WebFontFile(this.load, fontFamily));
  }

  create() {
    this.scene.start("play");
  }
}
