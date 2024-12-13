import { Injectable } from '@angular/core';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { map } from 'rxjs';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../navigationService/navigation.service';
import { ClassroomService } from '../classroomService/classroom.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { Map } from 'app/models/Interfaces/maps/Map';
import { MapService } from 'app/services/mapService/map.service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(
    public classService: ClassroomService, 
    private fs: FirestoreService, 
    public modalService: NgbModal, 
    private firestore: AngularFirestore,
    public navigation: NavigationService, 
    public mapService: MapService, 
    private global: GlobalService) { }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Subjects`;
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  // Local storage constants
  // public lsSelectedSubject = "selectedSubject";
  // public lsSelectedSubjectId = "selectedSubjectId";

  public subjectsCollection: ClassroomSubject[];
  public selected: ClassroomSubject;

  setSelected(element: ClassroomSubject) {
    if (element && element.id) {
      this.global.selectedSubject = element.id;
      //// localStorage.setItem(this.navigation.lsSelectedSubjectId, element.id);
    }
  }

  public reset() {
    this.subjectsCollection = [];
    this.selected = undefined!;
  }

  getSelected() {
    const id = this.global.selectedSubject; ////localStorage.getItem(this.navigation.lsSelectedSubjectId);
    if (id) {
      this.getSubjectById(id);
    }
  }

  ShowCreateDialog() {
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 1; // set nodeType to subject
    modalRef.result.then(async (data: any) => {
      if (data && data.title) {
        await this.createSubject(data);
      }
    })
  }

  ShowEditDialog(element: ClassroomSubject) {
    if (element) {
      const refEl = Object.assign({}, element);
      const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
      modalRef.componentInstance.setData(element);
      modalRef.componentInstance.modalType = 'Update';
      modalRef.componentInstance.nodeType = 1; // set nodeType to subject
      modalRef.result.then(
        async (data: any) => {
          if (data && data.title) {
            // await this.update(data);
            await this.editHelper.editSubjectById(data.id, data);
          } else element = refEl;
        }
      )
    }
  }

  async ShowDeleteDialog(element: ClassroomSubject) {
    if (element && element.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
      modalRef.componentInstance.id = element.id;
      modalRef.componentInstance.title = element.title;
      modalRef.result.then(async (id: any) => {
        if (id) {
          await this.deleteHelper.deleteSubjectById(id);
        }
      })
    }
  }

  async createSubject(input: any) {
    const s: ClassroomSubject = {
      title: input.title,
      description: input.description,
      classId: this.classService.selected.id
    } as ClassroomSubject;
    await this.fs.firestore.collection(this.DbCollection).add(s).then(function (docRef) {
      s.id = docRef.id;
    })
    return s;
  }

  async deleteSubject(id: string | null) {
    if (!id) {
      console.log("Cannot delete class: id was null."); return;
    }
    await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }
  async updateSubject(element: ClassroomSubject) {
    if (element && element.id) {
      console.log(`UPDATING SUBJECT: ${element.title} / ${element.id}`)
      await this.fs.firestore.collection(this.DbCollection).doc(element.id).update(element);
      console.log(`SUBJECT UPDATED: ${element.title} / ${element.id}`)
    }
  }

  public async getCollectionByClassId(classId: string) {
    let q = query(this.fsRef,
      where('classId', '==', classId)
    );

    const querySnapshot = (await getDocs(q));
    if (querySnapshot.empty) {
      this.subjectsCollection = [];
    } else {
      this.subjectsCollection = querySnapshot.docs.map(s => {
        const _class = JSON.parse(JSON.stringify(s.data())) as ClassroomSubject;
        _class.id = s.id;
        return _class;
      })
    }
    return this.subjectsCollection;
  }

  async getCollection(indexMap: Map[] = []) {
    // console.log(this.DbCollection, "/", this.classService.selectedClass.id);
    this.fs.firestore.collection(this.DbCollection, ref => ref.where("classId", "==", this.classService.selected.id).orderBy('title')).snapshotChanges()
      .pipe(
        map(
          changes =>
            changes.map(c => ({
              id: c.payload.doc.id, ...c.payload.doc.data() as {}
            })))
      ).subscribe(data => {
        // console.log("data", data);
        this.subjectsCollection = data as ClassroomSubject[];

        // if (indexMap) {
        //   console.log("SEARCHING")
        //   let subjectOrdered: element_subject[] = [];
        //   indexMap.forEach((element) => {
        //     this.subjectsCollection.forEach((subject) => {
        //       if (subject.id == element.elementId) {
        //         console.log('FOUND ', element.elementId)
        //         subjectOrdered.push(subject);
        //       }
        //     });
        //   })
        //   console.log("SUBJECTS ORDERED START")
        //   console.log(subjectOrdered)
        //   console.log("SUBJECTS ORDERED END")
        //   this.subjectsCollection = subjectOrdered;
        //   console.log(this.subjectsCollection);
        //   console.log("DONE SEARCHING")
        // }
        this.subjectsCollection = this.mapService.getSortedList(this.subjectsCollection, indexMap)
        return this.subjectsCollection;
      });
  }

  async getSubjectById(id: string) {
    const docRef = this.fs.firestore.collection<ClassroomSubject>(this.DbCollection);
    let cDoc: ClassroomSubject | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const element: ClassroomSubject = doc.data() as ClassroomSubject;
      element.id = doc.id;
      cDoc = element;
    });
    if (cDoc)
      this.selected = cDoc;
  }
}
