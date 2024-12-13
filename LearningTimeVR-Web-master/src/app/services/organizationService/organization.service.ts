import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../navigationService/navigation.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { Organization } from 'app/models/Interfaces/Organization';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  confirmDialogEvent: any;
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(private nav: NavigationService, private fs: FirestoreService, public modalService: NgbModal, private global: GlobalService) {
    // nav.lsSelectedClassId = this.lsSelectedClassId;
    // nav.lsSelectedClass = this.lsSelectedClass;
    this.w();
  }

  async w() {
    await this.getCollection();
    // this.getFromLocalStorage();
  }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Organizations`;

  // Local storage constants
  // public lsSelectedClass = "selectedClass";
  // public lsSelectedClassId = "selectedClassId";

  public collection: Organization[];
  public selectedClass: Organization;

  setSelected(element: Organization) {
    if (element && element.id) {
      console.log("Saving class:", element.id);
      this.global.selectedClass = element.id;
      //// localStorage.setItem(this.nav.lsSelectedClassId, element.id);
    }
  }

  async getSelected() {
    const id = this.global.selectedClass;
    console.log(id);
    if (id) {
      console.log("Getting by id", id);
      this.selectById(id);
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

  ShowEditDialog(element: Organization) {
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

  async ShowDeleteDialog(element: Organization) {
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
    const c: Organization = {
      title: input.title,
      description: input.description,
      ...input
    } as Organization;
    return await this.fs.firestore.collection(this.DbCollection).add(c)
  }

  public async DeleteElement(id: string | null) {
    // if (!id) {
    //   console.log("Cannot delete class: id was null."); return;
    // }
    // await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }

  async getCollection() {
    return this.fs.firestore.collection(this.DbCollection, ref => ref.orderBy('title')).snapshotChanges()
      .pipe(
        map(
          changes =>
            changes.map(c => ({
              id: c.payload.doc.id, ...c.payload.doc.data() as {}
            })))
      ).subscribe(data => {
        this.collection = data as Organization[];

        return this.collection;
      });
  }
  getCollectionObservable(serialNumber:string) {
    return this.fs.firestore.collection<Organization>(this.DbCollection, ref => ref.where("devices", "array-contains", serialNumber)).get();
  }
  async selectById(id: string) {

    const docRef = this.fs.firestore.collection<Organization>(this.DbCollection);
    let cDoc: Organization | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: Organization = doc.data() as Organization;
      _class.id = doc.id;
      cDoc = _class;
    });
    if (cDoc)
      this.selectedClass = cDoc;

  }
  async getById(id: string|null|undefined) {
    if(!id) return null;
    const docRef = this.fs.firestore.collection<Organization>(this.DbCollection);
    

    return await docRef.doc(id).ref.get().then(async function (doc) {
      const org: Organization = doc.data() as Organization;
      org.id = doc.id;
      return org;
    });

  }

  async updateElement(_c: Organization) {
    if (_c && _c.id) {
      console.log(`UPDATING ORG: ${_c.title} / ${_c.id}`)
      await this.fs.firestore.collection(this.DbCollection).doc(_c.id).update(_c);
      console.log(`ORG UPDATED: ${_c.title} / ${_c.id}`)
    }
  }
}
