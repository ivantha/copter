import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {Helicopter} from "./models/helicopter";
import {Clock, OrthographicCamera, Scene, WebGLRenderer} from "three/three-core";
import {Cave} from "./models/cave";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  private unitX = window.innerWidth / 100;
  private unitY = window.innerHeight / 100;

  private scene: Scene;
  private camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private clock: Clock;

  private g = -9.8 * (this.unitY * 30);
  private a = 9.8 * (this.unitY * 30);

  private terminalVYUp = window.innerWidth / 100 * 30;
  private terminalVYDown = window.innerWidth / 100 * 50;

  private helicopter: Helicopter;
  private cave: Cave;

  private running = false;

  constructor() {
  }

  ngOnInit() {
    this.initialize();

    let animate = () => {
      requestAnimationFrame(animate);

      let deltaTime = this.clock.getDelta();

      this.moveHelicopter(deltaTime);
      this.cave.shiftBlocks();

      // Render the scene
      this.renderer.render(this.scene, this.camera);
    };

    // Animate
    animate();
  }

  /**
   * Initialize the game objects
   */
  initialize(): void {
    // Initialize the scene
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(a)

    // Initialize the camera
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2, 1, 100);
    this.camera.position.z = 10;

    // Initialize the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Initialize the clock
    this.clock = new THREE.Clock();
    this.clock.getDelta();

    // Add a Helicopter object
    this.helicopter = new Helicopter(this.unitX, this.unitY);
    this.scene.add(this.helicopter.object);

    // x position of the helicopter
    this.helicopter.object.position.x = this.unitX * -25;

    // Add the cave
    this.cave = new Cave(this.unitX, this.unitY, window.innerWidth, window.innerHeight);
    for (let i = 0; i < this.cave.blockCount; i++) {
      this.scene.add(this.cave.topObjectArray[i]);
    }

    for (let i = 0; i < this.cave.blockCount; i++) {
      this.scene.add(this.cave.bottomObjectArray[i]);
    }
  }

  /**
   * Move the Helicopter
   * @param {number} deltaTime
   */
  moveHelicopter(deltaTime: number): void {
    this.helicopter.object.position.y += this.helicopter.vY * deltaTime;

    if (this.helicopter.isAccelerating) {
      // Accelerate
      this.helicopter.vY += this.a * deltaTime;

      // Check if greater than terminal velocity
      if (this.helicopter.vY > this.terminalVYUp) {
        this.helicopter.vY = this.terminalVYUp;
      }
    } else {
      // Fall in gravity
      this.helicopter.vY += this.g * deltaTime;

      // Check if greater than terminal velocity
      if (this.helicopter.vY < -1 * this.terminalVYDown) {
        this.helicopter.vY = -1 * this.terminalVYDown;
      }
    }
  }

  /**
   * Is copter colliding with walls
   * @returns {boolean}
   */
  isColliding(): boolean {

  }

}
