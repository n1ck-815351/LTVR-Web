import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { EditDialog } from 'app/models/Interfaces/events/edit-dialog';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';

@Component({
  selector: 'app-generic-editor-modal',
  templateUrl: './generic-editor-modal.component.html',
  styleUrls: ['./generic-editor-modal.component.scss']
})
export class GenericEditorModalComponent implements OnInit {
  constructor(public fbRequestService: FirebaseRequestService) {

  }
  inputForm: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    tags: new FormControl("", [Validators.required]),
    contentType: new FormControl(0),
    videoFormat: new FormControl(0),
    // stereoLayout: new FormControl(0),
    isStereo: new FormControl(false),
  });



  ngOnInit() {
    //     this.inputForm = new FormGroup({
    //       title: new FormControl(this.inputElement.title, [Validators.required]),
    //       description: new FormControl(this.inputElement.description, [Validators.required]),
    //       tags: new FormControl(this.inputElement.tags, [Validators.required]),
    //       contentType: new FormControl(this.fbRequestService._contentTypes[this.inputElement.contentType]),
    //       videoFormat: new FormControl(0),
    //       // stereoLayout: new FormControl(0),
    //       isStereo: new FormControl(false),
    //     });
    // 
    //     if (this.nodeType == "Content") {
    //       console.log(this.inputElement.contentType);
    //       this.inputForm.controls['contentType'].setValue(this.fbRequestService._contentTypes[this.inputElement.contentType]);
    //       this.inputForm.controls['videoFormat'].setValue(this.inputElement.contentFormatType);
    //       // this.inputForm.controls['stereoLayout'].setValue(this.inputElement.stereoLayout);
    //       this.inputForm.controls['isStereo'].setValue(this.inputElement.isStereoscopic);
    //     }
    // 
    //     // this.selectedType = this.fbRequestService._contentTypes[parseInt(this.inputForm.controls['contentType'].value)];
    // 
    //     console.log(this.processTypeName(this.fbRequestService._contentTypes[this.inputElement.contentType]));
    //     console.log(this.fbRequestService._contentTypes[this.inputElement.contentType]);
    //     console.log(this.inputForm.controls['contentType'].value);

    // this.inputElement.contentType
    // this.inputElement.videoFormat
    // this.inputElement.isStereoscopic
  }
  // this.inputForm
  public initialize() {

    console.log("init", this.fbRequestService._contentTypes[this.inputElement.contentType]);

    this.inputForm.controls['title'].setValue(this.inputElement.title);
    this.inputForm.controls['description'].setValue(this.inputElement.description);
    this.inputForm.controls['tags'].setValue(this.inputElement.tags);

    if (this.nodeType == "Content") {
      console.log(this.inputElement.contentType);
      this.inputForm.controls['contentType'].setValue(parseInt(this.inputElement.contentType));
      this.inputForm.controls['videoFormat'].setValue(this.inputElement.contentFormatType);
      // this.inputForm.controls['stereoLayout'].setValue(this.inputElement.stereoLayout);
      this.inputForm.controls['isStereo'].setValue(this.inputElement.isStereoscopic);
      
      console.log("set", this.fbRequestService._contentTypes[this.inputElement.contentType], "to", this.inputForm.controls['contentType'].value);
      this.selectedType = this.processTypeName(this.fbRequestService._contentTypes[this.inputElement.contentType]);
      this.updateBooleans();
    }

    // this.selectedType = this.fbRequestService._contentTypes[parseInt(this.inputForm.controls['contentType'].value)];

    
  }

  updateBooleans() {
    //     if (this.inputForm.controls['is360'].value != null)
    //       this.is360 = this.inputForm.controls['is360'].value;
    // 
    //     if (this.inputForm.controls['isStereo'].value != null)
    //       this.isStereo = this.inputForm.controls['isStereo'].value;
    // 

    this.args.contentFormatType = parseInt(this.inputForm.controls['videoFormat'].value);

    switch (parseInt(this.inputForm.controls['videoFormat'].value)) {
      case 0:
        this.is360 = false;
        break;
      case 1:
        this.is360 = true;
        break;
      case 2:
        this.is360 = true;
        break;
      default:
        this.is360 = false;
        break;
    }

    if (this.inputForm.controls['isStereo'].value != null)
      this.isStereo = this.inputForm.controls['isStereo'].value;
    this.args.isStereoscopic = this.isStereo;

    if (this.is360 == false) this.isStereo = false;

    this.args.is360 = this.is360;

    console.log("is360", this.is360, "isStereo", this.isStereo);
  }

  onStereoLayoutChange() {
    // this.args.stereoLayout = parseInt(this.inputForm.controls['stereoLayout'].value);
  }

  is360: boolean = false;
  isStereo: boolean = false;
  isURLContentType: boolean = false;
  selectedType: string;
  args = {
    is360: false,
    isStereoscopic: false,
    // stereoLayout: 0,
    contentFormatType: 0
  }

  @Input() nodeType: string;
  @Input() loading: boolean = false;
  @Input() inputElement: any;
  @Input() id: string | null;


  CommitResults(value: boolean) {
    let e: EditDialog = { confirmed: value } as EditDialog;

    if (value == false) {
      console.log(value);
      this.fbRequestService.editDialogEvent.emit(e);
      return;
    }

    if (this.inputForm.valid == false && value == true) {
      console.log("invalid");
      document.querySelector("#genericEditorForm")?.classList.remove("needs-validation")
      document.querySelector("#genericEditorForm")?.classList.add("was-validated")
      return;
    }


    e.changedElement = this.inputElement;
    e.changedElement.title = this.inputForm.controls['title'].value;
    e.changedElement.description = this.inputForm.controls['description'].value;
    e.changedElement.tags = this.inputForm.controls['tags'].value;

    if (this.nodeType == "Content") {
      e.changedElement.contentType = this.inputForm.controls['contentType'].value;
      e.changedElement.contentFormatType = this.inputForm.controls['videoFormat'].value;
      e.changedElement.isStereoscopic = this.inputForm.controls['isStereo'].value;
    }

    console.log("Emitting:", e);
    this.fbRequestService.editDialogEvent.emit(e);
  }


  onTypeChange() {
    let n: number = parseInt(this.inputForm.controls['contentType'].value) as number;

    if (this.getIsUrlType(n)) {
      this.isURLContentType = true;
      this.inputForm.controls['fileUploadMethod'].setValue(1);
    }
    else {
      this.isURLContentType = false;
      this.inputForm.controls['fileUploadMethod'].setValue(0);
    }

    // console.log(this.isURLContentType);
    // this.onMethodChange();

    this.selectedType = this.fbRequestService._contentTypes[n];
  }

  getIsUrlType(n: number) {
    const urlTypes = [6, 7, 8, 9] as number[];
    return urlTypes.includes(n);
  }

  processTypeName(s: string) {
    return this.toPascalCase(s);
  }

  toPascalCase(input: string) {
    return `${input}`
      .toLowerCase()
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)([a-zA-Z]*)/, 'g'),
        ($1, $2, $3) => ` ${$2.toUpperCase() + $3}`
      )
      .replace(new RegExp(/\w/), s => s.toUpperCase());
  }


}
