import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/firebase/auth.service';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { UtilityService } from 'app/services/utility.service';
import { Router } from '@angular/router';
import { UserService } from 'app/services/firebase/user.service';
import { userTypes } from 'app/services/firebase/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GlobalService } from 'app/services/globalService/global.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  navBtn_home: any = document.querySelector("#navBtn-home");
  navBtn_organization: any = document.querySelector("#navBtn-organization");
  navBtn_classBuilder: any = document.querySelector("#navBtn-classbuilder");
  navBtn_library: any = document.querySelector("#navBtn-library");
  navBtn_school: any = document.querySelector("#navBtn-school");
  navBtn_profile: any = document.querySelector("#navBtn-profile");
  navBtn_admin: any = document.querySelector("#navBtn-admin");
  navBtn_users: any = document.querySelector("#navBtn-users");

  constructor(
    private _router: Router, 
    public authService: AuthService, 
    public authFA: AngularFireAuth, 
    public firestoreService: FirestoreService,
    public fbRequestService: FirebaseRequestService, 
    public utility: UtilityService, 
    public navigation: NavigationService,
    public userService: UserService, 
    public global: GlobalService
  ) {
    setInterval(() => { this.findSelected(this.global.nav); }, 100)
  }

  isAnonymous: boolean = true;

  ngOnInit(): void {
    this.authFA.user.subscribe(event => this.isAnonymous = event?.isAnonymous ?? false);
    this.navBtn_home = document.querySelector("#navBtn-home");
    this.navBtn_classBuilder = document.querySelector("#navBtn-classbuilder");
    this.navBtn_organization = document.querySelector("#navBtn-organization");
    this.navBtn_library = document.querySelector("#navBtn-library");
    this.navBtn_school = document.querySelector("#navBtn-school");
    this.navBtn_profile = document.querySelector("#navBtn-profile");
    this.navBtn_admin = document.querySelector("#navBtn-admin");
    this.navBtn_users = document.querySelector("#navBtn-users");
    this.findSelected(this.global.nav);

    this.global.sub_nav.subscribe((val: string) => {
      if (val) {
        this.clearSelected();
        this.findSelected(val);

        if (val == "/") {
          this.navigate_home();
        }
      }
    })
  }

  findSelected(val: string) {
    this.navBtn_home = document.querySelector("#navBtn-home");
    this.navBtn_classBuilder = document.querySelector("#navBtn-classbuilder");
    this.navBtn_organization = document.querySelector("#navBtn-organization");
    this.navBtn_library = document.querySelector("#navBtn-library");
    this.navBtn_school = document.querySelector("#navBtn-school");
    this.navBtn_profile = document.querySelector("#navBtn-profile");
    this.navBtn_admin = document.querySelector("#navBtn-admin");
    this.navBtn_users = document.querySelector("#navBtn-users");


    this.clearSelected();

    switch (val.replace('/', '')) {
      case ("home" || "classes" || "class" || "subject" || "lesson" || "content"):
        if (this.navBtn_home)
          this.navBtn_home.classList.add("selected");
        break;
      case "classbuilder":
        if (this.navBtn_classBuilder)
          this.navBtn_classBuilder.classList.add("selected");
        break;
      case "library":
        if (this.navBtn_library)
          this.navBtn_library.classList.add("selected");
        break;
      case "organization":
        if (this.navBtn_organization)
          this.navBtn_organization.classList.add("selected");
        break;
      case "classes":
        if (this.navBtn_library)
          this.navBtn_library.classList.add("selected");
        break;
      case "school":
        if (this.navBtn_school)
          this.navBtn_school.classList.add("selected");
        break;
      case "profile":
        if (this.navBtn_profile)
          this.navBtn_profile.classList.add("selected");
        break;
      case "admin":
        if (this.navBtn_admin)
          this.navBtn_admin.classList.add("selected");
        break;
      case "users":
        if (this.navBtn_users)
          this.navBtn_users.classList.add("selected");
        break;
    }
  }





  getLocalStorage() {
    return this.global.nav;
  }

  updateSelected(url: string) {
    this.global.nav = url;
    if (this._router.url != url)
      this._router.navigate([url]);
  }


  navigate_home() {
    this.clearSelected();
    if (this.navBtn_home)
      this.navBtn_home.classList.add("selected");
    this.updateSelected("home");
  }
  navigate_classBuilder() {
    this.clearSelected();
    if (this.navBtn_classBuilder)
      this.navBtn_classBuilder.classList.add("selected");
    this.updateSelected("classbuilder");
  }
  navigate_library() {
    this.clearSelected();
    if (this.navBtn_library)
      this.navBtn_library.classList.add("selected");
    this.updateSelected("library");
  }
  navigate_school() {
    this.clearSelected();
    if (this.navBtn_school)
      this.navBtn_school.classList.add("selected");
    this.updateSelected("school");
  }
  navigate_organization() {
    this.clearSelected();
    if (this.navBtn_organization)
      this.navBtn_organization.classList.add("selected");
    this.updateSelected("organization");
  }
  navigate_profile() {
    this.clearSelected();
    if (this.navBtn_profile)
      this.navBtn_profile.classList.add("selected");
    this.updateSelected("profile");
  }
  navigate_admin() {
    if (this.userService.user && this.userService.user.baseUser?.userType == userTypes.Administrator) {
      this.clearSelected();
      if (this.navBtn_admin)
        this.navBtn_admin.classList.add("selected");
      this.updateSelected("admin");
    }
  }
  navigate_users() {
    // if (this.userService.user && this.userService.user.baseUser?.userType == userTypes.Administrator) {
    this.clearSelected();
    if (this.navBtn_users)
      this.navBtn_users.classList.add("selected");
    this.updateSelected("users");
    // }
  }

  clearSelected() {
    if (this.navBtn_home)
      this.navBtn_home.classList.remove("selected");
    if (this.navBtn_classBuilder)
      this.navBtn_classBuilder.classList.remove("selected");
    if (this.navBtn_library)
      this.navBtn_library.classList.remove("selected");
    if (this.navBtn_organization)
      this.navBtn_organization.classList.remove("selected");
    if (this.navBtn_school)
      this.navBtn_school.classList.remove("selected");
    if (this.navBtn_profile)
      this.navBtn_profile.classList.remove("selected");
    if (this.navBtn_admin)
      this.navBtn_admin.classList.remove("selected");
    if (this.navBtn_users)
      this.navBtn_users.classList.remove("selected");
  }
}
