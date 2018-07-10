import {BoxGeometry, Mesh, MeshBasicMaterial} from 'three';

export class Cave {

  // Cave parameters
  tunnelHeight: number;
  wallHeight: number;

  // Block parameters
  blockCount = 150;
  blockWidth: number;
  blockHeightArray: number[];

  // Block objects
  topObjectArray: Mesh[];
  bottomObjectArray: Mesh[];

  vX: number;

  preheight: number;
  postHeight: number;
  heightIncrementCount = 75;

  constructor(private unitX: number, private unitY: number, private caveWidth: number, private caveHeight: number) {

    // Set cave parameters
    this.tunnelHeight = this.unitY * 70;
    this.wallHeight = this.caveHeight - this.tunnelHeight;

    // Set block parameters
    this.blockWidth = (this.caveWidth * 1.1) / this.blockCount;

    this.blockHeightArray = [];

    this.preheight = unitY;
    this.postHeight = Cave.generateRandom(0, unitY * 30);

    for (let i = 0; i < this.blockCount; i++) {
      if (Math.abs(this.preheight - this.postHeight) < this.heightIncrementCount) {
        this.postHeight = Cave.generateRandom(0, unitY * 30);
      } else {
        this.preheight += (this.postHeight - this.preheight) / this.heightIncrementCount;
      }

      this.blockHeightArray.push(this.preheight);
    }

    // Initialize the Material
    let material = new MeshBasicMaterial({color: 0x00ff00});

    // Construct the objects
    this.topObjectArray = [];
    this.bottomObjectArray = [];
    for (let i = 0; i < this.blockCount; i++) {
      // Create objects
      let topGeometry = new BoxGeometry(this.blockWidth, 1, 1);
      let topObject = new Mesh(topGeometry, material);
      let bottomGeometry = new BoxGeometry(this.blockWidth, 1, 1);
      let bottomObject = new Mesh(bottomGeometry, material);

      // Push to geometry array
      this.topObjectArray.push(topObject);
      this.bottomObjectArray.push(bottomObject);
    }

    this.setBlockHeights();

    this.vX = unitX * 25;
  }

  static generateRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setBlockHeights(): void{
    for (let i = 0; i < this.blockCount; i++) {
      // Set heights
      this.topObjectArray[i].scale.y = this.blockHeightArray[i];
      this.bottomObjectArray[i].scale.y = this.wallHeight - this.blockHeightArray[i];

      // Set positions
      this.topObjectArray[i].position.x = (this.blockWidth * i) - (this.caveWidth / 2);
      this.topObjectArray[i].position.y = (this.caveHeight / 2) - (this.blockHeightArray[i] / 2);
      this.bottomObjectArray[i].position.x = (this.blockWidth * i) - (this.caveWidth / 2);
      this.bottomObjectArray[i].position.y = ((this.wallHeight - this.blockHeightArray[i]) / 2) - (this.caveHeight / 2);
    }
  }

  /**
   * Shift the cave blocks
   */
  shiftBlocks(): void {
    for (let i = 0; i < this.blockCount - 1; i++) {
      this.blockHeightArray[i] = this.blockHeightArray[i + 1];
    }

    if (Math.abs(this.preheight - this.postHeight) < this.heightIncrementCount) {
      this.postHeight = Cave.generateRandom(0, this.unitY * 30);
    } else {
      this.preheight += (this.postHeight - this.preheight) / this.heightIncrementCount;
    }

    this.blockHeightArray[this.blockCount - 1] = this.preheight;

    this.setBlockHeights();
  }
}
