import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { LessonModuleEvent } from 'app/models/Interfaces/events/lesson-module-event';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-lessonmodule-editor-modal',
  templateUrl: './lessonmodule-editor-modal.component.html',
  styleUrls: ['./lessonmodule-editor-modal.component.scss']
})
export class LessonmoduleEditorModalComponent {
  constructor(public firestoreService: FirestoreService) {

  }

  lessonModuleEditorForm: FormGroup;
  private _clickedLessonModule: ClassroomSubject;
  @Input() class: Classroom;
  get clickedLessonModule(): ClassroomSubject {
    return this._clickedLessonModule;
  }
  @Input() set clickedLessonModule(value: ClassroomSubject) {
    this._clickedLessonModule = value;

    if (value != null && value != undefined) {
      this.lessonModuleEditorForm = new FormGroup({
        lmEdit_title: new FormControl(value.title),
        lmEdit_description: new FormControl(value.description),
        lmEdit_tags: new FormControl(value.tags)
      });

      // console.log(this.lessonModuleEditorForm);
    }
  }

  @Input() clickedLessonModuleIndex: number;
  // get and set to update clicked class variable formgroup
  @Input() event_clickedLessonModule: LessonModuleEvent;
  @Output() changedLessonModuleEvent = new EventEmitter<LessonModuleEvent>();

  ngOnInit(): void {
    // $('#lessonModuleEditorModal').appendTo("body").modal('show');
    // $('#lessonModuleEditorModal').on('shown.bs.modal', function () {
    //   //To relate the z-index make sure backdrop and modal are siblings
    //   $(this).before($('.modal-backdrop'));
    //   //Now set z-index of modal greater than backdrop
    //   $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1000);
    // }); 


  }




  SubmitEdits() {

    if (this.lessonModuleEditorForm == null) return;
    if (this._clickedLessonModule == null) return;

    let changedLessonModule: ClassroomSubject = this._clickedLessonModule;

    let title: string = this.lessonModuleEditorForm.controls['lmEdit_title'].value;
    let description: string = this.lessonModuleEditorForm.controls['lmEdit_description'].value;
    let tags: string = this.lessonModuleEditorForm.controls['lmEdit_tags'].value;
    changedLessonModule.title = title;
    changedLessonModule.description = description;
    changedLessonModule.tags = tags;


    if (this.event_clickedLessonModule == null) return;
    if (this.event_clickedLessonModule.class.lessonModules == null) return;

    this.event_clickedLessonModule.class.lessonModules[this.clickedLessonModuleIndex] = changedLessonModule;

    // TODO: Update to id driven 
    // this.firestoreService.updateClass(this.event_clickedLessonModule.class);

  }
}
