import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ls = {
  selectedOrganization: "selectedOrganizationId",
  selectedSchool: "selectedSchoolId",
  selectedClassLibrary: "selectedClassLibraryId",
  selectedClass: "selectedClassId",
  selectedSubject: "selectedSubjectId",
  selectedLesson: "selectedLessonId",
  selectedContent: "selectedContentId",
  url: "url"
}
export const appdata =
{
  ascentXR_OrgID_Development: "aDIOCOhYHGVzZAvVA3XQ",
  ascentXR_OrgID_Production: "SAuQI9P1wyGQBenAKLTN"
}


// TODO: Update app to use these enums instead of the current arrays etc.
export enum _contentTypes {
  null = -1, IMAGE, IMAGE_360, VIDEO, VIDEO_360, MODEL, QUIZ,
  WEB_BROWSER, YOUTUBE_VIDEO
};

export enum _formatTypes { null = -1, flat, _360, _180 };

export enum _sLayouts { null = -1, over_under, side_by_side, none };

// this serves as the lexicon for the data structure
export enum nodeType { null = -1, Organization, School, ClassLibrary, Class, Subject, Lesson, Content, ContentData }

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public isProductionBuild: boolean = false;

  private outputCollection_Production: string = "Production";
  private outputCollection_Development: string = "Development";

  // Select whether the output collection is the production or development collection
  private urlForDevelopment: string = "localhost:4200";
  private urlForProduction: string = "https://learningtimevr-2023.firebaseapp.com";

  public demoOrgId: string = this.isProductionBuild ? 'dnVUkkF6qdk1Y76F7nZV' : 'cxNGcHlG2fWZcjQzg1hV';

  public outputCollection = this.isProductionBuild ? this.outputCollection_Production : this.outputCollection_Development;
  public ascent_OrgID = this.isProductionBuild ? appdata.ascentXR_OrgID_Production : appdata.ascentXR_OrgID_Development;
  public currentUrl: string = this.isProductionBuild ? this.urlForProduction : this.urlForDevelopment;


  constructor() {
    if (this.adminPage_activeTab == '' || this.adminPage_activeTab == undefined)
      this.adminPage_activeTab = 'linkGenerator';
    if (this.adminPage_activeUserView == '' || this.adminPage_activeUserView == undefined)
      this.adminPage_activeUserView = 'list';
  }

  clearLocalStorage() {
    console.log('CLEARING')
    localStorage.removeItem(ls.selectedOrganization);
    localStorage.removeItem(ls.selectedSchool);
    localStorage.removeItem(ls.selectedClassLibrary);
    localStorage.removeItem(ls.selectedClass);
    localStorage.removeItem(ls.selectedSubject);
    localStorage.removeItem(ls.selectedLesson);
    localStorage.removeItem(ls.selectedContent);
    localStorage.removeItem(ls.url);
    console.log('CLEARED')
  } 

  private _example: BehaviorSubject<any> = new BehaviorSubject(this.example);

  // current location on the web app
  public sub_nav: BehaviorSubject<string> = new BehaviorSubject(this.nav);
  public sub_adminPage_activeTab: BehaviorSubject<string> = new BehaviorSubject(this.adminPage_activeTab);
  public sub_adminPage_activeUserView: BehaviorSubject<string> = new BehaviorSubject(this.adminPage_activeTab);

  // selected elements
  public sub_selectedOrganization: BehaviorSubject<string> = new BehaviorSubject(this.selectedClass);
  public sub_selectedSchool: BehaviorSubject<string> = new BehaviorSubject(this.selectedClass);
  public sub_selectedClassLibrary: BehaviorSubject<string> = new BehaviorSubject(this.selectedClass);
  public sub_selectedClass: BehaviorSubject<string> = new BehaviorSubject(this.selectedClass);
  public sub_selectedSubject: BehaviorSubject<string> = new BehaviorSubject(this.selectedSubject);
  public sub_selectedLesson: BehaviorSubject<string> = new BehaviorSubject(this.selectedLesson);
  public sub_selectedContent: BehaviorSubject<string> = new BehaviorSubject(this.selectedContent);
  public sub_invalidUser: BehaviorSubject<string> = new BehaviorSubject(this.invalidUser);

  set example(value: any) {
    this._example.next(value);
    localStorage.setItem('example', value);
  }
  get example() { return localStorage.getItem('example'); }

  set invalidUser(value: any) {
    this.sub_invalidUser.next(value);
    localStorage.setItem('invalidUser', value);
  }
  get invalidUser() { return (localStorage.getItem('invalidUser') == "true") ? true : false; }
  get nav() { return localStorage.getItem('nav')!; }
  set nav(value: string) {
    this.sub_nav.next(value);
    localStorage.setItem('nav', value);
  }
  get adminPage_activeTab() { return localStorage.getItem('adminPage_activeTab')!; }
  set adminPage_activeTab(value: string) {
    this.sub_adminPage_activeTab.next(value);
    localStorage.setItem('adminPage_activeTab', value);
  }
  get adminPage_activeUserView() { return localStorage.getItem('adminPage_activeUserView')!; }
  set adminPage_activeUserView(value: string) {
    this.sub_adminPage_activeUserView.next(value);
    localStorage.setItem('adminPage_activeUserView', value);
  }
  get selectedOrganization() { return localStorage.getItem(ls.selectedOrganization); }
  set selectedOrganization(value: any) {
    this.sub_selectedOrganization.next(value);
    localStorage.setItem(ls.selectedOrganization, value);
  }
  get selectedSchool() { return localStorage.getItem(ls.selectedSchool); }
  set selectedSchool(value: any) {
    this.sub_selectedSchool.next(value);
    localStorage.setItem(ls.selectedSchool, value);
  }
  get selectedClassLibrary() { return localStorage.getItem(ls.selectedClassLibrary); }
  set selectedClassLibrary(value: any) {
    this.sub_selectedClassLibrary.next(value);
    localStorage.setItem(ls.selectedClassLibrary, value);
  }
  get selectedClass() { return localStorage.getItem(ls.selectedClass); }
  set selectedClass(value: any) {
    this.sub_selectedClass.next(value);
    localStorage.setItem(ls.selectedClass, value);
  }
  get selectedSubject() { return localStorage.getItem(ls.selectedSubject); }
  set selectedSubject(value: any) {
    this.sub_selectedSubject.next(value);
    localStorage.setItem(ls.selectedSubject, value);
  }
  get selectedLesson() { return localStorage.getItem(ls.selectedLesson); }
  set selectedLesson(value: any) {
    this.sub_selectedLesson.next(value);
    localStorage.setItem(ls.selectedLesson, value);
  }
  get selectedContent() { return localStorage.getItem(ls.selectedContent); }
  set selectedContent(value: any) {
    this.sub_selectedContent.next(value);
    localStorage.setItem(ls.selectedContent, value);
  }

}
