import Phaser from "phaser";

import Preload from "./scene/Preload";
import Bootstrap from "./scene/Bootstrap";
import Play from "./scene/Play";
import configDefault from "./config";
import GameOver from "./scene/Gameover";

const { width, height, backgroundColor } = configDefault;

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width,
  height,
  backgroundColor,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Preload, Bootstrap, Play, GameOver],
};

export default new Phaser.Game(config);
