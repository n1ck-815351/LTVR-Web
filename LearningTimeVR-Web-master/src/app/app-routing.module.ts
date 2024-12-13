import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContentComponent } from './pages/classroom/subject/lesson/components/content-viewer/content-component.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SchoolComponent } from './pages/school/school.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { AdminComponent } from './pages/account/admin/admin.component';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from './services/navigationService/navigation.service';
import { AuthService } from './services/firebase/auth.service';
import { LoginfallbackComponent } from './pages/fallbacks/loginfallback/loginfallback.component';
import { AdminUserPageComponent } from './pages/users/admin-user-page/admin-user-page.component';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AdminGuard } from './guards/admin-auth.guard';
import { RestrictedComponent } from './pages/fallbacks/restricted/restricted.component';
import { UserService } from './services/firebase/user.service';
import { InvalidUserComponent } from './pages/fallbacks/invalid-user/invalid-user.component';
import { ClassroomComponent } from './pages/classroom/classroom.component';
import { SubjectComponent } from './pages/classroom/subject/subject.component';
import { LessonComponent } from './pages/classroom/subject/lesson/lesson.component';
import { GlobalService } from './services/globalService/global.service';

const authenticated$ = new BehaviorSubject<boolean>(false);

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

  // user pages
  { path: 'invaliduserfallback', component: InvalidUserComponent },
  { path: 'loginfallback', component: LoginfallbackComponent },
  { path: 'restrictedfallback', component: RestrictedComponent },
  { path: 'classbuilder', component: HomeComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: AdminUserPageComponent },

  // nodes
  { path: 'classroom', component: ClassroomComponent },
  { path: 'subject', component: SubjectComponent },
  { path: 'lesson', component: LessonComponent },
  { path: 'content', component: ContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  constructor(
    private route: ActivatedRoute,
    public _router: Router,
    public navigation: NavigationService,
    public auth: AuthService,
    private userService: UserService,
    private global: GlobalService,
    private fireAuth: AngularFireAuth
  ) {

    // Handle the url being passed. This will wait to see if you have a user. If you do, load the url. If you don't, loginfallback
    this.handleLoad();

    this.subscribeToRoute();
    let x = {
      "id": 72625,
      "url": "/loginfallback",
      "reason": "Navigation to /loginfallback was ignored because it is the same as the current Router URL.",
      "code": 0,
      "type": 16
    }
  }
  async subscribeToRoute() {
    this._router.events.subscribe(async event => {
      if ((event instanceof NavigationEnd)) {
        console.log("router event~~~~:", event);
        const data = await firstValueFrom(this.auth.authStatusListener());
        if (!this._router.url.toLowerCase().includes('register')) {
          if (!data || data?.isAnonymous) {
            this.auth.Logout();
            console.log("$$$$FALLBACK");
            this.global.nav = "loginfallback";
            this._router.navigate(['loginfallback']);
            return;
          }
        }
      }
    });

  }
  async UserAuthSubscription() {
    this.auth.authStatusListener().subscribe(async state => {
      const isAuthenticated = (state && state.uid);
      authenticated$.next(isAuthenticated != null);

      if (state?.isAnonymous && (!this.global.nav.toLowerCase().includes('register') || !this._router.url.toLowerCase().includes('register'))) {
        this.auth.Logout();
        this._router.navigate(['loginfallback']);
      }

      // handle deactivated user
      if (isAuthenticated) {
        const user = await firstValueFrom(this.userService.queryCurrentUserData());
        if (user.length == 0 && !this._router.url.toLowerCase().includes('register')) {
          if (!state.isAnonymous) {
            this.global.invalidUser = true;
            console.log(this._router.url);
            // this.global.nav = 'invaliduserfallback';
            this._router.navigate(['invaliduserfallback']);
          }
          else if (!this._router.url.toLowerCase().includes('register')) {
            this.auth.Logout();
            this._router.navigate(['loginfallback']);
          }

        } else {
          this.global.invalidUser = false;
          // this.handleRoute();
        }
      } else if (!this._router.url.toLowerCase().includes('register')) {
        // this.global.nav = 'loginfallback';
        this._router.navigate(['loginfallback']);
      }
      console.log("invalid user:", this.global.invalidUser);
    });

  }

  async handleLoad() {
    const loadedURL = this.global.nav;

    console.log(this.global.nav);
    const currentRoute = this._router.url.toLowerCase();

    // wait for auth status listener
    const data = await firstValueFrom(this.auth.authStatusListener());
    if (!this._router.url.toLowerCase().includes('register')) {
      if (!data || data?.isAnonymous) {
        console.log("$$$$FALLBACK");
        this._router.navigate(['loginfallback']);
        return;
      }
    }
    console.log(this._router.url);
    if (this._router.url.toLowerCase().includes('register')) return;
    if (data) {
      // wait for user in DB
      const user = await firstValueFrom(this.userService.queryCurrentUserData());
      if (user) {
        console.log("*firstvaluefrom*", this._router.url, loadedURL, data);
        this.global.nav = loadedURL;
        this._router.navigate([loadedURL]);
        this.UserAuthSubscription();

      } else {
        alert("You don't have a user in our system. Please contact your administrator.");
      }
    } else {
      // if (currentRoute.toLowerCase().includes('register') == false) {
      console.log("redirecting");
      this._router.navigate(['loginfallback']);
      // }
    }


  }


  // TODO: This is currently unused because it causes problems, and I'm not sure it's even necessary with the new handleLoad func.
  async handleRoute() {
    this.global.nav = this._router.url;
    const currentRoute = this._router.url.toLowerCase();

    const data = await firstValueFrom(this.auth.authStatusListener());
    if (data) {
      // do nothing
    } else {
      if (currentRoute !== '/register') {
        console.log("redirecting");
        this._router.navigate(['loginfallback']);
      }
    }
  }



}
