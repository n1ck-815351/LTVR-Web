import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { ContentEvent } from 'app/models/Interfaces/events/content-event';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { UtilityService } from 'app/services/utility.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { ClassroomService } from 'app/services/classroomService/classroom.service';
import { SubjectService } from 'app/services/subjectService/subject.service';
import { LessonService } from 'app/services/lessonService/lesson.service';
import { ContentService } from 'app/services/contentService/content.service';
import { UserService } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-content-component',
  templateUrl: './content-component.component.html',
  styleUrls: ['./content-component.component.scss']
})
export class ContentComponent implements OnInit {
  
  youtubeTypes: [];
  
  @Input() class: Classroom;
  @Input() contentIndex: number;
  @Input() content: LessonContent;
  @Input() contentClusterIndex: number;
  @Input() lessonModuleIndex: number;
  
  isYoutube: boolean = false;
  @Output() event_clickedContent = new EventEmitter<ContentEvent>();

  constructor
    (
      public fbRequestService: FirebaseRequestService, public utility: UtilityService, public fs: FirestoreService, 
      public classService:ClassroomService, public subjectService:SubjectService, 
      public lessonService:LessonService, 
      public contentService:ContentService, 
      public navigation:NavigationService,
      public userService:UserService
    ) 
    { }

  ngOnInit(): void {
    if (this.content != null) {
      if (this.content.contentType == 7 || this.content.contentType == 8 || this.content.contentType == 9) {
        this.isYoutube = true;
      }
    }
    // this.class = history.state.class;
  }
  

  OpenContentEditor(event: any, c: LessonContent) {
    // this.fbRequestService.ShowEditorDialog(3, this.class, this.content, this.lessonModuleIndex, this.contentClusterIndex, this.contentIndex);
  }
  
  editContentRequest(c:LessonContent){
    this.contentService.ShowEditDialog(c);
  }

  deleteRequest(c: LessonContent) {
    this.contentService.ShowDeleteDialog(c);
  }

  moveContentToFirstOrLast(isMovingToFirst = true) {
    if (this.class) {
      if (this.class.lessonModules) {
        let lm = this.class.lessonModules[this.lessonModuleIndex];
        let ccList = this.class.lessonModules[this.lessonModuleIndex].contentClusters;
        if (ccList) {

          let cc = ccList[this.contentClusterIndex];

          if (cc) {
            let contentClusters = this.class.lessonModules[this.lessonModuleIndex].contentClusters
            if (contentClusters)
              if (contentClusters[this.contentClusterIndex]) {

                let contentList: LessonContent[] = contentClusters[this.contentClusterIndex].content as LessonContent[];
                let cIndex = contentList.indexOf(this.content);
                contentList.splice(cIndex, 1);
                if (isMovingToFirst) {
                  contentList.unshift(this.content);
                } else {
                  contentList.push(this.content);
                }

                for (let i = 0; i < contentList.length; i++) {
                  contentList[i].indexInList = i;
                }

                cc.content = contentList;
                ccList[this.contentClusterIndex] = cc;
                lm.contentClusters = ccList;
                this.class.lessonModules[this.lessonModuleIndex] = lm;

                // TODO: Update to id based.
                // this.fs.updateClass(this.class);
              }
          }
        }
      }
    }
  }
  
  moveContent(movementFactor: number) {
    if (this.class) {
      if (this.class.lessonModules) {
        let lm = this.class.lessonModules[this.lessonModuleIndex];
        let ccList = this.class.lessonModules[this.lessonModuleIndex].contentClusters;
        if (ccList) {
          let cc = ccList[this.contentClusterIndex];

          if (cc) {
            let contentClusters = this.class.lessonModules[this.lessonModuleIndex].contentClusters
            if (contentClusters) {
              if (contentClusters[this.contentClusterIndex]) {
                let contentList: LessonContent[] = contentClusters[this.contentClusterIndex].content as LessonContent[];

                // update the indices in case they are outdated
                for (let i = 0; i < contentList.length; i++) {
                  contentList[i].indexInList = i;
                }

                if (this.content.indexInList) {
                  contentList = this.swap(contentList, this.content.indexInList, this.content.indexInList + movementFactor);
                  for (let i = 0; i < contentList.length; i++) {
                    contentList[i].indexInList = i;
                  }
                  cc.content = contentList;
                  ccList[this.contentClusterIndex] = cc;
                  lm.contentClusters = ccList;
                  this.class.lessonModules[this.lessonModuleIndex] = lm;
                  // TODO: Update to id based.
                  // this.fs.updateClass(this.class);
                }
              }
            }
          }
        }
      }
    }
  }

  swap(list:any, a: number, b: number) {
    if (a < 0 || a >= list.length || b < 0 || b >= list.length) {
      return list;
    }

    const temp:LessonContent = list[a];
    const temp2:LessonContent = list[b];
    list[a] = temp2;
    list[b] = temp;
    return list;
  }
  
  processTypeName(s: string) {
    return this.utility.toPascalCase(s);
  }
}