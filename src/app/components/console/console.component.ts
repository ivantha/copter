import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {Helicopter} from "./models/helicopter";
import {Clock, OrthographicCamera, Scene, WebGLRenderer} from "three/three-core";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  unitX = window.innerWidth / 100;
  unitY = window.innerHeight / 100;

  scene: Scene;
  camera: OrthographicCamera;
  renderer: WebGLRenderer;
  clock: Clock;

  g = -9.8 * (this.unitY * 30);
  a = 9.8 * (this.unitY * 30);

  terminalVYUp = window.innerWidth / 100 * 30;
  terminalVYDown = window.innerWidth / 100 * 50;

  isAccelerating = false;

  constructor() {
    document.body.addEventListener('mousedown', () => {
      this.isAccelerating = true;
    });

    document.body.addEventListener('mouseup', () => {
      this.isAccelerating = false;
    })
  }

  ngOnInit() {
    // Initialize the scene
    this.scene = new THREE.Scene();

    // Initialize the camera
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2, 1, 100);
    this.camera.position.z = 10;

    // Initialize the renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Initialize the clock
    this.clock = new THREE.Clock();
    this.clock.getDelta();

    // Add an AsexHelper
    const axesHelper = new THREE.AxesHelper(this.unitX * 6);
    this.scene.add(axesHelper);

    // Add a Helicoper object
    let helicopter = new Helicopter();
    this.scene.add(helicopter.object);

    let animate = () => {
      requestAnimationFrame(animate);

      let deltaTime = this.clock.getDelta();

      helicopter.object.position.y += helicopter.vY * deltaTime;

      if (this.isAccelerating) {
        // Accelerate
        helicopter.vY += this.a * deltaTime;

        // Check if greater than terminal velocity
        if (helicopter.vY > this.terminalVYUp) {
          helicopter.vY = this.terminalVYUp;
        }
      } else {
        // Fall in gravity
        helicopter.vY += this.g * deltaTime;

        // Check if greater than terminal velocity
        if (helicopter.vY < -1 * this.terminalVYDown) {
          helicopter.vY = -1 * this.terminalVYDown;
        }
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

}
