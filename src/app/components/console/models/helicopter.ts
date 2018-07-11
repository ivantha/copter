import * as THREE from 'three';
import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";

export class Helicopter {

  readonly object: Mesh;

  vX = 0;
  vY = 0;

  width: number;
  height: number;

  isAccelerating = false;

  constructor(private unitX: number, private unitY: number) {
    this.width = this.unitX * 10;
    this.height = this.unitY * 6;

    var texture = new THREE.TextureLoader().load( "./assets/submarine.png" );

    // Construct the object
    let geometry = new BoxGeometry(this.width, this.height, 1);
    let material = new MeshBasicMaterial({map: texture});

    this.object = new Mesh(geometry, material);

    // Mouse-down event listener
    document.body.addEventListener('mousedown', () => {
      this.isAccelerating = true;
    });

    // Mouse-up event listener
    document.body.addEventListener('mouseup', () => {
      this.isAccelerating = false;
    })
  }

}
