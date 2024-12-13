import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { ContentClusterEvent } from 'app/models/Interfaces/events/content-cluster-event';
import { ContentEvent } from 'app/models/Interfaces/events/content-event';
import { ClassroomService } from 'app/services/classroomService/classroom.service';
import { ContentService } from 'app/services/contentService/content.service';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { LessonService } from 'app/services/lessonService/lesson.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { SubjectService } from 'app/services/subjectService/subject.service';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MapService } from 'app/services/mapService/map.service';
import { ElementType } from 'app/models/Interfaces/maps/ElementType';
import { UtilityService } from 'app/services/utility.service';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { Breadcrumb } from 'app/models/Interfaces/Breadcrumb';

@Component({
  selector: 'app-lesson-viewer-component',
  templateUrl: './lesson-viewer.component.html',
  styleUrls: ['./lesson-viewer.component.scss']
})

export class LessonViewerComponent {

  crumbs: Breadcrumb[] = [ 
    { title: 'Home', url: '/home'}, 
    { title: 'Classroom', url: '/classroom'},
    { title: 'Subject', url: '/subject'}]

  clickedContent: ContentEvent = {} as ContentEvent;
  clickedContentCluster = {} as ContentClusterEvent;

  @Output() event_clickedContentCluster = new EventEmitter<ContentClusterEvent>();
  @Output() event_clickedContent = new EventEmitter<ContentEvent>();

  constructor(
    public classService: ClassroomService, 
    public subjectService: SubjectService, 
    public lessonService: LessonService, 
    public contentService:ContentService, 
    public fbRequestService: FirebaseRequestService,
    public navigation: NavigationService,
    public mapService: MapService,
    private global:GlobalService,
    public userService:UserService,
    public utilityService: UtilityService) { 
      this.load(); 
    }

  @Input() contentCluster: ClassroomLesson;
  @Input() contentClusterIndex: number;

  ngOnInit(): void { }

  async load() {
    const classId = this.global.selectedClass; //// localStorage.getItem(this.navigation.lsSelectedClassId);
    const subjectId = this.global.selectedSubject; //// localStorage.getItem(this.navigation.lsSelectedSubjectId);
    const lessonId = this.global.selectedLesson; //// localStorage.getItem(this.navigation.lsSelectedLessonId);

    if (classId) {
      await this.classService.getClassById(classId);
    }
    if (subjectId) {
      await this.subjectService.getSubjectById(subjectId);
    }
    if (lessonId) {
      await this.lessonService.getById(lessonId, () => {  });
      await this.mapService.Read(this.lessonService.selected.id ?? '', ElementType.Lesson);
      await this.contentService.getCollection(this.mapService.collection?.indexMap);
    }
  }

  deleteCCRequest(cc: ClassroomLesson, e: number) {
    this.lessonService.ShowDeleteDialog(cc);
    // this.fbRequestService.DeleteContentCluster(this.navigation.getSelectedClass(), this.navigation.getSelectedSubjectIndex(), e, cc)
  }

  OpenContentClusterEditor(event: any, _cc: ClassroomLesson, ccIndex: number) {
    // if (_cc != undefined && _cc != null) {
    //   this.fbRequestService.ShowEditorDialog(2, this.navigation.getSelectedClass(), _cc, this.navigation.getSelectedSubjectIndex(), ccIndex);
    // }
  }

  createRequest() {
    this.contentService.ShowCreateDialog();
    // this.fbRequestService.CreateContent(this.navigation.getSelectedClass().id, 
    //   this.navigation.getSelectedSubjectIndex(), this.navigation.getSelectedLesson())
  }

  onClickedContent(_c: ContentEvent) {
    // if (_c != undefined && _c != null) {
    //   this.clickedContent = _c;
    //   this.event_clickedContent.emit(this.clickedContent);
    // }
  }

  isYoutube(contentType: number) {
    if (contentType) {
      if (contentType == 7 || contentType == 8 || contentType == 9) {
        return true;
      }
    }
    return false;
  }

  deleteRequest(c: LessonContent) {
    this.contentService.ShowDeleteDialog(c);
  }

  editContentRequest(c:LessonContent){
    this.contentService.ShowEditDialog(c);
  }

  processTypeName(s: string) {
    return s;
    //return this.utility.toPascalCase(s);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.contentService.collection) {
      moveItemInArray(this.contentService.collection, event.previousIndex, event.currentIndex);

      this.mapService.Create(this.contentService.collection, ElementType.Content,
        this.lessonService.selected.id ?? '', ElementType.Lesson);
    }
  }

  placeholderContentSource: string | null = "https://www.caltrain.com/files/images/2021-09/default.jpg";
  activeContent: LessonContent | undefined;

  setActiveRow(content: LessonContent | null): any{
    if (content) {
      this.activeContent = content;
    } else (
      this.activeContent = undefined
    )
  }

  namea():boolean {
    return true;
  }

  isActive(id: string | null) {
    return this.activeContent?.id == id;
  }
}
