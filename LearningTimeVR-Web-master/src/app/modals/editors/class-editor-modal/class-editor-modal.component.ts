import { Component, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { EditDialog } from 'app/models/Interfaces/events/edit-dialog';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';

@Component({
  selector: 'app-class-editor-modal',
  templateUrl: './class-editor-modal.component.html',
  styleUrls: ['./class-editor-modal.component.scss']
})
export class ClassEditorModalComponent implements OnInit {

  constructor(public firestoreService: FirestoreService, public fbReqService: FirebaseRequestService) {

  }

  classEditorForm: FormGroup;
  submitted = false;
  private _clickedClass: Classroom;
  // @Input() clickedClass:element_class;
  get clickedClass(): Classroom {
    return this._clickedClass;
  }
  @Input() set clickedClass(value: Classroom) {
    this._clickedClass = value;
    this.classEditorForm = new FormGroup({
      title: new FormControl(this.clickedClass.title, Validators.required),
      description: new FormControl(this.clickedClass.description, Validators.required),
      tags: new FormControl(this.clickedClass.tags, Validators.required)
    });

  }

  @Output() private changedClass: Classroom;

  ngOnInit(): void {
  }


  async SubmitEdits() {
    let e = { confirmed: false } as EditDialog;



    if (this.classEditorForm.invalid) {
      this.fbReqService.editDialogEvent.emit(e)
      return;
    }

    this.changedClass = this._clickedClass;
    let title: string = this.classEditorForm.controls['title'].value;
    let description: string = this.classEditorForm.controls['description'].value;
    let tags: string = this.classEditorForm.controls['tags'].value;
    this.changedClass.title = title;
    this.changedClass.description = description;
    this.changedClass.tags = tags;

    // call emitter
    e.confirmed = true;
    e.changedElement = this.changedClass;
    this.fbReqService.editDialogEvent.emit(e)

  }
}
