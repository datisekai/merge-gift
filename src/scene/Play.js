import Phaser from "phaser";
import config from "../config";
import Slot from "../game-object/Slot";
import Heart from "../game-object/Heart";

const { size, width, height, CELL_SIZE, fontFamily, startY } = config;

export default class Play extends Phaser.Scene {
  constructor() {
    super("play");
  }

  create() {
    this.map = [[], [], [], []];
    this.dragObject = null;
    this.activeRowCol = null;
    this.slotGroup = this.physics.add.group();
    this.heartGroup = this.physics.add.group();

    this.bg = this.add.image(width / 2, height / 2, "bg").setScale(2);

    this.createMap();

    this.createHeart(Phaser.Math.Between(0, 3), Phaser.Math.Between(0, 3));
    this.autoGenerateHeart();

    this.input.on("pointerdown", this.startDrag, this);

    this.createTitle();

    this.music = this.loadAudio()
  }

  loadAudio() {
    const music = this.sound.add('backgroundMusic');
    music.play()
    return music
  }

  getRandomPosition() {
    const fitMaps = [];

    this.map.forEach((map) => {
      map.forEach((item) => {
        if (!item.heart) {
          fitMaps.push(item);
        }
      });
    });

    if (fitMaps.length == 0) {
      return;
    }

    const index = Phaser.Math.Between(0, fitMaps.length - 1);

    return fitMaps[index];
  }

  isMapFull() {
    let isFull = true;

    this.map.forEach((map) => {
      map.forEach((item) => {
        if (!item.heart) {
          isFull = false;
        }
      });
    });

    return isFull;
  }

  autoGenerateHeart() {
    setInterval(() => {
      if (!this.isMapFull()) {
        const map = this.getRandomPosition();
        if (map) {
          const { row, col } = map;
          this.createHeart(row, col);
        }
      }
    }, 2000);
  }

  createHeart(row, col) {
    const heart = new Heart(this, row, col, Phaser.Math.Between(1, 2));
    this.heartGroup.add(heart);
    heart.display();

    this.map[row][col] = { ...this.map[row][col], heart };

    this.physics.add.collider(heart, this.map[row][col].slot);
  }

  createMap() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const slot = new Slot(this, row, col);
        this.slotGroup.add(slot);
        this.map[row][col] = { slot, row, col };
        slot.display();
      }
    }
  }

  handleActive(slot) {
    this.handleUnActive();
    slot.setTint(0xff0000);
    if (this.map[slot.row][slot.col].heart) {
      this.map[slot.row][slot.col].heart.setTint(0xff0000);
    }
  }

  handleUnActive() {
    this.slotGroup.getChildren().forEach((item) => item.setTint(0xffffff));
    this.heartGroup.getChildren().forEach((item) => item.setTint(0xffffff));
    this.activeRowCol = null;
  }

  startDrag(pointer, targets) {
    if (targets.length == 0) {
      return;
    }

    this.dragObject = targets[0];
    this.dragObject.body.velocity.y = 0;
    this.dragObject.body.allowGravity = false;
    this.dragObject.depth = 1;
    this.input.off("pointerdown", this.startDrag, this);
    this.input.on("pointermove", this.doDrag, this);
    this.input.on("pointerup", this.stopDrag, this);
  }

  doDrag(pointer) {
    const { x, y } = pointer;
    this.dragObject.x = x;
    this.dragObject.y = y;

    const row = Math.floor((y - startY) / 100);
    const col = Math.floor(x / 100);

    if (row >= 0 && row < size && col >= 0 && col < size) {
      this.handleActive(this.map[row][col].slot);
      this.activeRowCol = { row, col };
      return;
    }

    this.handleUnActive();
  }

  mergeIcon(objectA, objectB) {
    objectB.levelUp();
    objectA.destroy();
    this.map[objectA.row][objectA.col].heart = undefined;

    this.handleUnActive();
    this.dragObject = null;
  }

  reset() {
    this.dragObject.back();
    this.dragObject.depth = 0;
    this.handleUnActive();
  }

  stopDrag() {
    this.input.on("pointerdown", this.startDrag, this);
    this.input.off("pointermove", this.doDrag, this);
    this.input.off("pointerup", this.stopDrag, this);

    if (!this.activeRowCol) {
      return this.reset();
    }

    const { row, col } = this.activeRowCol;
    const currentPosition = this.map[this.dragObject.row][this.dragObject.col];
    const nextPosition = this.map[row][col];

    if (
      !nextPosition.heart ||
      currentPosition.heart.level == 4 ||
      nextPosition.heart.level == 4 ||
      (row == this.dragObject.row && col == this.dragObject.col) ||
      currentPosition.heart.level != nextPosition.heart.level
    ) {
      return this.reset();
    }

    this.mergeIcon(currentPosition.heart, nextPosition.heart);
  }

  createTitle() {
    this.add
      .text(width / 2, 100, "Ghép quà", {
        fontFamily: fontFamily,
        fontSize: "30px",
        color: "#ff0000",
      })
      .setOrigin(0.5);
  }
}
