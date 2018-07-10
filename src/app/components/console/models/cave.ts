import * as THREE from 'three';
import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";

export class Cave {

  // Cave parameters
  tunnelHeight: number;
  wallHeight: number;

  // Block parameters
  blockCount: number;
  blockWidth: number;
  blockHeightArray: number[];

  // Block objects
  topObjectArray: Mesh[];
  bottomObjectArray: Mesh[];

  constructor(private unitX: number, private unitY: number, private caveWidth: number, private caveHeight: number) {

    // Set cave parameters
    this.tunnelHeight = this.unitY * 70;
    this.wallHeight = this.caveHeight - this.tunnelHeight;

    // Set block parameters
    this.blockCount = 60;
    this.blockWidth = (this.caveWidth * 1.1) / this.blockCount;

    let startHeight = unitY;
    this.blockHeightArray = [];

    for (let i = 0; i < this.blockCount; i++){
      let rand = this.generateRandom(0, unitY * 15);
      this.blockHeightArray.push((this.unitY * 5) + rand);
    }

    // Initialize the Material
    let material = new MeshBasicMaterial({color: 0x00ff00});

    // Construct the objects
    this.topObjectArray = [];
    this.bottomObjectArray = [];
    for (let i = 0; i < this.blockCount; i++){
      // Create objects
      let topGeometry = new BoxGeometry(this.blockWidth, this.blockHeightArray[i], 1);
      let topObject = new Mesh(topGeometry, material);
      let bottomGeometry = new BoxGeometry(this.blockWidth, this.wallHeight - this.blockHeightArray[i], 1);
      let bottomObject = new Mesh(bottomGeometry, material);

      // Set positions
      topObject.position.x = (this.blockWidth * i) - (this.caveWidth / 2);
      topObject.position.y = (this.caveHeight / 2) - (this.blockHeightArray[i] / 2);
      bottomObject.position.x = (this.blockWidth * i) - (this.caveWidth / 2);
      bottomObject.position.y = ((this.wallHeight - this.blockHeightArray[i]) / 2) - (this.caveHeight / 2);

      // Push to geometry array
      this.topObjectArray.push(topObject);
      this.bottomObjectArray.push(bottomObject);
    }
  }

  generateRandom(min: number, max: number): number{
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
