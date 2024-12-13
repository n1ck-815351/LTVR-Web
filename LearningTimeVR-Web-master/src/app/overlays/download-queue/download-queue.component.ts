import { Component, AfterViewInit } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/services/firebase/auth.service';
import { UploadQueueService } from 'app/services/uploads/upload-queue.service';
import { UploadRequestTemplate } from 'app/services/uploads/upload-request-template';
import { UploadService } from 'app/uploads/shared/upload.service';

@Component({
  selector: 'app-upload-queue',
  templateUrl: './download-queue.component.html',
  styleUrls: ['./download-queue.component.scss']
})
export class UploadQueueComponent implements AfterViewInit {
  constructor(config: NgbProgressbarConfig, public uploadQueue: UploadQueueService, public uploadService: UploadService, public auth:AuthService) {
    config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = "primary";
    config.height = "20px";
    this.update();
    // uploadService.onUploadFinished.push((url: string) => this.onUploadFinish(url));
  }


  ngAfterViewInit(): void {
    this.uploadWindowElement = document.querySelector("#downloadQueueWindow");
    this.cloudUploadIcon = document.querySelector("#cloudUploadIcon");
  }

  uploads: UploadRequestTemplate[] = this.uploadQueue.uploads;


  // uploads:UploadRequestTemplate[];

  cloudUploadIcon: any;
  update() {

    setInterval(() => {
      // if (this.uploadQueue.uploads.length > 0)
      // console.log("-----------UPLOADS------------",this.uploadQueue.uploads);
      
      const downloadQueueWindow = document.querySelector("#downloadQueueWindow");

      if (this.uploadQueue.GetQueue() && this.uploadQueue.GetQueue().length > 0) {
        this.cloudUploadIcon.classList.add("pulse");
        downloadQueueWindow.classList.add("slide-in");
        downloadQueueWindow.classList.remove("slide-out");
      } else {
        this.cloudUploadIcon.classList.remove("pulse");
        // downloadQueueWindow.classList.add("slide-in");
        // downloadQueueWindow.classList.remove("slide-out");
      }


      const expandBtn = document.querySelector("#expandButton");
      const downloadQueueWindowHeight = this.uploadWindowElement.offsetHeight;
      const expandBtnHeight = expandBtn.offsetHeight;

      let currentHeight = parseFloat(document.documentElement.style.getPropertyValue('--download-queue-height'));

      if (currentHeight != (-downloadQueueWindowHeight + expandBtnHeight))
        document.documentElement.style.setProperty('--download-queue-height', `${-downloadQueueWindowHeight + expandBtnHeight}px`);
    }, 100);


  }
  clearFinished() {
    this.uploadQueue.finishedUploads = [];
    this.uploadQueue.failedUploads = [];
  }


  cancelUpload(upload: UploadRequestTemplate) {
    if (this.uploadQueue.currentUpload)
      if (this.uploadQueue.currentUpload.id == upload.id) {
        // TODO: Cancel upload
      }
  }

  removeQueued(upload: UploadRequestTemplate) {
    this.uploadQueue.Dequeue(upload);
  }

  removeFinished(upload: UploadRequestTemplate) {
    for (let i = 0; i < this.uploadQueue.finishedUploads.length; i++) {
      if (this.uploadQueue.finishedUploads[i] == upload) {
        this.uploadQueue.finishedUploads.splice(i, 1);
      }
    }
    for (let i = 0; i < this.uploadQueue.failedUploads.length; i++) {
      if (this.uploadQueue.failedUploads[i] == upload) {
        this.uploadQueue.failedUploads.splice(i, 1);
      }
    }
  }


  uploadWindowElement: any;
  public toggled: boolean = false;
  public toggleWindow() {
    console.log("toggled");
    this.toggled = !this.toggled;
    this.uploadWindowElement.classList.toggle("slide-out");
    this.uploadWindowElement.classList.toggle("slide-in");


  }

  getProgress() {
    return this.uploadService.uploadProgress;
  }


}
