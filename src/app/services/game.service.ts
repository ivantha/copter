import { Injectable } from '@angular/core';
import {Cave} from "../components/console/models/cave";
import {Helicopter} from "../components/console/models/helicopter";
import {Clock, OrthographicCamera, Scene, WebGLRenderer} from "three/three-core";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  unitX: number = undefined;
  unitY: number = undefined;

  scene: Scene = undefined;
  camera: OrthographicCamera = undefined;
  renderer: WebGLRenderer = undefined;
  clock: Clock = undefined;

  g: number = undefined;
  a: number = undefined;

  terminalVYUp: number = undefined;
  terminalVYDown: number = undefined;

  helicopter: Helicopter = undefined;
  cave: Cave = undefined;

  running = false;

  score = 0;
  topScore = 0;

  constructor() {

  }
}
