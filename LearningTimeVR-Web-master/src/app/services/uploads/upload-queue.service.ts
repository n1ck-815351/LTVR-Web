import { Injectable } from '@angular/core';
import { UploadService } from 'app/uploads/shared/upload.service';
import { UploadRequestTemplate } from './upload-request-template';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { concatMap } from 'rxjs';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UploadQueueService {
  private queueSubject: BehaviorSubject<UploadRequestTemplate[]> = new BehaviorSubject<UploadRequestTemplate[]>([]);
  private queue$: Observable<UploadRequestTemplate[]> = this.queueSubject.asObservable();
  public get uploads(): UploadRequestTemplate[] { return this.queueSubject.value };
  // public get uploads() { return this.queue; };
  public finishedUploads: UploadRequestTemplate[] = [] as UploadRequestTemplate[];
  public failedUploads: UploadRequestTemplate[] = [] as UploadRequestTemplate[];
  public currentUpload: UploadRequestTemplate|null;

  private processQueueSubject: Subject<void>;

  constructor(public uploadService: UploadService, private fs: FirestoreService) {

    // append OnSuccess function to the onUploadFinished callback list
    // this.uploadService.onUploadFinished.push(this.OnSuccess);


    // this.Queue();
    // this.queue = [];
    this.processQueueSubject = new Subject<void>();
    this.processQueueSubject.pipe(concatMap(() => this.processQueue())).subscribe();

  }

  public Enqueue(upload: UploadRequestTemplate) {
    const currentValue = this.queueSubject.value;
    const updatedValue = [...currentValue, upload];
    this.queueSubject.next(updatedValue);
    this.processQueueSubject.next();
    // this.queue.push(upload);
    // this.processQueueSubject.next();
  }
  public Dequeue(upload: UploadRequestTemplate|null) {
    if(!upload) return;
    const queue = this.queueSubject.getValue();
    const index = queue.findIndex(item => item.id === upload.id && item.fileName === upload.fileName);

    if (index !== -1) {
      queue.splice(index, 1);
      this.queueSubject.next(queue);
    }

    // for (let i = 0; i < this.queue.length; i++) {
    //   if (upload.id + upload.fileName == this.queue[i].id + this.queue[i].fileName) {
    //     console.log("removing", upload.fileName);
    //     console.log(this.queue.splice(i, 1));
    //     return;
    //   }
    // }
  }
  public GetQueue() {
    // let copy: UploadRequestTemplate[] = [];
    // for (let i = 0; i < this.queue.length; i++) {
    //   copy[i] = Object.assign({}, this.queue[i]);
    // }
    // if (copy.length > 0 || this.queue.length > 0) {
    //   console.log("uploads", this.queue);
    //   console.log("copy", copy);
    // }
    return this.uploads;
  }

  private async processQueue() {
    if (this.uploadService.isUploading || this.queueSubject.value.length === 0) {
      return;
    }
    const file = this.queueSubject.value[0];
    await this.pushUpload(file);
    
    // if(this.uploadService.isUploading) return;
    // return this.queue$.pipe(
    //   concatMap(queue => from(queue)),
    //   concatMap(file => this.pushUpload(file))
    // ).subscribe();
  }

  private async pushUpload(req: UploadRequestTemplate) {
    if (this.uploadService.isUploading == false) {

      // if (!req) { console.log("file undefined", req); this.OnFail(req); return; }
      // if (!req.file) { console.log("file undefined", req); this.OnFail(req); return; }
      // if (!req.fileName) { console.log("filename undefined", req); this.OnFail(req); return; }
      // if (!req.id) { console.log("id undefined", req); this.OnFail(req); return; }

      this.uploadService.onUploadFinished = [];
      this.uploadService.onUploadFinished.push(this.create);


      console.log("Uploading file:", req);
      this.uploadService.isUploading = true;
      this.currentUpload = req;
      // this.Dequeue(this.currentUpload);



      await this.uploadService.pushUpload(req.fileName, req.file, req, this, this.OnFail)
        .catch((error) => {
          console.log(error);
          this.OnFail(req);
        });

    }

    //     setInterval(() => {
    // 
    //     }, 500);
  }
  private OnSuccess() {
    if (!this.finishedUploads) this.finishedUploads = [];
    if(!this.currentUpload) return;
    this.finishedUploads.push(Object.assign({},this.currentUpload));
    this.Dequeue(this.currentUpload);
    this.currentUpload = null;
    this.currentUpload = this.uploads[0];
  }

  private OnFail(upload: any) {
    if (!this.failedUploads) this.failedUploads = [];
    this.failedUploads.push(upload);
    this.Dequeue(upload);
  }


  public async CancelUpload(req: UploadRequestTemplate) {
    // find in queue and remove.
    // if already uploading, cancel upload and clean up.
    if (await this.uploadService.uploadTask.cancel()) {
      this.uploadService.isUploading = false;
      console.log("Cancelled current upload task.");
    } else {
      console.log("Could not cancel current upload task.");
    }
  }

  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async create(req: UploadRequestTemplate, fs: FirestoreService, uploadQueue: UploadQueueService) {
    console.log("Attempting create...");
    if (!req.lessonId) return;
    if (!req.DbCollection) return;
    // req.contentData.getURL = this.uploadService.urlResult;
    console.log("creating content", req)
    fs.firestore.collection(req.DbCollection).add(req.contentData).then((result) => {
      console.log(result);
      uploadQueue.OnSuccess();
    })
  }
}
