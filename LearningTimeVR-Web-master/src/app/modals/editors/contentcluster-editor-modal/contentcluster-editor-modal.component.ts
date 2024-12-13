import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { ContentClusterEvent } from 'app/models/Interfaces/events/content-cluster-event';
import { FirestoreService } from 'app/services/firebase/firestore.service';

@Component({
  selector: 'app-contentcluster-editor-modal',
  templateUrl: './contentcluster-editor-modal.component.html',
  styleUrls: ['./contentcluster-editor-modal.component.scss']
})
export class ContentclusterEditorModalComponent {
  constructor(public firestoreService: FirestoreService) {
    
  }

  contentClusterEditorForm: FormGroup;
  private _clickedContentCluster: ClassroomLesson;
  get clickedContentCluster(): ClassroomLesson {
    return this._clickedContentCluster;
  }
  @Input() set clickedContentCluster(value: ClassroomLesson) {
    this._clickedContentCluster = value;
    console.log(value);
    if (value != null && value != undefined) {
      this.contentClusterEditorForm = new FormGroup({
        ccEdit_title: new FormControl(value.title),
        ccEdit_description: new FormControl(value.description),
        ccEdit_tags: new FormControl(value.tags)
      });

      console.log(this.contentClusterEditorForm);
    }
  }

  @Input() clickedContentClusterIndex: number;
  // get and set to update clicked class variable formgroup
  @Input() event_clickedContentCluster: ContentClusterEvent;
  @Output() changedLessonModuleEvent = new EventEmitter<ContentClusterEvent>();

  SubmitEdits() {

    if (this.contentClusterEditorForm == null) return;
    if (this._clickedContentCluster == null) return;

    let changedContentCluster: ClassroomLesson = this._clickedContentCluster;

    let title: string = this.contentClusterEditorForm.controls['ccEdit_title'].value;
    let description: string = this.contentClusterEditorForm.controls['ccEdit_description'].value;
    let tags: string = this.contentClusterEditorForm.controls['ccEdit_tags'].value;
    changedContentCluster.title = title;
    changedContentCluster.description = description;
    changedContentCluster.tags = tags;

    if (this.event_clickedContentCluster == null) { console.log("Clicked content cluster null"); return; }
    if (this.event_clickedContentCluster.class.lessonModules == null) { console.log("lesson modules null"); return; }
    if (this.event_clickedContentCluster.class.lessonModules[this.event_clickedContentCluster.lessonModuleIndex] == null) { console.log("this lesson module null"); return; }
    if (this.event_clickedContentCluster.class.lessonModules[this.event_clickedContentCluster.lessonModuleIndex].contentClusters == null) { console.log("content clusters null"); return; }
    
    if (this.event_clickedContentCluster.lessonModuleIndex == null) { console.log("lesson module index null"); return; }

    let cc = this.event_clickedContentCluster.class.lessonModules[this.event_clickedContentCluster.lessonModuleIndex].contentClusters;

    if (cc != null)
      cc[this.clickedContentClusterIndex] = changedContentCluster;
    else { console.log("Content cluster null"); return; }
    
    console.log("Updating content cluster.");
    // TODO: Update to id based.
    // this.firestoreService.updateClass(this.event_clickedContentCluster.class);

  }
}
