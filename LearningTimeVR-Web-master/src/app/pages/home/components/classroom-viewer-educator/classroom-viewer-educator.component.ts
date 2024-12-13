/*
  This application component will be viewed from the home.component when an educator logs into the application.
  This view should be restricted to only educators and should not be viewable by students.
*/

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { Enrollee } from 'app/models/Interfaces/userTypes/Enrollee';
import { Educator } from 'app/models/Interfaces/userTypes/Educator';
import { ClassroomService } from 'app/services/classroomService/classroom.service';
import { AuthService } from 'app/services/firebase/auth.service';
import { UserService } from 'app/services/firebase/user.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { GeneratorService } from 'app/services/utilities/generator/generator.service';
import { UtilityService } from 'app/services/utility.service';
import { UploadService } from 'app/uploads/shared/upload.service';
import { firstValueFrom } from 'rxjs';
import { ClassroomKVP } from 'app/models/Interfaces/ClassroomKVP';

@Component({
  selector: 'app-classroom-viewer-educator',
  templateUrl: './classroom-viewer-educator.component.html',
  styleUrls: ['./classroom-viewer-educator.component.scss']
})
export class ClassroomViewerEducatorComponent {

  searchTerm: string;
  sortOption: string;
  optionMyClassroomsOnly: boolean = false;
  optionMyOrgOnly: boolean = false;
  optionDisplayRecentClassrooms: boolean = true;
  classrooms: Classroom[] = [];

  loadingRecentClassrooms: boolean = false;
  loadingClassrooms: boolean = false;

  constructor(
    public uploadService: UploadService, 
    public navigation: NavigationService, 
    public authService: AuthService,
    public authFA: AngularFireAuth, 
    public userService: UserService, 
    public classService: ClassroomService,
    public generatorService: GeneratorService,
    public utilityService: UtilityService
  ) {

  }

  auto: ClassroomKVP[] = [
    {
      title: 'A Class With Content',
      id: 'classId1234'
    },
    {
      title: 'Demo Classes Shared Org',
      id: 'classId2345'
    }
  ];

  autocompletePairs: ClassroomKVP[] = [];
  getAutocompleteClasses(c: Classroom[] = []): ClassroomKVP[] {
    let _c: Classroom[] = c;
    if (!_c) {
      _c = this.getClassrooms();
    }
    _c.forEach((result: any) => {
      if (result) {
        const kvp: ClassroomKVP = {
          id: result.id || '',
          title: result.title || ''
        }
        this.autocompletePairs.push(kvp);
      }
    })
    console.log('PAIRS',this.autocompletePairs)
    return this.autocompletePairs;
  }

  async ngOnInit() {
    this.authService.authStatusListener().subscribe(async a => {
      const user = await firstValueFrom(this.userService.getCurrentUserData());
      if (a) {
        await this.getStudentClasses();
        await this.getTeachersInClasses();
      }
    });

    this.optionDisplayRecentClassrooms = this.classService.getOptionDisplayRecentClassrooms();
    this.optionMyClassroomsOnly = this.classService.getOptionMyClassroomsOnly();
    this.optionMyOrgOnly = this.classService.getOptionMyOrgOnly();
    const selectedSortOptions = this.classService.getSelectedSortOptions();
    this.sortOption = `${selectedSortOptions.field}|${selectedSortOptions.direction}`;
  }

  studentClasses: Classroom[];
  async getStudentClasses() {
    if (!this.userService.user) return;
    if (this.userService.user!.baseUser?.userType != 0) return;
    let student: Enrollee = this.userService.getStudentObjectFromUser(this.userService.user);

    if (student.classes) {
      const a = await this.classService.getClassListFromArrayOfIDs(student.classes!);
      console.log("Classes: __!!!#($@#(@", a);
      const classes: Classroom[] = [];
      a.forEach(_class => {
        const c = _class.data() as Classroom;
        console.log("class", c);
        classes.push(c);
      });
      this.studentClasses = classes;
    }

    return true;
  }

  uploadForm: FormGroup = new FormGroup({
    input_file: new FormControl()
  });

  fileData: File;

  onFileSelected(event: any) {
    if (event.target.files == null || event.target.files.length == 0) {
      console.log("Could not upload file.");
      return;
    }

    let file: File = event.target.files[0];
    this.fileData = file;
  }
  async selectClass(_c: Classroom, redirect = false) {
    this.classService.selected = _c;
    this.classService.setSelectedClass(_c);

    // await this.subjectService.getCollection();
    // console.log(this.subjectService.subjectsCollection);


    if (redirect) {
      this.navigation.redirectToClass();
    }
  }

  Upload() {
    console.log(this.uploadForm.value);
    // this.uploadService.pushUpload(this.authService.user.uid, this.fileData);
  }
  
  public onChange(value: string) {
    console.log('search changes:', value);
  }

  sortClassrooms(value: any) {
    console.log('sortcl',value);
    this.classService.setSelectedSortOptions(value);
    this.classService.getClassroomsCollection(this.searchTerm, this.userService.user?.baseUser?.uid ?? "")
  }

  checkUserPermissions() {
    return this.userService.user && this.userService.user.baseUser?.userType! >= 1;
  }

  uiDisplayRecentClassrooms() {
    let result = false;
    if (this.classService!.recentCollection) {
      result = this.optionDisplayRecentClassrooms 
        && !this.searchTerm 
        && this.classService!.recentCollection!.length > 0;
    }
    return result;
  }

  setDisplayRecentClassrooms(value: boolean = false) {
    this.optionDisplayRecentClassrooms = value;
    this.classService.setOptionDisplayRecentClassrooms(this.optionDisplayRecentClassrooms);
  }

  toggleShowOnlyMyClasses(value: boolean) {
    this.classService.setOptionMyClassroomsOnly(value);
    this.classService.getClassroomsCollection(this.searchTerm, this.userService.user?.baseUser?.uid ?? "")
  }

  toggleShowMyOrganizationOnly(value: boolean) {
    this.classService.setOptionMyOrgOnly(value);
    this.classService.getClassroomsCollection(this.searchTerm, this.userService.user?.baseUser?.uid ?? "")
  }

  getClassrooms() {
    return this.classService.collection;
  }

  getRecentClassrooms() {
    return this.classService.recentCollection;
  }

  editClassRequest(c: Classroom) {
    this.classService.ShowEditDialog(c)
  }

  deleteClassRequest(c: Classroom) {
    this.classService.ShowDeleteDialog(c)
  }

  search(target: any) {
    console.log('Target', target);
    this.searchTerm = target.toLowerCase();
    this.classService.getClassroomsCollection(this.searchTerm, this.userService.user?.baseUser?.uid ?? "")
  }
  
  private _teachersInClasses: string[] = [];
  teachersInClasses: Educator[] = [];
  async getTeachersInClasses() {
    // if (!this.studentClasses) return;
    if (this.studentClasses) {
      for (let i = 0; i < this.studentClasses.length; i++) {
        if (this.studentClasses[i].createdBy) {
          const teacher: Educator | undefined = await this.userService.queryUserObjectByUid<Educator>(this.studentClasses[i].createdBy!);
          if (teacher && !this._teachersInClasses.includes(teacher.id!)) {
            this.teachersInClasses.push(teacher);
            this._teachersInClasses.push(teacher.id!);
          }
          else console.log("teacher user could not be parsed.", teacher);
        }
        else {
          console.log("No author for class", this.studentClasses[i]);
        }
      }
      console.log("teachers:", this.teachersInClasses);
    }
  }
}
