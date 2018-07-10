import * as THREE from 'three';
import {BoxGeometry, Mesh, MeshBasicMaterial} from "three/three-core";

export class Helicopter {

  private readonly geometry: BoxGeometry;
  private readonly material: MeshBasicMaterial;
  readonly object: Mesh;

  vX = 0;
  vY = 0;

  isAccelerating = false;

  constructor(private unitX: number, private unitY: number) {
    // Construct the object
    this.geometry = new THREE.BoxGeometry(this.unitX * 5, this.unitX * 2, 1);
    this.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.object = new THREE.Mesh(this.geometry, this.material);
  }
}
