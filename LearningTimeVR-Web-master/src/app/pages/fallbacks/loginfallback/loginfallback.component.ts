import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/firebase/auth.service';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-loginfallback',
  templateUrl: './loginfallback.component.html',
  styleUrls: ['./loginfallback.component.scss']
})
export class LoginfallbackComponent {
  userEmail: any;
  userPassword: any;

  constructor(
    public auth: AngularFireAuth, 
    public authService: AuthService, 
    private global: GlobalService, 
    private router: Router) {
    // userService.queryCurrentUserData().subscribe(user => {
    //   // if (user)
    //     // this.global.nav = 'home';
    //   this.router.navigate([this.global.nav]);
    // });
  }

  ngOnInit() {

  }

  async LoginWithEmailPassword() {
    const email: any = this.userEmail;
    const password: any = this.userPassword;

    console.log(email);
    console.log(password);

    this.auth.signInWithEmailAndPassword(email, password).then((result) => {
      console.log(result);
      this.global.nav = 'home';
      this.router.navigate(['home']);

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
