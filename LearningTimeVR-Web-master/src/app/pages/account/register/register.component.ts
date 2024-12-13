import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { extensionValidator } from './validator';
import { confirmPasswordValidator } from './validator';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { Link } from '../../../models/Interfaces/Link';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { AuthService } from 'app/services/firebase/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BaseUser } from 'app/models/Interfaces/userTypes/BaseUser';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { SchoolService } from 'app/services/schoolService/school.service';
import { UserType } from 'app/services/firebase/user.service';
import { PinService } from 'app/services/pin.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { EmailAuthProvider, getAuth, linkWithCredential, signInAnonymously } from "firebase/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    displayName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^.{6,}$/)]),
    confirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator()]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    profilePicture: new FormControl(null, [extensionValidator()])
    //, {
    // validators: [this.fileTypeValidator]
    // }

  });

  public userTypes: string[] = ["Student", "Teacher", "Moderator", "Administrator"];

  checkpassword() {
    return (this.registerForm.controls['confirmPassword'].errors?.['passwordMatches']);
  }

  userType: string;
  constructor(private navigation: NavigationService, public auth: AngularFireAuth, public authService: AuthService,
    public fs: FirestoreService, private route: ActivatedRoute, private router: Router, private orgService: OrganizationService,
    private schoolService: SchoolService,
    private pinService: PinService,
    private global: GlobalService) {
    const auth1 = getAuth();
    signInAnonymously(auth1)
      .then(() => {
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params['token']) {
          console.log("token", params['token']);

          // set registration to match based on the token
          this.waitForLinkObject(params['token']);
        }
      }
      );

  }

  //   users: any[];
  //   getUsers() {
  // 
  //     this.auth.currentUser.then(me => {
  // 
  // 
  //       if (!me) { console.log("not logged in", me); return; }
  //       // console.log("me is", me.uid);
  //       this.fs.firestore.collection("master").doc(this.fs.outputCollection).collection("Users", ref => ref.where("baseUser.uid", "==", me!.uid).orderBy('baseUser.firstName'))
  //         .snapshotChanges()
  //         .pipe(
  //           map(
  //             changes =>
  //               changes.map(c => ({
  //                 id: c.payload.doc.id, ...c.payload.doc.data()
  //               })))
  //         ).subscribe(data => {
  //           console.log(data);
  //           this.users = (data);
  //           return data;
  //         });
  //     });
  //   }

  link: Link;
  org: string;
  school: any;
  invalidLink: boolean = false;
  async waitForLinkObject(token: string) {
    (await this.getLinksCollection(token)).valueChanges().subscribe(data => {
      this.links = data;
      console.log(data);
      // console.log(data);
      if (this.links && this.links.length > 0) {
        let timeLeft = this.getTimeUntilExpiration(this.links[0].expirationDate);
        if (timeLeft <= 0) {
          this.invalidLink = true; console.log("Link invalid or expired", this.invalidLink);
        }

        this.userType = this.userTypes[this.links[0].userType];
        this.link = this.links[0];
        this.org = this.getOrg(this.link)!;
        this.school = this.getSchool(this.link)!;

      } else { this.invalidLink = true; console.log("Link invalid or expired", this.invalidLink); }
      return data;
    });

  }

  getTimeUntilExpiration(expirationDate: string): number {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const diff = expiration.getTime() - now.getTime();
    const seconds = Math.round(diff / 1000);

    return seconds;
  }

  async getLinkById(id: string) {

    const docRef = this.fs.firestore.collection("master").doc(this.global.outputCollection).collection<Link>("Links");
    let cDoc: Link | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: Link = doc.data() as Link;
      if (_class) {
        _class.id = doc.id;
        cDoc = _class;
      }
    });
    if (cDoc) {

    }
    else {
      console.log(id, "class could not be found");
    }
  }

  links: Link[];
  async getLinksCollection(token: string) {
    console.log("getting links");
    return this.fs.firestore.collection("master").doc(this.global.outputCollection).collection<Link>("links", ref => ref.where("token", "==", token).orderBy('expirationDate'));
  }
  getOrg(link: Link) {
    for (let i = 0; i < this.orgService.collection.length; i++) {
      if (this.orgService.collection[i].id == link.organization) return this.orgService.collection[i].title;
    }
    return null;
  }
  getSchool(link: Link) {
    for (let i = 0; i < this.schoolService.collection.length; i++) {
      if (this.schoolService.collection[i].id == link.school) return this.schoolService.collection[i];
    }
    return null;
  }

  check() {
    console.log(this.registerForm.controls['profilePicture']);
  }

  public profilePicture: FormControl;
  fileValid: boolean = true;
  fileTypeValidator(event: any) {
    const file: File = event.target.files[0];
    if (!file) return null;
    const fileName = file.name;
    console.log(fileName);
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);

    const acceptedExt = ["jpg", "png", "jpeg"];
    const isAccepted = acceptedExt.includes(fileExtension.toLowerCase());
    console.log("accepted", isAccepted);

    if (isAccepted) {
      this.registerForm.controls['profilePicture'].setErrors(null);
    } else
      this.registerForm.controls['profilePicture'].setErrors({ 'filetype': true });



    this.registerForm.controls['profilePicture'].markAsTouched();
    return isAccepted ? null : { filetype: true };
  }

  //     return (control: AbstractControl): ValidationErrors | null => {
  //       const file: File = event.target.files[0];//this.registerForm.controls['profilePicture'].value as File;
  // 
  //       console.log(file);
  // 
  //       const fileName = file.name;
  //       const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
  //       console.log(fileExtension);
  // 
  //       let acceptedExt = ["glb", "fbx", "gltf"];
  // 
  //       if (acceptedExt.includes(fileExtension.toLowerCase())) {
  //         this.fileValid = true;
  //       }
  //       else
  //         this.fileValid = false;
  //       return !this.fileValid ? { filetype: true } : null;
  //     }
  // }

  async onSubmit() {
    // Handle form submission
    // this.fileValid = this.fileTypeValidator();
    let form = document.getElementById("registerForm") as HTMLFormElement;
    form.classList.add("was-validated");
    form.classList.remove("needs-validated");


    console.log("registering!");
    for (let n in this.registerForm.controls) {
      console.log(n, "valid?", this.registerForm.controls[n].valid);
      console.log(n, "errors?", this.registerForm.controls[n].errors);
    }
    if (this.registerForm.valid) {

      console.log("form is valid!");
      await this.SignupWithEmailPassword().then(result => {
        console.log("registered", result)
      });

    }
  }


  async SignupWithEmailPassword() {
    const email: any = this.registerForm.controls['email'].value;
    const password: any = this.registerForm.controls['password'].value;
    const credential = EmailAuthProvider.credential(email, password);
    this.auth.currentUser.then((user) => {
      if (user) {
        linkWithCredential(user, credential)
          .then((usercred) => {
            let user = usercred.user;
            console.log("Anonymous account successfully upgraded", user)

            let _baseUser: BaseUser = {
              uid: user.uid,
              userType: this.link.userType,
              organizationId: this.link.organization,
              displayName: this.registerForm.controls['displayName'].value,
              title: this.userTypes[this.link.userType],
              phoneNumber: this.registerForm.controls['phone'].value,
              firstName: this.registerForm.controls['firstName'].value,
              lastName: this.registerForm.controls['lastName'].value,
              schoolId: this.school.id,
              pin: this.pinService.generateCode(),
              profilePhotoUrl: this.registerForm.controls['profilePicture'].value
              // avatar data url:
              // rpm preview url:
            } as BaseUser;
    
            // const dp = this.registerForm.controls['displayName'].value;
            // const ph = "";
            // user.updateProfile(
            //   { displayName: dp, photoURL: ph }
            // )

            this.createAccount<UserType>(_baseUser);
            // alert("Registered! You're already signed in. Click OK to head to the home page.");
    
            this.global.nav = "profile";
            this.router.navigate(["profile"]);
          }).catch((error) => {
            console.log("Error upgrading anonymous account", error);
          });
      }
    });   
  }

  async createAccount<T>(_baseUser: BaseUser) {
    let account: T = { baseUser: _baseUser } as T;
    // push to DB
    await this.fs.firestore.collection("master").doc(this.global.outputCollection).collection<T>("Users").add(account).catch(error => {
      console.log(error);
    }).then(result => {
      if (result)
        console.log("Uploaded user to db.");
    });
  }

  async PushUserToDB(input: any) {
    await this.fs.firestore.collection("master").doc(this.global.outputCollection).collection("Users").add(input).catch(error => {
      console.log(error);
    }).then(result => {
      if (result) {
        console.log("Uploaded user to db.");
        this.global.invalidUser = false;
      }
    });
  }
}
