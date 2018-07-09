import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any;

  constructor(private angularFireAuth: AngularFireAuth) {
    angularFireAuth.authState.subscribe((user) => {
        if (user) {
          this.user = user;
          console.log(this.user);
        }
        else {
          this.user = null;
        }
      }
    );
  }

  signInWithGoogle() {
    return this.angularFireAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  signOut() {
    this.angularFireAuth.auth.signOut()
      .then((res) => {
          // TODO
          console.log(res);
        }
      );
  }

  isLoggedIn() {
    return this.user != null;
  }

}
