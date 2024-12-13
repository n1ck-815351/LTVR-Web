import { EventEmitter, Injectable } from '@angular/core';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { Dialogue } from 'app/models/Interfaces/events/dialogue';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ValidationDialogComponent } from 'app/modals/validation-dialog/validation-dialog.component';
import { GenericCreatorModalComponent } from 'app/modals/creators/generic-creator-modal/generic-creator-modal.component';
// import { ClassEditorModalComponent } from 'app/modals/editors/class-editor-modal/class-editor-modal.component';
import { FirestoreService } from '../firebase/firestore.service';
import { CreatorDialog } from 'app/models/Interfaces/events/creator-dialog';
import { EditDialog } from 'app/models/Interfaces/events/edit-dialog';
import { GenericEditorModalComponent } from 'app/modals/editors/generic-editor-modal/generic-editor-modal.component';
import { ref } from 'firebase/storage';
import { UploadService } from 'app/uploads/shared/upload.service';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ModalService } from '../modal.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRequestService {

  // This must match the content type enum in the VR app.
  // this array is being used in the html for showing the content type in a readable format. These names are not necessarily the same as the enum names.
  public _contentTypes: string[] = ["IMAGE", "360_IMAGE", "VIDEO", "360_VIDEO", "MODEL", "QUIZ",
    "WEB_BROWSER", "YOUTUBE_VIDEO"];
  public _formatTypes: string[] = ["flat", "360", "180"];
  public _sLayouts: string[] = ["over under", "side by side", "none / quad"];
    //, "360_YOUTUBE_VIDEO", "360_YOUTUBE_VIDEO_STEREO", "UNIMPLEMENTED:_360_VIDEO_STEREO", "UNIMPLEMENTED:_360_IMAGE_STEREO"
  // This is the data structure in order. 0,1,2,3,4
  // this serves as the lexicon for the data structure
  nodeType: string[] = ["Class", "Lesson Module", "Content Cluster", "Content", "Content Data"]

  constructor(public modalService: NgbModal, public fs: FirestoreService, public uploadService:UploadService) {
    
  }

  confirmDialogEvent = new EventEmitter<Dialogue>();
  creatorDialogEvent = new EventEmitter<CreatorDialog>();
  editDialogEvent = new EventEmitter<EditDialog>();
  editorDialogRef: NgbModalRef;

  async ShowConfirmationDialog(element: any, nodeTypeIndex: number, callback: any) {

    const dialogRef = this.modalService.open(ValidationDialogComponent, { centered: true });
    // console.log(element);
    dialogRef.componentInstance.element = element;
    dialogRef.componentInstance.nodeType = this.nodeType[nodeTypeIndex];
    dialogRef.componentInstance.id = element.id;

    // this.modalService.open
    this.confirmDialogEvent.subscribe(async event => {
      console.log("User confirmed: ", event.result);
      if (event.result) {
        if (dialogRef.componentInstance != undefined)
          dialogRef.componentInstance.loading = true;
        console.log("User clicked confirm");
        await callback();
      }
      dialogRef.close();
      this.confirmDialogEvent = new EventEmitter<Dialogue>();
    });
  }

  ShowEditorDialog(nodeTypeIndex: number, baseClass: Classroom, elementToChange: any, lmIndex: number | null = null, ccIndex: number | null = null, cIndex: number | null = null) {
    let elementClass: Classroom = baseClass;
    console.log("Opened editor");
    this.editorDialogRef = this.modalService.open(GenericEditorModalComponent, { centered: true });

    this.editorDialogRef.componentInstance.nodeType = this.nodeType[nodeTypeIndex];
    this.editorDialogRef.componentInstance.inputElement = elementToChange;
    this.editorDialogRef.componentInstance.initialize();
    console.log("nodeType:", nodeTypeIndex);

    this.editDialogEvent.subscribe(event => {
      console.log("User confirmed: ", event.confirmed);
      if (event.confirmed == true) {
        if (this.editorDialogRef.componentInstance != undefined) {
          this.editorDialogRef.componentInstance.loading = true;
        }

        switch (nodeTypeIndex) {
          case 0: // class
            console.log("Changed class:", elementClass.title, "to", event.changedElement.title)
            elementClass.title = event.changedElement.title;
            elementClass.description = event.changedElement.description;
            elementClass.tags = event.changedElement.tags;
            break;
          case 1: // lesson module
            if (lmIndex == null) console.error("Error: lmIndex was null, but the edited type was lesson module.");
            else {
              if (elementClass.lessonModules == null) console.error("Error: lesson module list was null, but edit type was lesson module.");
              else {
                console.log("Changed lesson module:", elementClass.lessonModules[lmIndex].title, "to", event.changedElement.title)
                elementClass.lessonModules[lmIndex].title = event.changedElement.title;
                elementClass.lessonModules[lmIndex].description = event.changedElement.description;
                elementClass.lessonModules[lmIndex].tags = event.changedElement.tags;
              }
            }
            break;
          case 2: // content cluster
            if (lmIndex == null) console.error("Error: lmIndex was null, content cluster unreachable.");
            else if (elementClass.lessonModules == null) console.error("Error: lesson module list was null, content cluster unreachable.");
            else if (elementClass.lessonModules[lmIndex] == null) console.error("Error: lesson module was null, content cluster unreachable.");
            else if (ccIndex == null) console.error("Error: ccIndex was null, but edited type was content cluster.");
            else if (elementClass.lessonModules[lmIndex].contentClusters == null) console.error("Error: content cluster list is null, content cluster unreachable.");
            else {
              let ccList = elementClass.lessonModules[lmIndex].contentClusters;
              if (ccList != null)
                if (ccList[ccIndex] == null) console.error("Error: content cluster is null, content cluster unreachable.");
                else {

                  console.log("Changed content cluster:", ccList[ccIndex].title, "to", event.changedElement.title)
                  ccList[ccIndex].title = event.changedElement.title;
                  ccList[ccIndex].description = event.changedElement.description;
                  ccList[ccIndex].tags = event.changedElement.tags;

                  let lm = elementClass.lessonModules[lmIndex];
                  lm.contentClusters = ccList;
                  elementClass.lessonModules[lmIndex] = lm;
                }
            }
            break;
          case 3: // content
            // TODO: Don't forget to account for uploaded files that need to be removed
            if (lmIndex == null) console.error("Error: lmIndex was null, content cluster unreachable.");
            else if (elementClass.lessonModules == null) console.error("Error: lesson module list was null, content cluster unreachable.");
            else if (elementClass.lessonModules[lmIndex] == null) console.error("Error: lesson module was null, content cluster unreachable.");
            else if (ccIndex == null) console.error("Error: ccIndex was null, but edited type was content cluster.");
            else if (elementClass.lessonModules[lmIndex].contentClusters == null) console.error("Error: content cluster list is null, content cluster unreachable.");
            else {
              let ccList = elementClass.lessonModules[lmIndex].contentClusters;
              if (ccList != null)
                if (ccList[ccIndex] == null) console.error("Error: content cluster is null, content cluster unreachable.");
                else if (cIndex == null) console.error("Error: cIndex was null, content unreachable.");
                else if (ccList[ccIndex].content == null) console.error("Error: Content list was null, content unreachable");
                else {
                  let contentList = ccList[ccIndex].content;
                  if (contentList != null)
                    if (contentList[cIndex] == null) console.error("Error: Content list was null, content unreachable");
                    else {

                      console.log("Changed content:", contentList[cIndex].title, "to", event.changedElement.title)
                      contentList[cIndex].title = event.changedElement.title;
                      contentList[cIndex].description = event.changedElement.description;
                      contentList[cIndex].tags = event.changedElement.tags;
                      contentList[cIndex].contentType = event.changedElement.contentType;
                      contentList[cIndex].contentFormatType = event.changedElement.contentFormatType;
                      contentList[cIndex].isStereoscopic = event.changedElement.isStereoscopic;
                      // contentList[cIndex]. = event.changedElement.isStereoscopic;
                      

                      let lm = elementClass.lessonModules[lmIndex];
                      ccList[ccIndex].content = contentList;
                      lm.contentClusters = ccList;
                      elementClass.lessonModules[lmIndex] = lm;
                    }
                }
            }
            break;
        }


        // switch (nodeTypeIndex) {
        //   case 0: // class
        //     console.log("Class change:", elementToChange.title);
        //     this.editorDialogRef.close();
        //     break;
        //   case 1: // lesson module
        //     console.log("Lesson Module change:", elementToChange.title);
        //     this.editorDialogRef.close();
        //     break;
        //   case 2: // content cluster
        //     console.log("Content Cluster change:", elementToChange.title);
        //     this.editorDialogRef.close();
        //     break;
        //   case 3: // content
        //     // TODO: Don't forget to account for uploaded files that need to be removed
        //     console.log("Content change:", elementToChange.title);
        //     this.editorDialogRef.close();
        //     break;
        // }


        this.editorDialogRef.close();
        // TODO: Update to id based.
        // this.fs.updateClass(elementClass);
        console.log("updated class.");


      }
      this.editorDialogRef.close();
      this.editDialogEvent = new EventEmitter<EditDialog>();
    });
  }

  async ShowCreatorDialog(nodeTypeIndex: number, fieldID: string | null = null, lmIndex: number = 0, ccIndex: number = 0) {
    // if(dialogRef.componentInstance != null)
    const dialogRef = this.modalService.open(GenericCreatorModalComponent, { centered: true });

    dialogRef.componentInstance.nodeType = this.nodeType[nodeTypeIndex];

    if (fieldID != null)
      dialogRef.componentInstance.elementclass = this.fs.getClass(fieldID);

    this.creatorDialogEvent.subscribe(async event => {
      console.log("User confirmed: ", event.confirmed);
      if (event.confirmed == true) {
        if (dialogRef.componentInstance) {
          dialogRef.componentInstance.loading = true;
        }
        switch (nodeTypeIndex) {
          case 0:
            await this.fs.CreateClass(event);
            dialogRef.close();
            break;
          case 1:
            await this.fs.CreateLessonModuleInClass(fieldID, event);
            dialogRef.close();
            break;
          case 2:
            await this.fs.CreateContentClusterInClass(fieldID, lmIndex, event);
            dialogRef.close();
            break;
          case 3:
            await this.fs.CreateContentInClass(fieldID, lmIndex, ccIndex, event);
            dialogRef.close();
            break;
        }
      }
      dialogRef.close();
      this.creatorDialogEvent = new EventEmitter<CreatorDialog>();
    });
  }


  // async DeleteClass(element: element_class) {
  //   if (element == null) { console.log("element was null"); return; }
  //   if (element.title == null) { console.log("element title was null"); return; }
  //   console.log("Trying to delete", element.title.trim());

  //   if (element.id == null) { console.log("Could not delete class", element.title, "because it does not have an id."); return; }
  //   this.ShowConfirmationDialog(element, 0, () => this.fs.deleteClass(element.id));
  // }

  async DeleteLessonModule(c: Classroom, lmIndex: number, element: ClassroomSubject) {
    if (!element) { console.log("element was null"); return; }
    if (!element.title) { console.log("element title was null"); return; }
    if (!c.id) { console.log("Could not delete lesson module", element.title, "because its class,", c.title, "does not have an id."); return; }
    console.log("Trying to delete", element.title.trim());

    this.ShowConfirmationDialog(element, 1, () => this.fs.deleteLessonModule(c.id, c, lmIndex));
  }

  async DeleteContentCluster(c: Classroom, lmIndex: number, ccIndex: number, element: ClassroomLesson) {
    if (element == null) { console.log("element was null"); return; }
    if (element.title == null) { console.log("element title was null"); return; }
    console.log("Trying to delete", element.title.trim());

    if (c.id == null) { console.log("Could not delete content cluster", element.title, "because its class,", c.title, "does not have an id."); return; }
    this.ShowConfirmationDialog(element, 2, () => this.fs.deleteContentCluster(c.id, c, lmIndex, ccIndex));
  }

  async DeleteContent(c: Classroom, lmIndex: number, ccIndex: number, cIndex: number, element: LessonContent) {
    if (element == null) { console.log("element was null"); return; }
    if (element.title == null) { console.log("element title was null"); return; }
    console.log("Trying to delete", element.title.trim());
    
    const fileRef = ref(this.uploadService.storage_uploads);
    

    if (c.id == null) { console.log("Could not delete content", element.title, "because its class,", c.title, "does not have an id."); return; }
    this.ShowConfirmationDialog(element, 3, () => this.fs.deleteContent(c.id, c, lmIndex, ccIndex, cIndex));
  }

  // async CreateClass() {
  //   this.ShowCreatorDialog(0);
  // }

  async CreateLessonModule(fieldID: string | null) {
    this.ShowCreatorDialog(1, fieldID);
  }

  async CreateContentCluster(fieldID: string | null, lmIndex: number) {
    this.ShowCreatorDialog(2, fieldID, lmIndex);

  }

  async CreateContent(fieldID: string | null, lmIndex: number, ccIndex: number) // use optionalArgs for url
  {
    this.ShowCreatorDialog(3, fieldID, lmIndex, ccIndex);
  }




}

