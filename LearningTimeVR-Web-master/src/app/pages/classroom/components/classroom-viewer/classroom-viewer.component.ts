import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { UtilityService } from 'app/services/utility.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { Router } from '@angular/router';
import { ClassroomService } from 'app/services/classroomService/classroom.service'
import { SubjectService } from 'app/services/subjectService/subject.service';
import { LessonService } from 'app/services/lessonService/lesson.service';
import { MapService } from 'app/services/mapService/map.service';
import { ElementType } from 'app/models/Interfaces/maps/ElementType';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentClassAssignModalComponent } from 'app/modals/student-class-assign-modal/student-class-assign-modal.component';
import { Breadcrumb } from 'app/models/Interfaces/Breadcrumb';

@Component({
  selector: 'app-classroom-viewer-component',
  templateUrl: './classroom-viewer.component.html',
  styleUrls: ['./classroom-viewer.component.scss']
})
export class ClassroomViewerComponent {

  crumbs: Breadcrumb[] = [ 
    { title: 'Home', url: '/home'}]

  constructor(public lessonService: LessonService, public classService: ClassroomService, public subjectService: SubjectService,
    public firestoreService: FirestoreService, public fbRequestService: FirebaseRequestService, public utility: UtilityService,
    public navigation: NavigationService, public router: Router, public mapService: MapService, public userService: UserService,
    private modalService: NgbModal,
    private global: GlobalService, public utilityService: UtilityService, public f: FormsModule) {
  }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    const classId = this.global.selectedClass;
    if (classId) {
      await this.classService.getClassById(classId);
      if (this.classService.selected.id) {
        await this.mapService.Read(this.classService.selected.id ?? '', ElementType.Class)
        await this.classService.updateClass(this.classService.selected, false, true)
        await this.subjectService.getCollection(this.mapService.collection?.indexMap);
      }
    }
  }
  openStudentManager() {
    const modalRef = this.modalService.open(StudentClassAssignModalComponent, { centered: true, size: 'lg' });
  }
  public getActiveClass() {
    return this.classService.selected;
  }
  async selectSubject(element: ClassroomSubject, redirect = false) {
    this.subjectService.selected = element;
    this.subjectService.setSelected(element);
    await this.lessonService.getCollection();
    if (redirect) {
      this.navigation.redirectToSubject();
    }
  }

  public updateClass() {
    console.log(this.classService.selected);
    this.classService.updateClass(this.classService.selected, true);
    const element = document.getElementById('confirmation-message');
    element?.classList.add('confirmation_success-visible')
    element?.classList.remove('confirmation_success-hidden');
    setTimeout(() => {
      element?.classList.remove('confirmation_success-visible')
      element?.classList.add('confirmation_success-hidden');
    }, 5000);
  }

  sesdf() {

  }

  public allowUpdate(value: any) {

  }

  public getMap() {
    this.mapService.Read(this.classService.selected.id ?? '', ElementType.Class);
  }

  moveToLessonStep() {
    // let id = this.subjectService.selected.id;
    // if (id != null)
    //   localStorage.setItem(this.navigation.lsSelectedSubject, id);
    this.subjectService.subjectsCollection = [];
    // this.global.selectedClass = "null";
    //// localStorage.setItem(this.navigation.lsSelectedClass, "null");
    this.navigation.redirectToClasses();
  }

  createSubjectRequest() {
    this.subjectService.ShowCreateDialog();
    // this.fbRequestService.CreateLessonModule(fieldID);
  }
  editSubjectRequest(subject: ClassroomSubject) {
    this.subjectService.ShowEditDialog(subject);
  }

  deleteSubjectRequest(subject: ClassroomSubject) {
    this.subjectService.ShowDeleteDialog(subject);
    // this.fbRequestService.DeleteLessonModule(this.navigation.getSelectedClass(), index, lm)
  }

}
