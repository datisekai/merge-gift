import Phaser from "phaser";
import Button from "../game-object/Button";
import config from "../config";

const { width, height } = config;

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  create() {
    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );

    this.play = new Button(
      this,
      width / 2,
      height / 2,
      200,
      60,
      "Restart",
      0x000000,
      0xffffff
    );
    this.input.on("gameobjectdown", (pointer, gameobject) => {
      switch (gameobject) {
        case this.play:
          this.scene.stop();
          this.scene.start("game");
          break;
      }
    });
  }
}
