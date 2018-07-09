import * as THREE from 'three';
import {BoxGeometry, Geometry, Material, Mesh, MeshBasicMaterial, Object3D} from "three/three-core";

export class Helicopter {

  unitX = window.innerWidth / 100;
  unitY = window.innerHeight / 100;

  private geometry: BoxGeometry;
  private material: MeshBasicMaterial;
  object: Mesh;

  vX = 0;
  vY = 0;

  constructor() {
    this.geometry = new THREE.BoxGeometry(this.unitX * 5, this.unitX * 2, 1);
    this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.object = new THREE.Mesh(this.geometry, this.material);
  }
}
