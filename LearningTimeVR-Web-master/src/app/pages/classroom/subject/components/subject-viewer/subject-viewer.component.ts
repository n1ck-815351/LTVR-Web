import { Component } from '@angular/core';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { ContentClusterEvent } from 'app/models/Interfaces/events/content-cluster-event';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UtilityService } from 'app/services/utility.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { Router } from '@angular/router';
import { LessonService } from 'app/services/lessonService/lesson.service';
import { SubjectService } from 'app/services/subjectService/subject.service';
import { ClassroomService } from 'app/services/classroomService/classroom.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { UserService } from 'app/services/firebase/user.service';
import { Breadcrumb } from 'app/models/Interfaces/Breadcrumb';

@Component({
  selector: 'app-subject-viewer-component',
  templateUrl: './subject-viewer.component.html',
  styleUrls: ['./subject-viewer.component.scss']
})
export class SubjectViewerComponent {
  clickedLesson = {} as ContentClusterEvent;

  crumbs: Breadcrumb[] = [ 
    { title: 'Home', url: '/home'}, 
    { title: 'Classroom', url: '/classroom'}]
  
  constructor(public lessonService:LessonService, public subjectService:SubjectService, public classService:ClassroomService, 
    public firestoreService: FirestoreService, public fbRequestService: FirebaseRequestService, 
    public utility: UtilityService, public navigation: NavigationService, public router: Router, 
    private global:GlobalService, public userService: UserService) { 
      this.load(); 
    }
  
    
  async load() {
    const classId = this.global.selectedClass;////localStorage.getItem(this.navigation.lsSelectedClassId);
    const subjectId = this.global.selectedSubject;////localStorage.getItem(this.navigation.lsSelectedSubjectId);
    if (classId) {
      await this.classService.getClassById(classId);
    }
    if (subjectId) {
      await this.subjectService.getSubjectById(subjectId);
    }

    await this.lessonService.getCollection();
  }
  
  ngOnInit(): void { }

  OpenContentClusterEditor(event: any, _cc: ClassroomLesson, ccIndex: number) {
    // if (_cc != undefined && _cc != null) {
    //   this.fbRequestService.ShowEditorDialog(2, this.navigation.getSelectedClass(), _cc, this.navigation.getSelectedSubjectIndex(), ccIndex);
    // }
  }

  trim(input: string | null) {
    return this.utility.trim(input);
  }

  selectContentCluster(c: ClassroomLesson) {
    this.clickedLesson.contentCluster = c;
  }

  setSelectedContentCluster(contentCluster: ClassroomLesson, index: number, redirect = false) {
    // this.navigation.setSelectedLesson(contentCluster, index)

    if (redirect) {
      this.navigation.redirectToLesson();
    }
  }
  
  async selectLesson(element: ClassroomLesson, redirect = false) {
    this.lessonService.selected = element;
    this.lessonService.setSelected(element);

    if (redirect) {
      this.navigation.redirectToLesson();
    }
  }

  deleteLessonRequest(lesson:ClassroomLesson) {
    this.lessonService.ShowDeleteDialog(lesson);
    // this.fbRequestService.DeleteContentCluster(this.navigation.getSelectedClass(), this.navigation.getSelectedSubjectIndex(), e, cc)
  }
  
  editLessonRequest(lesson:ClassroomLesson){
    this.lessonService.ShowEditDialog(lesson);
  }

  createLessonRequest(){
    // console.log(this.subjectService.selectClass)
    this.lessonService.ShowCreateDialog();
    // this.fbRequestService.CreateContentCluster(fieldID, index);
  }
}
