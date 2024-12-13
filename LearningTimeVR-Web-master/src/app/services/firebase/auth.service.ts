import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseUser } from './user';
import { deleteUser } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from '../globalService/global.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn: boolean = false;
  public authState: any = null;
  public fbUser: FirebaseUser;

  constructor(public fireAuth: AngularFireAuth, private router: Router, private global: GlobalService) {
    this.authStatusListener().subscribe(res => {
      if (res && res.uid) {
        this.authState = res;
        this._loggedIn.next(true);
      } else {
        this._loggedIn.next(false);
      }
      this.onLogin();
    });

    this._loggedIn.subscribe(val => {
      this.loggedIn = val;
    })
    // this.authStatusListener().subscribe(res => {
    //   if (res && res.uid) {
    //     this.authState = res;
    //     this.loggedIn = true;
    //   } else this.loggedIn = false;
    //   this.onLogin();
    // });
  }

  async Logout() {
    await this.fireAuth.signOut();
    let user = await firstValueFrom(this.authStatusListener());
    this.global.nav = 'loginfallback';
    this.router.navigate(['loginfallback']);
  }
  async DeleteMyUser() {
    
    let user = await firstValueFrom(this.authStatusListener());
    if (!user) { console.error("Could not delete user because it does not exist."); return; }
    await deleteUser(user!);
    this.global.nav = 'loginfallback';
    this.router.navigate(['loginfallback']);
  }

  authStatusListener() {
    return this.fireAuth.authState;
  }

  onLogin() {
    if (this.authState as FirebaseUser) {
      this.fbUser = this.authState as FirebaseUser;
    }
  }

}
