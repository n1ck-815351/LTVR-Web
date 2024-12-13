import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../navigationService/navigation.service';
import { ClassroomService } from '../classroomService/classroom.service';
import { SubjectService } from '../subjectService/subject.service';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { LessonService } from '../lessonService/lesson.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { UploadQueueService } from 'app/services/uploads/upload-queue.service';
import { MapService } from 'app/services/mapService/map.service';
import { Map } from 'app/models/Interfaces/maps/Map';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(public uploadQueue: UploadQueueService,
    public classService: ClassroomService,
    public subjectService: SubjectService,
    public lessonService: LessonService,
    private fs: FirestoreService,
    private firestore: AngularFirestore,
    public modalService: NgbModal,
    public navigation: NavigationService,
    public mapService: MapService,
    private global: GlobalService) {
    // navigation.lsSelectedLessonId = this.lsSelectedLessonId;
    // navigation.lsSelectedLesson = this.lsSelectedLesson;
  }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Content`;
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  // Local storage constants
  // public lsSelectedLesson = "selectedLesson";
  // public lsSelectedLessonId = "selectedLessonId";

  public collection: LessonContent[];
  public selected: LessonContent;

  public getContentTypeById(id: number) {
    switch (id) {
      case 0: {
        return 'Image';
      }
      case 2: {
        return 'Video';
      }
      case 7: {
        return 'YouTube Video';
      }
      default: {
        return 'Unknown';
      }
    }
  }

  setSelected(element: LessonContent) {
    if (element && element.id) {
      this.global.selectedContent = element.id;
    }
  }

  getSelected() {
    const id = this.global.selectedContent;
    if (id) {
      this.selectById(id, () => { });
    }
  }

  ShowCreateDialog() {
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 3; // set nodeType to content
    let element: LessonContent = {
      contentType: 0, contentFormatType: 0, uploadMethod: 0,
      title: "", description: "",
      getURL: "", dateCreated: new Date().toString(),
      creatorName: "creatorName placeholder",
      isStereoscopic: false,
      lessonId: this.lessonService.selected.id
    } as LessonContent;

    modalRef.componentInstance.setData(element);
    modalRef.result.then(async (output: any) => {
      if (output) {
        let element = output.data;

        if (output.method == 0) {
          let file = output.file;
          file.contentData = element;
          file.contentData.lessonId = this.lessonService.selected.id;
          file.lessonId = this.lessonService.selected.id;
          file.DbCollection = this.DbCollection;
          this.uploadQueue.Enqueue(file);
        }
        else {
          this.create(element);
        }
      }
    })
  }

  ShowEditDialog(element: LessonContent) {
    if (element) {
      const refEl = Object.assign({}, element);
      const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
      modalRef.componentInstance.modalType = 'Update';
      modalRef.componentInstance.nodeType = 3; // set nodeType to content
      console.log("id", element.id, "data", element);
      modalRef.componentInstance.setData(element);
      modalRef.result.then(
        async (data: any) => {
          if (data && data.title) {
            console.log("id", data.id, "data", data);
            await this.editHelper.editContentById(data.id, data);
          } else element = refEl;
        }
      )
    }
  }

  async ShowDeleteDialog(element: LessonContent) {
    if (element && element.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
      modalRef.componentInstance.id = element.id;
      modalRef.componentInstance.title = element.title;
      modalRef.result.then(async (id: any) => {
        if (id) {
          await this.deleteHelper.deleteContentById(id); //this.delete(id);
        }
      })
    }
  }

  async create(input: any) {
    let c: LessonContent = {
      ...input,
      lessonId: input.lessonId ?? this.lessonService.selected.id
    } as LessonContent;
    this.fs.firestore.collection(this.DbCollection).add(c).then(function (docRef) {
      c.id = docRef.id;
    });
    return c;
  }

  async delete(id: string | null) {
    if (!id) {
      console.log("Cannot delete class: id was null."); return;
    }
    await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }
  async update(element: LessonContent) {
    if (element && element.id) {
      await this.fs.firestore.collection(this.DbCollection).doc(element.id).update(element);
    }
  }

  public async getCollectionByLessonId(lessonId: string) {
    let q = query(this.fsRef,
      where('lessonId', '==', lessonId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      this.collection = [];
    } else {
      this.collection = querySnapshot.docs.map(s => {
        const _class = JSON.parse(JSON.stringify(s.data())) as LessonContent;
        _class.id = s.id;
        return _class;
      })
    }
    return this.collection;
  }

  async getCollection(indexMap: Map[] = [], callback: Function = Function()) {
    this.fs.firestore.collection(this.DbCollection, ref => ref.where("lessonId", "==", this.lessonService.selected.id).orderBy('title')).snapshotChanges()
      .pipe(
        map(
          changes =>
            changes.map(c => ({
              id: c.payload.doc.id, ...c.payload.doc.data() as {}
            })))
      ).subscribe(data => {
        this.collection = data as LessonContent[];
        this.collection = this.mapService.getSortedList(this.collection, indexMap)
        if (this.collection) {
          callback();
        }
        return this.collection;
      });
  }

  async selectById(id: string, callback: any) {
    const docRef = this.fs.firestore.collection<LessonContent>(this.DbCollection);
    let cDoc: LessonContent | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const element: LessonContent = doc.data() as LessonContent;
      element.id = doc.id;
      cDoc = element;
    });
    if (cDoc) {
      this.selected = cDoc;
    }
  }
  async getById(id: string) {
    const docRef = this.fs.firestore.collection<LessonContent>(this.DbCollection);

    return await docRef.doc(id).ref.get().then(async function (doc) {
      const element: LessonContent = doc.data() as LessonContent;
      element.id = doc.id;
      return element;
    });

  }
}
