import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AuthService } from 'app/services/firebase/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userEmail: any;
  userPassword: any;

  constructor(public auth: AngularFireAuth, public authService: AuthService) {
  }

  ngOnInit() {

  }

  async LoginWithEmailPassword() {
    const email: any = this.userEmail;
    const password: any = this.userPassword;

    console.log(email);
    console.log(password);

   await this.auth.signInWithEmailAndPassword(email, password).then((result) => {
      console.log(result);
    }, error => {
      if (error.message.includes("email"))
        window.alert("No account exists with that email.");
      if (error.message.includes("password"))
        window.alert("Invalid password.");
    });


  }
  SignupWithEmailPassword() {
    const email: any = this.userEmail;
    const password: any = this.userPassword;

    console.log(email);
    console.log(password);

    this.auth.createUserWithEmailAndPassword(email, password);
  }

  LoginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }



  Logout() {
    // if (this.user) {
    //   // console.log(this.user.email);
    // }
    // if (this.auth.currentUser != null)
    //   console.log("logged in");
    // else console.log("logged out");

    this.auth.signOut();
    // console.log(this.auth.user);

  }

  CheckStatus() {
    // console.log(this.authService.loggedIn);
    // this.IsLoggedIn().then(data => console.log(data));
  }

  async IsLoggedIn(): Promise<boolean> {
    try {
      await new Promise((resolve, reject) =>
        this.auth.onAuthStateChanged(
          user => {
            if (user) {
              // User is signed in.
              resolve(user)
            } else {
              // No user is signed in.
              reject('no user logged in')
            }
          },
          // Prevent console error
          error => reject(error)
        )
      )
      // console.log(true);
      return true
    } catch (error) {
      // console.log(false);
      return false
    }
  }
}
