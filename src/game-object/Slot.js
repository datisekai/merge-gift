import Phaser from "phaser";
import config from "../config";

const { CELL_SIZE, startY } = config;

export default class Slot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, row, col) {
    const x = (col + 0.5) * CELL_SIZE;
    const y = (row + 0.5) * CELL_SIZE + startY;
    super(scene, x, y, "slot");

    this.row = row;
    this.col = col;
    this.scene = scene;

    this.key = "slot";
  }

  display() {
    this.setScale(0.1);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.allowGravity = false;
    this.body.immovable = true;
  }



}
