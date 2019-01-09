import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {Helicopter} from "./models/helicopter";
import {Cave} from "./models/cave";
import {MatDialog} from "@angular/material";
import {StartMenuComponent} from "../start-menu/start-menu.component";
import {GameService} from "../../services/game.service";
import {GameOverComponent} from "../game-over/game-over.component";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  constructor(public gameService: GameService, private dialog: MatDialog) {
    // Show start-menu dialog
    const dialogRef = this.dialog.open(StartMenuComponent, {
      panelClass: 'menu-dialog-container',
      data: {
        someData: '-'
      }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.initialize();

    let tempScore = 0;
    let animate = () => {
      requestAnimationFrame(animate);

      let deltaTime = this.gameService.clock.getDelta();

      this.gameService.cave.shiftBlocks();

      if (this.gameService.running) {
        this.moveHelicopter(deltaTime);
        if (this.isColliding()) {
          this.stopGame();
        }

        tempScore += 1;
        if (tempScore == 10) {
          this.gameService.score += 1;
          tempScore = 0;
        }
      }

      // Render the scene
      this.gameService.renderer.render(this.gameService.scene, this.gameService.camera);
    };

    // Animate
    animate();
  }

  stopGame() {
    this.gameService.running = false;
    this.gameService.helicopter.object.position.y = 10000;

    const dialogRef = this.dialog.open(GameOverComponent, {
      panelClass: 'menu-dialog-container',
      data: {
        score: '-'
      }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  /**
   * Initialize the game objects
   */
  initialize(): void {
    // Initialize sizes
    this.gameService.unitX = window.innerWidth / 100;
    this.gameService.unitY = window.innerHeight / 100;

    this.gameService.g = -9.8 * (this.gameService.unitY * 30);
    this.gameService.a = 9.8 * (this.gameService.unitY * 30);

    this.gameService.terminalVYUp = window.innerWidth / 100 * 30;
    this.gameService.terminalVYDown = window.innerWidth / 100 * 50;

    // Initialize the scene
    this.gameService.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(a)

    // Initialize the camera
    this.gameService.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2, 1, 100);
    this.gameService.camera.position.z = 10;

    // Initialize the renderer
    this.gameService.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.gameService.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.gameService.renderer.domElement);

    // Initialize the clock
    this.gameService.clock = new THREE.Clock();
    this.gameService.clock.getDelta();

    // Add the helicopter
    this.addHelicopter();

    // Add the cave
    this.gameService.cave = new Cave(this.gameService.unitX, this.gameService.unitY, window.innerWidth, window.innerHeight);
    // Add obstacle
    this.gameService.scene.add(this.gameService.cave.obstacleObject);
    // Add top wall
    for (let i = 0; i < this.gameService.cave.blockCount; i++) {
      this.gameService.scene.add(this.gameService.cave.topObjectArray[i]);
    }
    // Add bottom wall
    for (let i = 0; i < this.gameService.cave.blockCount; i++) {
      this.gameService.scene.add(this.gameService.cave.bottomObjectArray[i]);
    }
  }

  /**
   * Add a Helicopter object to the scene
   */
  addHelicopter(): void {
    // Add a Helicopter object
    this.gameService.helicopter = new Helicopter(this.gameService.unitX, this.gameService.unitY);
    this.gameService.scene.add(this.gameService.helicopter.object);

    // x position of the helicopter
    this.gameService.helicopter.object.position.x = this.gameService.unitX * -25;
  }

  /**
   * Move the Helicopter
   * @param {number} deltaTime
   */
  moveHelicopter(deltaTime: number): void {
    this.gameService.helicopter.object.position.y += this.gameService.helicopter.vY * deltaTime;

    if (this.gameService.helicopter.isAccelerating) {
      // Accelerate
      this.gameService.helicopter.vY += this.gameService.a * deltaTime;

      // Check if greater than terminal velocity
      if (this.gameService.helicopter.vY > this.gameService.terminalVYUp) {
        this.gameService.helicopter.vY = this.gameService.terminalVYUp;
      }
    } else {
      // Fall in gravity
      this.gameService.helicopter.vY += this.gameService.g * deltaTime;

      // Check if greater than terminal velocity
      if (this.gameService.helicopter.vY < -1 * this.gameService.terminalVYDown) {
        this.gameService.helicopter.vY = -1 * this.gameService.terminalVYDown;
      }
    }
  }

  /**
   * Is copter colliding with walls
   * @returns {boolean}
   */
  isColliding(): boolean {
    for (let i = 0; i < this.gameService.cave.blockCount; i++) {
      let topBlock = this.gameService.cave.topObjectArray[i];
      let bottomBlock = this.gameService.cave.bottomObjectArray[i];

      // If in the same x-range of wall block
      if (Math.abs(topBlock.position.x - this.gameService.helicopter.object.position.x) < (this.gameService.unitX * 5)) {
        if ((topBlock.position.y - (this.gameService.cave.blockHeightArray[i] / 2) - this.gameService.helicopter.object.position.y) < 0) {
          return true;
        }

        if ((bottomBlock.position.y + ((this.gameService.cave.wallHeight - this.gameService.cave.blockHeightArray[i]) / 2) - this.gameService.helicopter.object.position.y) > 0) {
          return true;
        }
      }
    }

    // Check if the submarine collides with an obstacle
    let isAboveObstacleBottom = (this.gameService.helicopter.object.position.y + this.gameService.helicopter.height / 2)
      > (this.gameService.cave.obstacleObject.position.y - this.gameService.cave.obstacleObjectHeight / 2);

    let isBelowObstacleTop = (this.gameService.helicopter.object.position.y - this.gameService.helicopter.height / 2)
      < (this.gameService.cave.obstacleObject.position.y + this.gameService.cave.obstacleObjectHeight / 2);

    let isOverObstacleFront = (this.gameService.helicopter.object.position.x + this.gameService.helicopter.width / 2)
      > (this.gameService.cave.obstacleObject.position.x - this.gameService.cave.obstacleObjectWidth / 2);

    let isBeforeObstacleBack = (this.gameService.helicopter.object.position.x - this.gameService.helicopter.width / 2)
      < (this.gameService.cave.obstacleObject.position.x + this.gameService.cave.obstacleObjectWidth / 2);

    return isAboveObstacleBottom && isBelowObstacleTop && isOverObstacleFront && isBeforeObstacleBack;
  }


}
