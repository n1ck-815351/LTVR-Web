import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseRequestService } from './services/firebase/firebase-request.service';
import { ClassroomService } from './services/classroomService/classroom.service';
import { DeleteHelperService } from './services/firebase/delete-helper.service';
import { SubjectService } from './services/subjectService/subject.service';
import { LessonService } from './services/lessonService/lesson.service';
import { ContentService } from './services/contentService/content.service';
import { EditHelperService } from './services/firebase/edit-helper.service';
import { NavigationService } from './services/navigationService/navigation.service';
import { AuthService } from './services/firebase/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private classService: ClassroomService,
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private contentService: ContentService,
    private deleteHelper: DeleteHelperService,
    private editHelper: EditHelperService,
    private navigation: NavigationService,
    public authService: AuthService,
    private auth: AngularFireAuth,
    private _router: Router, private route: ActivatedRoute, private fbRequestService: FirebaseRequestService) {
    // fbRequestService.dialogModal = document.querySelector('#validationModal');
  }

  ngOnInit(): void {
    // TODO: delete and edit helpers for org/school/classlib updated

    // const token = this.route.snapshot.queryParamMap.get('token');
    // const orgID = this.route.snapshot.queryParamMap.get('organization');
    // console.log(token,orgID);
    // this.route.queryParams
    //   .subscribe(params => {
    //     if (params['token'] && params['organization']) {
    //       console.log("token",params['token']); // { orderby: "price" }
    //       console.log("organization",params['organization']); // { orderby: "price" }
    //     }
    //   }
    //   );
  


    this.classService.deleteHelper = this.deleteHelper;
    this.subjectService.deleteHelper = this.deleteHelper;
    this.lessonService.deleteHelper = this.deleteHelper;
    this.contentService.deleteHelper = this.deleteHelper;

    this.classService.editHelper = this.editHelper;
    this.subjectService.editHelper = this.editHelper;
    this.lessonService.editHelper = this.editHelper;
    this.contentService.editHelper = this.editHelper;

    // console.log("Navigating to home - Currently Disabled.");
    // console.log(this._router.url);


    this.init();
  }

  async init() {
    
    // if (!(await this.IsLoggedIn())) {
    //   localStorage.setItem(this.navigation.lsUrl, "register")
    //   this._router.navigate(["register"]);
    //   console.log("Not logged in, going to register page");
    // } else 
    
//     if (this._router.url == '/') {
//       this._router.navigate([localStorage.getItem(this.navigation.lsUrl)]);
//       console.log("navigating to", localStorage.getItem(this.navigation.lsUrl));
// 
//     }

    $(document).on('show.bs.modal', '.modal', function () {
      $('.modal').appendTo('body');
    });
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

  title = 'LearningTimeVR';
}
