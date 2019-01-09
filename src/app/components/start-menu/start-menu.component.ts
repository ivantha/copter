import {Component, Inject, OnInit} from '@angular/core';
import {GameService} from "../../services/game.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Helicopter} from "../console/models/helicopter";

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent implements OnInit {

  constructor(private gameService: GameService,
              @Inject(MAT_DIALOG_DATA) private data: any,
              public dialogRef: MatDialogRef<StartMenuComponent>) { }

  ngOnInit() {
  }

  onClickStart(): void {
    this.gameService.running = true;
    this.dialogRef.close();
  }

}
