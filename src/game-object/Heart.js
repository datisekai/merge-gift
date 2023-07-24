import Phaser from "phaser";
import config from "../config";

const { CELL_SIZE, startY } = config;

export default class Heart extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, row, col, level) {
    const x = (col + 0.5) * CELL_SIZE;
    super(scene, x, 0, `level${level}`);

    this.row = this.row0 = row;
    this.col = this.col0 = col;

    this.level = level;
    this.scene = scene;
  }

  display() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setScale(0.15);
    this.setBounce(0.25);
    this.setInteractive({ useHandCursor: true });
  }

  teleport(row, col){
    this.row = this.row0 = row
    this.col = this.col0 = col;
    this.back()
  }

  back() {
    this.x = CELL_SIZE * (this.col0 + 0.5);
    this.y = CELL_SIZE * (this.row0 + 0.5) + startY - (this.height * 0.15) + 6;
  }

  levelUp() {
    if (this.level < 4) {
      this.level += 1;
      this.setTexture("level" + this.level);
    }
  }
}
