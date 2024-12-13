import { Injectable } from '@angular/core';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { map } from 'rxjs';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../navigationService/navigation.service';
import { ClassroomService } from '../classroomService/classroom.service';
import { SubjectService } from '../subjectService/subject.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(public classService: ClassroomService, 
    public subjectService: SubjectService, 
    private fs: FirestoreService, 
    private firestore: AngularFirestore,
    public modalService: NgbModal, 
    public navigation: NavigationService, 
    private global: GlobalService) { }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Lessons`;
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  // Local storage constants
  // public lsSelectedLesson = "selectedLesson";
  // public lsSelectedLessonId = "selectedLessonId";

  public collection: ClassroomLesson[] | null;
  public selected: ClassroomLesson;

  setSelected(element: ClassroomLesson) {
    if (element && element.id) {
      this.global.selectedLesson = element.id;
      //// localStorage.setItem(this.navigation.lsSelectedLessonId, element.id);
    }
  }

  getSelected() {
    const id = this.global.selectedLesson; //// localStorage.getItem(this.navigation.lsSelectedLessonId);
    if (id) {
      this.getById(id, () => { });
    }
  }

  ShowCreateDialog() {
    // console.log("test");
    // if(this.subjectService.selected)
    // console.log(this.subjectService.selected.id);
    // else console.log("undefined")
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 2; // set nodeType to lesson
    modalRef.result.then(async (data: any) => {
      if (data && data.title) {
        await this.create(data);
      }
    })
  }

  ShowEditDialog(element: ClassroomLesson) {
    if (element) {
      const refEl = Object.assign({}, element);
      const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
      modalRef.componentInstance.setData(element);
      modalRef.componentInstance.modalType = 'Update';
      modalRef.componentInstance.nodeType = 2; // set nodeType to lesson
      modalRef.result.then(
        async (data: any) => {
          if (data && data.title) {
            // await this.update(data);
            await this.editHelper.editLessonById(data.id, data);
          } else element = refEl;
        }
      )
    }
  }

  async ShowDeleteDialog(element: ClassroomLesson) {
    if (element && element.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
      modalRef.componentInstance.id = element.id;
      modalRef.componentInstance.title = element.title;
      modalRef.result.then(async (id: any) => {
        if (id) {
          await this.deleteHelper.deleteLessonById(id);
        }
      })
    }
  }

  async create(input: any, subjectId: string | null = null) {
    const l: ClassroomLesson = {
      title: input.title,
      description: input.description,
      subjectId: input.subjectId ?? this.subjectService.selected.id
    } as ClassroomLesson;
    await this.fs.firestore.collection(this.DbCollection).add(l).then(function (docRef) {
      l.id = docRef.id;
    });
    return l;
  }

  async delete(id: string | null) {
    if (!id) {
      console.log("Cannot delete class: id was null."); return;
    }
    await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }
  async update(element: ClassroomLesson) {
    if (element && element.id) {
      console.log(`UPDATING LESSON: ${element.title} / ${element.id}`)
      await this.fs.firestore.collection(this.DbCollection).doc(element.id).update(element);
      console.log(`LESSON UPDATED: ${element.title} / ${element.id}`)
    }
  }

  public async getCollectionBySubjectId(subjectId: string) {
    let q = query(this.fsRef,
      where('subjectId', '==', subjectId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      this.collection = null;
    } else {
      this.collection = querySnapshot.docs.map(s => {
        const _class = JSON.parse(JSON.stringify(s.data())) as ClassroomLesson;
        _class.id = s.id;
        return _class;
      })
    }
    return this.collection;
  }

  async getCollection() {
    // console.log(this.DbCollection, "/ classId", this.classService.selectedClass.id, ": subjectId", this.subjectService.selected.id, "/");
    this.fs.firestore.collection(this.DbCollection, ref => ref.where("subjectId", "==", this.subjectService.selected.id).orderBy('title')).snapshotChanges()
      .pipe(
        map(
          changes =>
            changes.map(c => ({
              id: c.payload.doc.id, ...c.payload.doc.data() as {}
            })))
      ).subscribe(data => {
        // console.log("data", data);
        this.collection = data as ClassroomLesson[];

        return this.collection;
      });
  }

  async getById(id: string, callback: any) {
    const docRef = this.fs.firestore.collection<ClassroomLesson>(this.DbCollection);
    let cDoc: ClassroomLesson | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const element: ClassroomLesson = doc.data() as ClassroomLesson;
      element.id = doc.id;
      cDoc = element;
    });
    if (cDoc)
      this.selected = cDoc;


  }
}
