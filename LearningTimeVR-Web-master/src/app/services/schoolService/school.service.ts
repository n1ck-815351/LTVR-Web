import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../navigationService/navigation.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { School } from 'app/models/Interfaces/School';
import { collection, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  confirmDialogEvent: any;
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(private nav: NavigationService, private fs: FirestoreService, public modalService: NgbModal, private global: GlobalService) {
    this.w();
  }

  async w() {
    await this.getCollection();
  }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Schools`;


  public collection: School[];
  public selectedClass: School;

  setSelected(element: School) {
    if (element && element.id) {
      console.log("Saving class:", element.id);
      this.global.selectedSchool = element.id;
      //// localStorage.setItem(this.nav.lsSelectedClassId, element.id);
    }
  }

  async getSelected() {
    const id = this.global.selectedSchool; ////localStorage.getItem(this.nav.lsSelectedClassId);
    console.log(id);
    if (id) {
      console.log("Getting by id", id);
      this.getById(id);
    }
  }

  ShowCreateDialog() {
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 0; // set nodeType to class
    modalRef.result.then(async (data: any) => {
      if (data && data.title) {
        await this.CreateElement(data);
      }
    })
  }

  ShowEditDialog(element: School) {
    if (element) {
      const refEl = Object.assign({}, element);
      const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
      modalRef.componentInstance.setData(element);
      modalRef.componentInstance.modalType = 'Update';
      modalRef.componentInstance.nodeType = 0; // set nodeType to class
      modalRef.result.then(
        async (data: any) => {
          if (data && data.title) {
            // await this.update(data);
            await this.editHelper.editClassById(data.id, data);
          } else element = refEl;
        }
      )
    }
  }

  async ShowDeleteDialog(element: School) {
    if (element && element.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
      modalRef.componentInstance.id = element.id;
      modalRef.componentInstance.title = element.title;
      modalRef.result.then(async (id: any) => {
        if (id) {
          console.log(this.deleteHelper);
          await this.deleteHelper.deleteClass(element.id);
        }
      })
    }
  }

  async CreateElement(input: any) {
    const c: School = {
      title: input.title,
      description: input.description,
      ...input
    } as School;
    return await this.fs.firestore.collection(this.DbCollection).add(c)
  }

  public async DeleteElement(id: string | null) {
    // if (!id) {
    //   console.log("Cannot delete class: id was null."); return;
    // }
    // await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }

  async getCollection() {
    this.fs.firestore.collection(this.DbCollection, ref => ref.orderBy('title')).snapshotChanges()
      .pipe(
        map(
          changes =>
            changes.map(c => ({
              id: c.payload.doc.id, ...c.payload.doc.data() as {}
            })))
      ).subscribe(data => {
        this.collection = data as School[];

        return this.collection;
      });
  }
  fsRef = collection(this.fs.firestore.firestore, this.DbCollection);
  public async getCollectionInOrg(id: string) {


    let q = query(this.fsRef,
      where('organizationId', '==', id),
      // orderBy("expirationDate"),
    );


    let schoolCollection: School[] = [];
    const querySnapshot = (await getDocs(q));
    if (!querySnapshot.empty) {
      schoolCollection = querySnapshot.docs.map(s => {
        return { id: s.id, ...s.data() } as School;
      });
      console.log("schools:", schoolCollection);
      return schoolCollection;
    }
    else { console.log("school query was empty"); return null; }
  }

  async getById(id: string) {

    const docRef = this.fs.firestore.collection<School>(this.DbCollection);
    let cDoc: School | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: School = doc.data() as School;
      _class.id = doc.id;
      cDoc = _class;
    });
    if (cDoc)
      this.selectedClass = cDoc;

  }

  async updateElement(_c: School) {
    if (_c && _c.id) {
      console.log(`UPDATING CLASS: ${_c.title} / ${_c.id}`)
      await this.fs.firestore.collection(this.DbCollection).doc(_c.id).update(_c);
      console.log(`CLASS UPDATED: ${_c.title} / ${_c.id}`)
    }
  }
}
