import { EventEmitter, Injectable } from '@angular/core';
import { DeleteHelperService } from './delete-helper.service';
import { EditHelperService } from './edit-helper.service';
import { NavigationService } from '../navigationService/navigation.service';
import { FirestoreService } from './firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { map } from 'rxjs';
import { DeviceCSVObject } from 'app/pages/account/admin/components/device-manager/device-manager.component';
import { MoveDeviceEvent } from 'app/pages/account/admin/components/device-manager/modals/ascent-device-move-modal/ascent-device-move-modal.component';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  confirmDialogEvent: any;
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  constructor(
    private fs: FirestoreService, 
    public modalService: NgbModal, 
    private global: GlobalService) {
    this.w();
  }

  async w() {
    await this.getCollection();
    // this.getFromLocalStorage();
  }

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Devices`;

  // Local storage constants
  // public lsSelectedClass = "selectedClass";
  // public lsSelectedClassId = "selectedClassId";

  public collection: DeviceCSVObject[];
  ShowCreateDialog() {
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 0; // set nodeType to class
    modalRef.result.then(async (data: any) => {
      if (data && data.title) {
        await this.CreateElement(data);
      }
    })
  }
  async ShowDeleteDialog(element: DeviceCSVObject) {
    if (element && element.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
      modalRef.componentInstance.id = element.id;
      modalRef.result.then(async (id: any) => {
        if (id) {
          console.log(this.deleteHelper);
          await this.deleteHelper.deleteClass(element.id);
        }
      })
    }
  }

  async CreateElement(input: any) {
    const c: DeviceCSVObject = {
      ...input
    } as DeviceCSVObject;
    return this.fs.firestore.collection<DeviceCSVObject>(this.DbCollection).add(c)
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
        this.collection = data as DeviceCSVObject[];

        return this.collection;
      });
  }
  async getDocRefById(id:string){
    const docRef = this.fs.firestore.collection<DeviceCSVObject>(this.DbCollection).doc(id);
    return docRef;
  }
  async getById(id: string | null | undefined) {
    if (!id) return null;
    const docRef = this.fs.firestore.collection<DeviceCSVObject>(this.DbCollection);


    return await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: DeviceCSVObject = doc.data() as DeviceCSVObject;
      _class.id = doc.id;
      return _class;
    });
  }

  async updateElement(_c: DeviceCSVObject) {
    if (_c && _c.id) {
      console.log(`UPDATING DEVICE: ${_c.SerialNumber} / ${_c.id}`)
      await this.fs.firestore.collection(this.DbCollection).doc(_c.id).update(_c);
      console.log(`DEVICE UPDATED: ${_c.SerialNumber} / ${_c.id}`)
    }
  }
  getSerialNumberById(id: string) {
    return this.fs.firestore.collection<DeviceCSVObject>(this.DbCollection).doc(id).get();
  }
  getSerialNumbersInOrganizationCollection(orgId: string) {
    return this.fs.firestore.collection<DeviceCSVObject>(this.DbCollection, ref => ref.where("organizationId", "==", orgId)).get();
  }
  getMatchingSerialNumberCollection(serialNumber:string) {
    return this.fs.firestore.collection<DeviceCSVObject>(this.DbCollection, ref => ref.where("SerialNumber", "==", serialNumber)).get();

  }
  
  moveDeviceEvent = new EventEmitter<MoveDeviceEvent>();

  // getFuckupCollection(col: string) {
  //   return this.fs.firestore.collection<DeviceCSVObject>(col, ref => ref.where("AndroidVersion", "==", "10")).get();
  //     
  // }
}
