import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";

export class Helicopter {

  readonly object: Mesh;

  vX = 0;
  vY = 0;

  isAccelerating = false;

  constructor(private unitX: number, private unitY: number) {
    // Construct the object
    let geometry = new BoxGeometry(this.unitX * 5, this.unitY * 3, 1);
    let material = new MeshBasicMaterial({color: 0x00ff00});
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
