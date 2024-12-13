import { Component, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentCreatorModalComponent } from '../elements/content-creator-modal/content-creator-modal.component';
import { ClassCreatorModalComponent } from '../elements/class-creator-modal/class-creator-modal.component';
import { SubjectCreatorModalComponent } from '../elements/subject-creator-modal/subject-creator-modal.component';
import { LessonCreatorModalComponent } from '../elements/lesson-creator-modal/lesson-creator-modal.component';
import { UploadRequestTemplate } from 'app/services/uploads/upload-request-template';
import { UploadQueueService } from 'app/services/uploads/upload-queue.service';
import { LessonContent } from 'app/models/Interfaces/LessonContent';


@Component({
  selector: 'app-base-creator',
  templateUrl: './base-creator.component.html',
  styleUrls: ['./base-creator.component.scss']
})
export class BaseCreatorComponent implements AfterViewInit {

  public nodeTypeText: string[] = ["Class", "Subject", "Lesson", "Content"];
  public nodeType: number = 0;

  public enabled: boolean = false;

  constructor(public activeModal: NgbActiveModal, public uploadQueue: UploadQueueService) {
    console.log(this.modalType);





  }

  @ViewChild(ClassCreatorModalComponent) classCreator: ClassCreatorModalComponent;
  @ViewChild(SubjectCreatorModalComponent) subjectCreator: SubjectCreatorModalComponent;
  @ViewChild(LessonCreatorModalComponent) lessonCreator: LessonCreatorModalComponent;
  @ViewChild(ContentCreatorModalComponent) contentCreator: ContentCreatorModalComponent;
  ngAfterViewInit(): void {
    this.finishedLoad = true;
    //content form
    if (this.contentCreator) { //creator component exists
      if (this.contentCreator.contentFormGroup) {
        {// content form exists
          if (this.modalType.toLowerCase() == "update") {
            // set booleans

            console.log("update modal type, setting bools")

            this.contentCreator.showFileUploadMethodDropdown = false;
            this.contentCreator.showFileUploadField = false;

            if (this.data && this.data.uploadMethod && this.data.uploadMethod == 0) {
              console.log("not url")
              this.contentCreator.showUrlField = false;
            }
          }

          // if (!this.contentCreator.contentFormGroup.valid) { // validates
          //   thisCanSave = false;
          // }
        }
      }
    }

  }

  public contentCanSubmit: boolean = false;


  public data: any = {
    title: "",
    description: ""
  };

  public onFinishCallback: any;


  public modalType = 'Create';
  finishedLoad: boolean = false;
  setData(data: any) {
    this.data = data;
    this.enabled = true;

    let wait = setInterval(() => {

      if (this.contentCreator) {

        let inputFileControl: FormControl = new FormControl(null, [Validators.required]);
        let urlControl: FormControl = new FormControl(null, [Validators.required]);
        let emptyControl: FormControl = new FormControl(null);



        console.log("url", data.getURL);
        console.log("uploadMethod", data.uploadMethod);

        let element = data as LessonContent;


        if (element.uploadMethod)
          this.contentCreator.contentFormGroup.controls['fileUploadMethod'].setValue(data.uploadMethod);
          
        if (this.modalType.toLowerCase() == "update") {
          this.contentCreator.showContentType = false;
        }

        if (!element.uploadMethod || (element.uploadMethod && element.uploadMethod == 0)) {

          if (this.modalType.toLowerCase() == "update") {

            this.contentCreator.showFileUploadMethodDropdown = false;
            this.contentCreator.showFileUploadField = false;
            this.contentCreator.showUrlField = false;

            this.contentCreator.contentFormGroup.setControl('inputFile', emptyControl);
            this.contentCreator.contentFormGroup.setControl('contentType', emptyControl);

          } else {
            this.contentCreator.contentFormGroup.setControl('inputFile', inputFileControl);

          }
          this.contentCreator.contentFormGroup.setControl('urlField', emptyControl);
          this.contentCreator.isURLContentType = false;



          // else this.contentCreator.contentFormGroup.controls['fileUploadMethod'].setValue(0);
        } else {
          this.contentCreator.showUrlField = true;
          this.contentCreator.isURLContentType = true;
          this.contentCreator.contentFormGroup.setControl('inputFile', emptyControl);
          this.contentCreator.contentFormGroup.setControl('urlField', urlControl);
        }



        this.contentCreator.contentFormGroup.controls['urlField'].setValue(element.getURL);
        this.contentCreator.contentFormGroup.controls['contentType'].setValue(element.contentType);
        this.contentCreator.contentFormGroup.controls['videoFormat'].setValue(element.contentFormatType);
        this.contentCreator.contentFormGroup.controls['isStereo'].setValue(element.isStereoscopic);


        let urlField: boolean = this.contentCreator.contentFormGroup.controls['urlField'].valid;
        let inputFile: boolean = this.contentCreator.contentFormGroup.controls['inputFile'].valid;
        let fileUploadMethod: boolean = this.contentCreator.contentFormGroup.controls['fileUploadMethod'].valid;
        let contentType: boolean = this.contentCreator.contentFormGroup.controls['contentType'].valid;
        let videoFormat: boolean = this.contentCreator.contentFormGroup.controls['videoFormat'].valid;
        let isStereo: boolean = this.contentCreator.contentFormGroup.controls['isStereo'].valid;

        console.log("urlField", urlField);
        console.log("inputFile", inputFile);
        console.log("fileUploadMethod", fileUploadMethod);
        console.log("contentType", contentType);
        console.log("videoFormat", videoFormat);
        console.log("isStereo", isStereo);
      }

      if (this.finishedLoad) {

        clearInterval(wait);
      }
    }, 10)



  }

