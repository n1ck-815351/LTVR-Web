import { Component, EventEmitter, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'app/uploads/shared/upload.service';
import { AuthService } from 'app/services/firebase/auth.service';
import { filter } from 'rxjs';
import { CreatorDialog } from 'app/models/Interfaces/events/creator-dialog';
import { LessonContent } from 'app/models/Interfaces/LessonContent';

@Component({
  selector: 'app-content-creator-modal',
  templateUrl: './content-creator-modal.component.html',
  styleUrls: ['./content-creator-modal.component.scss']
})
export class ContentCreatorModalComponent implements AfterViewInit {


  // the content creator needs to hide the file upload method and upload field if the current modal type is "update"
  // it also needs to SHOW the URL field if the upload method was URL, so that it can be changed.
  // Eventually, content needs to be able to have the file swapped for the newly uploaded one. So the old one would get removed. 


  showContentType: boolean = true;
  showFileUploadMethodDropdown: boolean = true;
  showFileUploadField: boolean = true;
  showUrlField: boolean = true;

  contentFormGroup: FormGroup = new FormGroup({
    urlField: new FormControl(null),
    inputFile: new FormControl(null),
    fileUploadMethod: new FormControl(0, [Validators.required]),
    contentType: new FormControl(0, [Validators.required]),
    videoFormat: new FormControl(0),
    isStereo: new FormControl(false),
    // stereoLayout: new FormControl(0),
    // is360: new FormControl(false),
  });


  constructor(public fbRequestService: FirebaseRequestService, config: NgbProgressbarConfig, public uploadService: UploadService, 
    public authService: AuthService, private cd: ChangeDetectorRef) {
    config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = "success";
    config.height = "20px";

    uploadService.onUploadFinished.push((url: string) => this.onUploadFinish(url));
    // this.inputForm.valueChanges.subscribe(() => this.formGroupEmitter.emit(this.inputForm));
    // this.inputForm.statusChanges.subscribe(() => this.onValidatedChanged.emit(this.inputForm.valid));


    // this.contentFormGroup.controls['urlField'] = this.
  }

  ngAfterViewInit(): void {
    let inputFileControl: FormControl = new FormControl(null, [Validators.required]);

    let urlControl: FormControl = new FormControl(null, [Validators.required]);

    let emptyControl: FormControl = new FormControl(null);

    this.contentFormGroup.setControl('inputFile', inputFileControl);
    this.contentFormGroup.setControl('urlField', emptyControl);

    this.contentFormGroup.controls['fileUploadMethod'].valueChanges.subscribe(() => {
      // console.log("changed");
      // console.log("fileuploadmethod",parseInt(this.contentFormGroup.controls['fileUploadMethod'].value));
      if (parseInt(this.contentFormGroup.controls['fileUploadMethod'].value) == 0) {
        this.contentFormGroup.setControl('inputFile', inputFileControl);
        this.contentFormGroup.setControl('urlField', emptyControl);
      } else {
        this.contentFormGroup.setControl('inputFile', emptyControl);
        this.contentFormGroup.setControl('urlField', urlControl);
      }
      // console.log("selecting file upload method :",this.contentFormGroup.controls['fileUploadMethod'].value);
    });
    this.onTypeChange();

    // let checker = setInterval(() => {
    //   if (this.contentFormGroup.valid == false) {
    //     console.log("invalid");
    //     document.querySelector("#genericCreatorForm")?.classList.remove("needs-validation")
    //     document.querySelector("#genericCreatorForm")?.classList.add("was-validated")
    //     // return;
    //   }
    //   
    //   if(!this.contentFormGroup) clearInterval(checker);
    // }, 50);
  }

  updateAllValues() {
    let e: LessonContent = {} as LessonContent;
    // e.title = this.contentFormGroup.controls['title'].value;
    // e.description = this.contentFormGroup.controls['description'].value;
    // e.tags = this.contentFormGroup.controls['tags'].value;

    e.contentType = this.contentFormGroup.controls['contentType'].value;
    e.uploadMethod = this.contentFormGroup.controls['fileUploadMethod'].value;

    // this.args.is360 = this.inputForm.controls['is360'].value;
    e.isStereoscopic = this.contentFormGroup.controls['isStereo'].value;
    e.contentFormatType = this.contentFormGroup.controls['videoFormat'].value;

    if (this.useURL) e.getURL = this.contentFormGroup.controls['urlField'].value;
    // console.log(e);
    // e.optionalArgs = this.args;

    return e;
  }


  is360: boolean = false;
  isStereo: boolean = false;
  selectedType: string | null;

  _canSubmit: boolean = false;
  set canSubmit(val: boolean) { this._canSubmit = val; }
  // @Output() formGroupEmitter: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  // @Output() onValidatedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  // public testing:string = "does not work";

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



  selectedFile: File | null = this.contentFormGroup.controls['inputFile'].value;

  updateBooleans() {
    //     if (this.inputForm.controls['is360'].value != null)
    //       this.is360 = this.inputForm.controls['is360'].value;
    // 
    //     if (this.inputForm.controls['isStereo'].value != null)
    //       this.isStereo = this.inputForm.controls['isStereo'].value;
    // 

    this.args.contentFormatType = parseInt(this.contentFormGroup.controls['videoFormat'].value);

    switch (parseInt(this.contentFormGroup.controls['videoFormat'].value)) {
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

    if (this.contentFormGroup.controls['isStereo'].value != null)
      this.isStereo = this.contentFormGroup.controls['isStereo'].value;
    this.args.isStereoscopic = this.isStereo;

    if (this.is360 == false) this.isStereo = false;

    this.args.is360 = this.is360;

    console.log("is360", this.is360, "isStereo", this.isStereo);
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

  acceptedFileTypes = [
    'image/jpeg',
    'image/png',
    'model/obj',
    'model/stl',
    'model/fbx',
    'model/gltf-binary', // glb files
    'video/AV1',
    'video/JPEG',
    'video/mp4',
  ];

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile?.type) {
      if (!this.acceptedFileTypes.find(element => element.toLowerCase() == this.selectedFile?.type)) {
        console.log(this.selectedFile, this.selectedFile?.type);  
        console.log(`Invalid File Type. File type "${this.selectedFile?.type}" not a supported type.`);  
        this.selectedFile = null;
        this.cd.detectChanges();
      }
    }
  }

  onMethodChange() {
    if (this.contentFormGroup.controls['fileUploadMethod'].value == 0) {
      this.useURL = false;
    } else
      this.useURL = true;

    // if (this.contentFormGroup.controls['fileUploadMethod'].value == 0 && this.isURLContentType == false) {
    //   if (this.uploadProgress < 100) { this.canSubmit = false; } else { this.useURL = true; this.canSubmit = true; }
    // }
    // else if (this.isURLContentType == true || this.contentFormGroup.controls['fileUploadMethod'].value == 1) {
    //   this.canSubmit = true; this.useURL = true;
    // }
  }

  isURLContentType: boolean = false;
  useURL: boolean = false;

  onTypeChange() {
    let n: number = parseInt(this.contentFormGroup.controls['contentType'].value) as number;

    if (this.getIsUrlType(n)) {
      this.isURLContentType = true;
      this.contentFormGroup.controls['fileUploadMethod'].setValue(1);
    }
    else {
      this.isURLContentType = false;
      this.contentFormGroup.controls['fileUploadMethod'].setValue(0);
    }

    // console.log(this.isURLContentType);
    this.onMethodChange();

    this.selectedType = this.fbRequestService._contentTypes[n];


    let inputFileControl: FormControl = new FormControl(null, [Validators.required]);

    let urlControl: FormControl = new FormControl(null, [Validators.required]);

    let emptyControl: FormControl = new FormControl(null);

    this.contentFormGroup.setControl('inputFile', inputFileControl);
    this.contentFormGroup.setControl('urlField', emptyControl);

    // this.contentFormGroup.controls['fileUploadMethod'].valueChanges.subscribe(() => {
    // console.log("changed");
    // console.log("fileuploadmethod",parseInt(this.contentFormGroup.controls['fileUploadMethod'].value));
    if (parseInt(this.contentFormGroup.controls['fileUploadMethod'].value) == 0) {
      console.log("overwriting with fake control for url");
      this.contentFormGroup.setControl('inputFile', inputFileControl);
      this.contentFormGroup.setControl('urlField', emptyControl);
    } else {
      console.log("overwriting with fake control for input file");
      this.contentFormGroup.setControl('inputFile', emptyControl);
      this.contentFormGroup.setControl('urlField', urlControl);
    }
    // console.log(this.contentFormGroup);
    // });
    console.log("selecting file upload method :", this.contentFormGroup.controls['fileUploadMethod'].value, "input file valid:", this.contentFormGroup.controls['inputFile'].valid);
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
