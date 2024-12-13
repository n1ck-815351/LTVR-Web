import { Injectable } from '@angular/core';
import { UtilityService } from '../utility.service';
import { Router } from '@angular/router';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(public utility: UtilityService, public router: Router, private global:GlobalService) { }
  public onSelected: any;
  public onSelectedLesson: any;
  public i: number = 0;

  public noContentText = "There isn't any content here yet. Click the Create Content button to get started!"
  // public viewerBoilerText = {
  //   homeViewer: "Home",
  //   classesViewer:"Classes Overview",
  //   classViewer:"Class View",
  //   subjectViewer:"Subject View",
  //   lessonViewer:"Lesson View",
  //   contentViewer:"Content View"
  // }
    
  public ngOnInit(): void {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  // Local storage constants.
  
  public lsUrl: string = "url";
  
  public clearLocalStorage() {
    // console.log('CLEARING')
    // localStorage.removeItem(this.lsSelectedClass);
    // localStorage.removeItem(this.lsSelectedClassId);
    // localStorage.removeItem(this.lsSelectedSubject);
    // localStorage.removeItem(this.lsSelectedSubjectId);
    // localStorage.removeItem(this.lsSelectedSubject);
    // localStorage.removeItem(this.lsSelectedLesson);
    // localStorage.removeItem(this.lsSelectedLessonId);
    // localStorage.removeItem(this.lsSelectedContent);
    // localStorage.removeItem(this.lsSelectedContentId);
    // console.log(localStorage)
    // console.log('CLEARED')

  }

  public navigate(uri: string) {
    this.global.nav = uri.replace(/\W/g, "");
    this.router.navigateByUrl('/', { skipLocationChange: true, }).then(() =>
    this.router.navigate([uri], {queryParamsHandling: 'merge'}));
  }

  // public navigate(path: string) {
  //   this.router.navigate(
  //     [path],
  //     { 
  //       

  //     }
  //   )
  // }

  public redirectToClasses() {
    this.clearLocalStorage();
    this.navigate('/home');
    this.global.nav = "home";
  }

  public redirectToClass() {
    this.navigate('/classroom');
    this.global.nav = "classroom";
  }

  public redirectToSubject() {
    this.navigate('/subject')
    this.global.nav = "subject";
  }

  public redirectToLesson() {
    this.navigate('/lesson')
    this.global.nav = "lesson";
  }

  scroll(id: string, timeout = 100) {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      }
    }, timeout);
    // In some scenarios, we requires a moment to load before the 
    // object is bound to the DOM.
  }
}