  public canSave() {
    let thisCanSave = true; // true by default

    // base form
    if (this.form.valid == false)
      thisCanSave = false;

    // class form
    if (this.classCreator)
      if (this.classCreator.inputForm)
        if (!this.classCreator.inputForm.valid)
          thisCanSave = false;

    // subject form
    if (this.subjectCreator)
      if (this.subjectCreator.inputForm)
        if (!this.subjectCreator.inputForm.valid)
          thisCanSave = false;

    // lesson form
    if (this.lessonCreator)
      if (this.lessonCreator.inputForm)
        if (!this.lessonCreator.inputForm.valid)
          thisCanSave = false;

    //content form
    if (this.contentCreator) { //creator component exists
      if (this.contentCreator.contentFormGroup) {
        {
          // content form exists
          //           if (this.modalType.toLowerCase() == "update") {
          //             // set booleans
          // 
          //             // console.log("update modal type, setting bools")
          // 
          //             this.contentCreator.showFileUploadMethodDropdown = false;
          //             this.contentCreator.showFileUploadField = false;
          // 
          //             if (this.data && this.data.uploadMethod && this.data.uploadMethod == 0) {
          //               console.log("not url")
          //               this.contentCreator.showUrlField = false;
          //             }
          //           }


          // console.log(parseInt(this.contentCreator.contentFormGroup.controls['contentType'].value))

          if (!this.contentCreator.contentFormGroup.valid) { // validates
            thisCanSave = false;
          }
        }
      }
    }

    // console.log(thisCanSave);
    return thisCanSave;
  }

  public save() {
    if (this.nodeType == 3)
      if (this.contentCreator)
        if (this.contentCreator.contentFormGroup.valid) {

          // console.log(this.contentCreator.updateAllValues());


          // if (parseInt(this.contentCreator.contentFormGroup.controls['fileUploadMethod'].value) == 0) {
          if (this.modalType.toLowerCase() == 'create') {
            let element: LessonContent = { ...this.contentCreator.updateAllValues() as LessonContent, contentType: parseInt(this.contentCreator.contentFormGroup.controls['contentType'].value), title: this.data.title, description: this.data.description } as LessonContent;

            let output = {
              data: element,
              file: {} as UploadRequestTemplate,
              method: (parseInt(this.contentCreator.contentFormGroup.controls['fileUploadMethod'].value))
            };
            if (output.method == 0) {
              let uploadrequest: UploadRequestTemplate = {
                id: this.uploadQueue.generateGuid(),
                fileName: (this.contentCreator.selectedFile as File).name,
                file: this.contentCreator.selectedFile as File,
                contentData: element
              } as UploadRequestTemplate;

              output.file = uploadrequest;
            }
            console.log(output);
            this.activeModal.close(output);
          }
          else {
            let overwrite: LessonContent = {
              ...this.data,
              ...this.contentCreator.updateAllValues(),
              contentType: this.data.contentType,
              getURL: (this.data.uploadMethod == 1) ? this.contentCreator.contentFormGroup.controls['urlField'].value : this.data.getURL,
              title: this.data.title,
              description: this.data.description
            } as LessonContent;

            this.activeModal.close(overwrite);
          }
          return;
          // this.uploadQueue.Enqueue(uploadrequest);

          // this.contentCreator.upload();
          // }
        } else return;


    this.activeModal.close(this.data);
  }

  public close() {
    this.activeModal.close();
  }

  form: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required])
  });
  get title() { return this.form.get("title"); }
  get description() { return this.form.get("description"); }
}
