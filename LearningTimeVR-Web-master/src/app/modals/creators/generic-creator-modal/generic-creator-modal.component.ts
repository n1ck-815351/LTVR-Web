import { Component, Input, OnInit } from '@angular/core';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { CreatorDialog } from 'app/models/Interfaces/events/creator-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'app/uploads/shared/upload.service';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { AuthService } from 'app/services/firebase/auth.service';
@Component({
  selector: 'app-generic-creator-modal',
  templateUrl: './generic-creator-modal.component.html',
  styleUrls: ['./generic-creator-modal.component.scss']
})
export class GenericCreatorModalComponent implements OnInit {

  constructor(public fbRequestService: FirebaseRequestService, config: NgbProgressbarConfig, public uploadService: UploadService, public authService: AuthService) {
    config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = "success";
    config.height = "20px";

    uploadService.onUploadFinished.push((url: string) => this.onUploadFinish(url));
  }
  ngOnInit(): void {
    if (this.nodeType == "Content") {
      this.canSubmit = false;
    } else this.canSubmit = true;
  }



  @Input() elementclass: Classroom;
  @Input() nodeType: string;
  @Input() loading: boolean = false;
  @Input() id: string | null;

  is360: boolean = false;
  isStereo: boolean = false;
  selectedType: string | null;

  canSubmit: boolean = true;

  args = {
    url: "",
    contentType: 0,
    is360: false,
    isStereoscopic: false,
    // stereoLayout: 0,
    contentFormatType: 0
  };

  contentFormats: ["Flat", "360", "180"];
  stereoFormats: ["Over Under", "Side by Side", "Quad"];

  uploading: boolean = false;
  uploadProgress: number = 0;

  inputForm: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    tags: new FormControl("", [Validators.required]),
    urlField: new FormControl(""),
    inputFile: new FormControl(null),
    fileUploadMethod: new FormControl(0, [Validators.required]),
    contentType: new FormControl(0, [Validators.required]),
    videoFormat: new FormControl(0, [Validators.required]),
    // stereoLayout: new FormControl(0),
    isStereo: new FormControl(false),
    // is360: new FormControl(false),
  });

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

  selectedFile: File = this.inputForm.controls['inputFile'].value;

  async CommitResults(value: boolean) {
    let e: CreatorDialog = { confirmed: value } as CreatorDialog;

    if (value == false) {
      console.log(value);
      this.fbRequestService.creatorDialogEvent.emit(e);
      return;
    }

    if (this.inputForm.valid == false && value == true) {
      console.log("invalid");
      document.querySelector("#genericCreatorForm")?.classList.remove("needs-validation")
      document.querySelector("#genericCreatorForm")?.classList.add("was-validated")
      return;
    }


    e.title = this.inputForm.controls['title'].value;
    e.description = this.inputForm.controls['description'].value;
    e.tags = this.inputForm.controls['tags'].value;

    if (this.nodeType == "Content") {
      this.args.contentType = this.inputForm.controls['contentType'].value;

      // this.args.is360 = this.inputForm.controls['is360'].value;
      this.args.isStereoscopic = this.inputForm.controls['isStereo'].value;

      if (this.useURL) this.args.url = this.inputForm.controls['urlField'].value;
      e.optionalArgs = this.args;
    }

    this.fbRequestService.creatorDialogEvent.emit(e);
  }

  async upload() {
    this.uploading = true;
    // this.uploadService.onUploadProgressChange = this.updateProgress;
    // await this.uploadService.pushUpload(this.elementclass.id + "_" + this.inputForm.controls['title'] + "_" + this.elementclass.id + "_", this.selectedFile);
    // .then((result) => {
    //   this.args.url = result;
    // });
//     await this.uploadService.pushUpload(this.authService.user.uid, this.selectedFile).then((result) => {
//       this.args.url = result.url;
//       this.fileIsUploaded = true;
//       console.log(result);
// 
//     });
    this.uploading = false;
    console.log("File is uploaded", this.fileIsUploaded);
  }

  fileIsUploaded: boolean = false;

  onUploadFinish(url: string) {
    this.canSubmit = true;
    this.args.url = url;
  }

  getProgress() {
    // console.log("Got progress")
    this.uploadProgress = this.uploadService.uploadProgress;
    return this.uploadService.uploadProgress;
  }
  // updateProgress(progress: number) {
  //   this.uploadProgress = progress;
  //   console.log("Retrieved progress:", this.uploadProgress);
  // }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onMethodChange() {
    if (this.inputForm.controls['fileUploadMethod'].value == 0 && this.isURLContentType == false) {
      if (this.uploadProgress < 100) { this.canSubmit = false; } else { this.useURL = true; this.canSubmit = true; }
    }
    else if (this.isURLContentType == true || this.inputForm.controls['fileUploadMethod'].value == 1) {
      this.canSubmit = true; this.useURL = true;
    }
  }

  isURLContentType: boolean = false;
  useURL: boolean = false;

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
    this.onMethodChange();

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
