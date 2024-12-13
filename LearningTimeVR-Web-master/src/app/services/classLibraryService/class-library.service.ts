import { Injectable } from '@angular/core';
import { ClassroomLibrary } from 'app/models/Interfaces/ClassroomLibrary';
import { map } from 'rxjs';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../navigationService/navigation.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class ClassLibraryService {
  confirmDialogEvent: any;
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(
    private nav: NavigationService, 
    private fs: FirestoreService, 
    public modalService: NgbModal, 
    private global: GlobalService) {
    this.w();
  }

  async w() {
    await this.getClassLibraryCollection();
    // this.getFromLocalStorage();
  }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/ClassLibraries`;

  // Local storage constants
  // public lsSelectedClass = "selectedClass";
  // public lsSelectedClassId = "selectedClassId";

  public collection: ClassroomLibrary[];
  public selected: ClassroomLibrary;

  setSelected(element: ClassroomLibrary) {
    if (element && element.id) {
      this.global.selectedClassLibrary = element.id;
      ////localStorage.setItem(this.nav.lsSelectedClassId, element.id);
    }
  }

  async getSelected() {
    const id = this.global.selectedClassLibrary;
    console.log(id);
    if (id) {
      console.log("Getting by id", id);
      this.getClassLibraryById(id);
    }
  }

  ShowCreateDialog() {
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 0; // set nodeType to class
    modalRef.result.then(async (data: any) => {
      if (data && data.title) {
        await this.Create(data);
      }
    })
  }

  ShowEditDialog(element: ClassroomLibrary) {
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

  async ShowDeleteDialog(element: ClassroomLibrary) {
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

  async Create(input: any) {
    const c: ClassroomLibrary = {
      title: input.title,
      description: input.description
    } as ClassroomLibrary;
    this.fs.firestore.collection(this.DbCollection).add(c)
  }

  public async deleteClass(id: string | null) {
    // if (!id) {
    //   console.log("Cannot delete class: id was null."); return;
    // }
    // await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }

  async getClassLibraryCollection() {
    this.fs.firestore.collection(this.DbCollection, ref => ref.orderBy('title')).snapshotChanges()
      .pipe(
        map(
          changes =>
            changes.map(c => ({
              id: c.payload.doc.id, ...c.payload.doc.data() as {}
            })))
      ).subscribe(data => {
        this.collection = data as ClassroomLibrary[];

        return this.collection;
      });
  }

  async getClassLibraryById(id: string) {

    const docRef = this.fs.firestore.collection(this.DbCollection);
    let cDoc: ClassroomLibrary | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: ClassroomLibrary = doc.data() as ClassroomLibrary;
      _class.id = doc.id;
      cDoc = _class;
    });
    if (cDoc)
      this.selected = cDoc;

  }

  async updateClassLibrary(_c: ClassroomLibrary) {
    if (_c && _c.id) {
      console.log(`UPDATING CLASS: ${_c.title} / ${_c.id}`)
      await this.fs.firestore.collection(this.DbCollection).doc(_c.id).update(_c);
      console.log(`CLASS UPDATED: ${_c.title} / ${_c.id}`)
    }
  }
}
