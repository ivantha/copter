import * as THREE from 'three';
import {BoxGeometry, Mesh} from 'three';

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

  obstacleObject: Mesh;
  obstaclePosition: number;
  obstacleObjectHeight: number;
  obstacleObjectWidth: number;

  vX: number;

  preheight: number;
  postHeight: number;
  heightIncrementCount = 60;

  constructor(private unitX: number, private unitY: number, private caveWidth: number, private caveHeight: number) {

    // Set cave parameters
    this.tunnelHeight = this.unitY * 60;
    this.wallHeight = this.caveHeight - this.tunnelHeight;

    // Set block parameters
    this.blockWidth = (this.caveWidth * 1.1) / this.blockCount;

    this.blockHeightArray = [];

    this.preheight = unitY;
    this.postHeight = Cave.generateRandom(0, unitY * 40);

    for (let i = 0; i < this.blockCount; i++) {
      if (Math.abs(this.preheight - this.postHeight) < this.heightIncrementCount) {
        this.postHeight = Cave.generateRandom(0, unitY * 30);
      } else {
        this.preheight += (this.postHeight - this.preheight) / this.heightIncrementCount;
      }

      this.blockHeightArray.push(this.preheight);
    }

    // Create obstacle object
    let obstacleTexture = new THREE.Texture(Cave.generateWallTexture(true));
    obstacleTexture.needsUpdate = true;
    let obstacleMaterial = new THREE.MeshBasicMaterial({map: obstacleTexture, overdraw: 0.5});
    this.obstacleObjectWidth = this.blockWidth * 10;
    let obstacleGeometry = new BoxGeometry(this.obstacleObjectWidth, 1, 1);
    this.obstacleObject = new Mesh(obstacleGeometry, obstacleMaterial);

    this.obstaclePosition = this.blockCount - 1;
    this.obstacleObjectHeight = Cave.generateRandom(this.tunnelHeight * 0.3, this.tunnelHeight * 0.6);
    let randPos = Cave.generateRandom(-0.5, 0.5);
    this.obstacleObject.position.y = this.unitY * 20 * randPos;
    this.obstacleObject.scale.y = this.obstacleObjectHeight;

    // Initialize the Material
    let topTexture = new THREE.Texture(Cave.generateWallTexture(true));
    topTexture.needsUpdate = true;
    let topMaterial = new THREE.MeshBasicMaterial({map: topTexture, overdraw: 0.5});

    let bottomTexture = new THREE.Texture(Cave.generateWallTexture(false));
    bottomTexture.needsUpdate = true;
    let bottomMaterial = new THREE.MeshBasicMaterial({map: bottomTexture, overdraw: 0.5});

    // Construct the objects
    this.topObjectArray = [];
    this.bottomObjectArray = [];
    for (let i = 0; i < this.blockCount; i++) {
      // Create objects
      let topGeometry = new BoxGeometry(this.blockWidth, 1, 1);
      let topObject = new Mesh(topGeometry, topMaterial);
      let bottomGeometry = new BoxGeometry(this.blockWidth, 1, 1);
      let bottomObject = new Mesh(bottomGeometry, bottomMaterial);

      // Push to geometry array
      this.topObjectArray.push(topObject);
      this.bottomObjectArray.push(bottomObject);
    }

    this.shiftBlockObjects();

    this.vX = unitX * 25;
  }

  /**
   * Generate texture for walls
   * @param {boolean} isTop
   * @returns {HTMLCanvasElement}
   */
  static generateWallTexture(isTop: boolean): HTMLCanvasElement {
    let size = 512;

    // Create canvas
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    // Get context
    let context = canvas.getContext('2d');

    // Draw gradient
    context.rect(0, 0, size, size);
    let gradient = context.createLinearGradient(0, 0, 0, size);

    if(!isTop){
      gradient = context.createLinearGradient(0, size, 0, 0);
    }

    gradient.addColorStop(0, '#150603');
    gradient.addColorStop(1, '#935428'); // dark blue
    context.fillStyle = gradient;
    context.fill();

    return canvas;
  }

  static generateRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

    this.shiftBlockObjects();
    this.shiftObstacleObjects();
  }

  /**
   * Shift block objects
   */
  shiftBlockObjects(): void {
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

  shiftObstacleObjects(): void {
    this.obstaclePosition -= 1;
    if (this.obstaclePosition >= -10){
      this.obstacleObject.position.x = (this.blockWidth * this.obstaclePosition) - (this.caveWidth / 2);
    } else{
      this.obstaclePosition = this.blockCount - 1;
      this.obstacleObjectHeight = Cave.generateRandom(this.tunnelHeight * 0.3, this.tunnelHeight * 0.6);
      let randPos = Cave.generateRandom(-0.5, 0.5);
      this.obstacleObject.position.y = this.unitY * 20 * randPos;
      this.obstacleObject.scale.y = this.obstacleObjectHeight;
    }
  }

}
