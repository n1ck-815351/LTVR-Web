import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UploadResolveResult } from 'app/models/Interfaces/UploadResolveResult';
import { AuthService } from 'app/services/firebase/auth.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UploadQueueService } from 'app/services/uploads/upload-queue.service';
import { UploadRequestTemplate } from 'app/services/uploads/upload-request-template';
import * as firebase from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot, StorageReference, UploadResult } from '@angular/fire/storage';
import { async } from 'rxjs';
import { GlobalService } from 'app/services/globalService/global.service';


@Injectable({
  providedIn: 'root'
})
export class UploadService {


  constructor(public auth: AuthService, public fs: FirestoreService, private global:GlobalService) { }

  firebaseApp: any = firebase.getApp();
  public storage_uploads: any = getStorage(this.firebaseApp, "gs://learningtimevr-uploads");
  storageRef: any = ref(this.storage_uploads);
  filesRef: any = ref(this.storageRef, this.global.outputCollection);
  urlResult: string;
  public uploadProgress: number;
  public onUploadProgressChange: any;
  public onUploadFinished: any[] = [] as any[];
  public isUploading: boolean = false;
  public uploadTask: any;

  async pushUpload(prefix: string | null, file: File, req: UploadRequestTemplate, uploadQueue: UploadQueueService, onFail: any): Promise<UploadResolveResult> {
    console.log(this.onUploadFinished)

    if (prefix == null) prefix = "error_no-prefix";
    console.log("type: " + file.type);
    let fname: string;
    let date = new Date().toString().replace(' ', '_');
    var rand4DigitID = Math.floor(1000 + Math.random() * 9000); // range from 1000 to 9999

    let uploadRef: any = ref(this.filesRef, (
      (fname = "contentPin?" + rand4DigitID + "&date?" + date +
        "&id?" + prefix + "_" + "&file?" + file.name
      )));
    console.log("uploadRef", uploadRef)

    this.uploadTask = uploadBytesResumable(uploadRef, file);

    return await new Promise((resolve, reject) => {
      this.uploadTask.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
          this.isUploading = true;
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // update progress bar here

          console.log(progress);
          this.uploadProgress = progress;
          // snapshot.state = 'paused';
          // this.onUploadProgressChange(progress);

          switch (snapshot.state) {
            case 'paused':
              console.log("Paused upload");
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }

          console.log("Uploaded " + file.name);
        },
        (error: any) => {
          reject(error);
          console.log(error.message);
          this.isUploading = false;
          onFail();
        },
        async () => {
          const ref: StorageReference = this.uploadTask.snapshot.ref;
          const path: string = ref.fullPath;
          const downloadUrl = await getDownloadURL(ref);
          let res: UploadResolveResult = {
            url: downloadUrl,
            fileName: fname
          };
          // console.log("file available at ", downloadURL);
          // this.urlResult = downloadURL;

          if (this.onUploadFinished != null && this.onUploadFinished != undefined) {
            // this.onUploadFinished.forEach(callback => {
            // callback(imgURL);


            // });

            console.log("Calling upload callbacks", req, this.onUploadFinished[0]);
            req.fullPath = path;
            req.contentData.getURL = downloadUrl;
            req.contentData.ref = ref.toString();
            this.onUploadFinished[0](req, this.fs, uploadQueue);
            this.isUploading = false;

          }

          resolve(res);
        });
    });
  }
}
