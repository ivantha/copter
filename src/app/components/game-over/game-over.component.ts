import {Component, Inject, OnInit} from '@angular/core';
import {GameService} from "../../services/game.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {StartMenuComponent} from "../start-menu/start-menu.component";

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {

  constructor(public gameService: GameService,
              @Inject(MAT_DIALOG_DATA) private data: any,
              public dialogRef: MatDialogRef<GameOverComponent>) { }

  ngOnInit() {
  }

  onClickRestart(): void {
    this.gameService.topScore = this.gameService.score;
    this.gameService.score = 0;
    this.gameService.helicopter.object.position.y = 0;
    this.gameService.running = true;
    this.dialogRef.close();
  }

}
