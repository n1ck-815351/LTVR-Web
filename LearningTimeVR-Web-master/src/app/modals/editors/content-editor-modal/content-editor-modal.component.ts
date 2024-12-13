import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { ContentEvent } from 'app/models/Interfaces/events/content-event';
import { FirestoreService } from 'app/services/firebase/firestore.service';

@Component({
  selector: 'app-content-editor-modal',
  templateUrl: './content-editor-modal.component.html',
  styleUrls: ['./content-editor-modal.component.scss']
})
export class ContentEditorModalComponent {
  constructor(public firestoreService: FirestoreService) {

  }

  contentEditorForm: FormGroup;
  private _clickedContent: LessonContent;
  get clickedContent(): LessonContent {
    return this._clickedContent;
  }
  @Input() set clickedContent(value: LessonContent) {
    this._clickedContent = value;
    console.log(value);

    if (value != null && value != undefined) {
      this.contentEditorForm = new FormGroup({
        contentEdit_title: new FormControl(value.title),
        contentEdit_description: new FormControl(value.description),
        contentEdit_tags: new FormControl(value.tags),
        contentEdit_type: new FormControl(value.contentType)
      });

      // console.log(this.lessonModuleEditorForm);
     this.contentEditorForm.controls['contentEdit_type'].setValue(value.contentType as number);
    }
  }

  @Input() clickedContentIndex: number;
  // get and set to update clicked class variable formgroup
  @Input() event_clickedContent: ContentEvent;
  @Output() changedLessonModuleEvent = new EventEmitter<ContentEvent>();
  

  SubmitEdits() {

    if (this.contentEditorForm == null) return;
    if (this._clickedContent == null) return;

    let changedContent: LessonContent = this._clickedContent;

    let title: string = this.contentEditorForm.controls['contentEdit_title'].value;
    let description: string = this.contentEditorForm.controls['contentEdit_description'].value;
    let tags: string = this.contentEditorForm.controls['contentEdit_tags'].value;
    let type: number = this.contentEditorForm.controls['contentEdit_type'].value;
    changedContent.title = title;
    changedContent.description = description;
    changedContent.tags = tags;
    changedContent.contentType = type;

    if (this.event_clickedContent == null) { console.log("Clicked content cluster null"); return; }
    console.log(this.event_clickedContent.class);
    if (this.event_clickedContent.class.lessonModules == null) { console.log("lesson modules null"); return; }
    if (this.event_clickedContent.class.lessonModules[this.event_clickedContent.lessonModuleIndex] == null) { console.log("this lesson module null"); return; }
    if (this.event_clickedContent.class.lessonModules[this.event_clickedContent.lessonModuleIndex].contentClusters == null) { console.log("content clusters null"); return; }

    if (this.event_clickedContent.lessonModuleIndex == null) { console.log("lesson module index null"); return; }

    let cc = this.event_clickedContent.class.lessonModules[this.event_clickedContent.lessonModuleIndex].contentClusters;

    if (cc == null) { console.log("Content Cluster null"); return; }

    let content = cc[this.event_clickedContent.contentClusterIndex].content;
    if (content == null) { console.log("Content null"); return; }
    content[this.clickedContentIndex] = changedContent;
    // else { console.log("Content cluster null"); return; }

    console.log("Updating content cluster.");
    // TODO: Update to id based.
    // this.firestoreService.updateClass(this.event_clickedContent.class);
    

  }
}
