import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ConsoleComponent} from './components/console/console.component';
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {environment} from "../environments/environment";
import {MatButtonModule, MatDialogModule, MatSlideToggleModule} from "@angular/material";
import {StartMenuComponent} from './components/start-menu/start-menu.component';
import {GameOverComponent} from './components/game-over/game-over.component';
import {GameService} from "./services/game.service";

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    StartMenuComponent,
    GameOverComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  providers: [
    GameService
  ],
  entryComponents: [
    StartMenuComponent,
    GameOverComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
