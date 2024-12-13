import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { DeviceService } from 'app/services/firebase/device.service';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AscentDeviceMoveModalComponent } from './modals/ascent-device-move-modal/ascent-device-move-modal.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalModalsService } from 'app/services/globalService/global-modals.service';


export interface DeviceCSVObject {
  id: string;
  DeviceID: string;
  Name: string;
  DeviceGroup: string;
  SerialNumber: string;
  FirmwareVersion: string;
  AndroidVersion: string;
  CreatedAt: string;
  organizationId: string;
}
export interface DeviceCSV {
  headers: string[];
  devices: DeviceCSVObject[];
}
export function ParseCSV(input: string) {
  const lines = input.split('\n');
  const headerLine = lines[0];
  const headers = headerLine.split(',');
  let deviceCSV: DeviceCSV = { devices: [] as DeviceCSVObject[], headers: [] as string[] } as DeviceCSV;

  for (let j = 0; j < headers.length; j++) {
    console.log(headers[j]);
    const header = headers[j];
    deviceCSV.headers.push(header);
  }

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    const device: DeviceCSVObject = {
      DeviceID: currentLine[0].trim(),
      Name: currentLine[1].trim(),
      DeviceGroup: currentLine[2].trim(),
      SerialNumber: currentLine[3].trim(),
      FirmwareVersion: currentLine[6].trim(),
      AndroidVersion: currentLine[7].trim(),
      CreatedAt: currentLine[13].trim(),
      organizationId: '', // Will be populated later
    } as DeviceCSVObject;
    deviceCSV.devices.push(device);

  }
  return deviceCSV;
}

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent {
  loading: boolean = false;
  showResults: boolean = false;
  warning: boolean = false;
  fail: boolean = false;
  results: string;
  selectedOrgId: string;
  constructor(private modals: GlobalModalsService, private db: AngularFirestore, private modalService: NgbModal, public orgService: OrganizationService, private deviceService: DeviceService, private deleteHelper: DeleteHelperService, private fs: FirestoreService) {
    orgService.getCollection();
    this.updateOrg(this.form.controls['organizationSelect'].value);
    // this.getDevicesInSelectedOrg();
    // this.deleteMyFuckUp();
  }


  // shhh... this never happened
  //   async deleteMyFuckUp() {
  //     const fuckupCollection = (await firstValueFrom(this.deviceService.getFuckupCollection("master/Development/Organizations"))).docs;
  //     fuckupCollection.forEach(fuck => {
  //       this.deleteDocument("master/Development/Organizations", fuck.id)
  //     })
  // 
  //   }


  public async deleteDocument(collection: string | null, id: string | null) {
    if (id == null) return;
    if (collection == null) return;
    console.log("delete", collection, id);
    return await this.fs.firestore.collection(collection).doc(id).delete().then((result) => {
      return result;
    }).catch(err => { console.error("failed to delete document", err); });
  }


  form: FormGroup = new FormGroup({
    // csvInput: new FormControl(""),
    organizationSelect: new FormControl((this.orgService.collection) ? this.orgService.collection[0].id : ""),
  });
  deviceCSV: DeviceCSV = {} as DeviceCSV;
  //https://firebasestorage.googleapis.com/v0/b/learningtimevr-uploads/o/devices%2FGEO-devices.xlsx%20-%20Worksheet.csv
  async getInfo() {
    // if (!this.form.controls['fileInput'].value) return;

    // const data = this.form.controls['fileInput'].value;
    const data = this.form.controls['csvInput'].value;
    this.deviceCSV = ParseCSV(data); //await firstValueFrom(this.http.get(data, { responseType: 'file' }));
    console.log(this.deviceCSV);
    this.sortDevicesBySerialNumber();
    return this.deviceCSV;
  }

  trackByDeviceSN(index: number, device: DeviceCSVObject) {
    return device.SerialNumber;
  }
  orgChanged(event: any) {
    this.manageDevicesArray = [];
    this.selectedOrgId = event.target.value;
    console.log("on org change", event.target.value);
    this.getDevicesInSelectedOrg();
    this.updateOrg(event.target.value);
  }

  async updateOrg(id: string) {
    if (!this.deviceCSV || !this.deviceCSV.devices) return;
    // let x: number = parseInt(index);
    // console.log("***index****", x);

    if (!this.orgService.collection)
      await this.orgService.getCollection();

    for (let i = 0; i < this.deviceCSV.devices.length; i++) {
      this.deviceCSV.devices[i].organizationId = id;
    }

    this.selectedOrgId = id;
    console.log("selected org id", id);
  }

  sortDevicesBySerialNumber() {
    if (this.deviceCSV && this.deviceCSV.devices) {
      this.deviceCSV.devices.sort((a, b) => {
        return a.SerialNumber.localeCompare(b.SerialNumber);
      });
    }
  }


  ContinueBtn() {
    this.showResults = false;
    this.warning = false;
    this.fail = false;
    this.deviceCSV.devices = [];
  }
  fileChanged(event: any) {
    this.showResults = false;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      if (fileReader.result)
        this.deviceCSV = ParseCSV(fileReader.result! as string)
      this.updateOrg(this.form.controls['organizationSelect'].value);
      // console.log(fileReader.result);
    }
    let file: Blob = event.target.files[0] as Blob;
    if (file) {
      console.log(file);
      fileReader.readAsText(file);
    } else { this.deviceCSV.devices = []; }
  }

  manageDevicesArray: DeviceCSVObject[] | undefined;
  async getDevicesInSelectedOrg() {
    console.log("getting devices");
    const devices = await this.async_getDevicesInSelectedOrg();
    this.manageDevicesArray = devices;
  }
  //   async async_getDevicesInSelectedOrg() {
  //     const selectedOrg = await this.orgService.getById(this.selectedOrgId);
  //     if(!selectedOrg) return;
  //     const devices: DeviceCSVObject[] = (await firstValueFrom(this.deviceService.getSerialNumbersInOrganizationCollection(selectedOrg.id))).docs
  //       .map(a => a.data()) as DeviceCSVObject[];
  //     console.log(devices);
  // 
  //     return devices;
  //   }

  async async_getDevicesInSelectedOrg() {
    console.log("async devices started");
    if (!this.selectedOrgId) this.selectedOrgId = this.form.controls['organizationSelect'].value;
    try {
      const selectedOrg = await this.orgService.getById(this.selectedOrgId);
      if (!selectedOrg?.devices) return;
      console.log("got selected org:", selectedOrg, this.selectedOrgId);
      if (!selectedOrg) return;

      const devices: DeviceCSVObject[] = (await firstValueFrom(this.deviceService.getSerialNumbersInOrganizationCollection(selectedOrg.id))).docs.map(a => ({ ...a.data(), id: a.id })) as DeviceCSVObject[];

      // for (let i = 0; i < selectedOrg.devices.length; i++) {
      //   const device: DeviceCSVObject = (await firstValueFrom(this.deviceService.getSerialNumberById(selectedOrg.devices[i]))).data() as DeviceCSVObject;
      //   if (device) devices.push(device);
      // }
      console.log(devices);

      return devices;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }





  async pushDevicesToDB() {
    if (!this.selectedOrgId) { alert("invalid org: " + this.selectedOrgId); return; }
    this.results = "";
    this.warning = false;
    this.showResults = false;
    this.loading = true;
    if (!this.deviceCSV || !this.deviceCSV!.devices) { alert("invalid device list, please check the data and try again."); return; }

    const selectedOrg = await this.orgService.getById(this.selectedOrgId);
    if (!selectedOrg) { alert("invalid org: " + this.selectedOrgId); return; }


    console.log("Devices in org", selectedOrg.devices)
    let orgDevices = selectedOrg.devices;
    let existingDevices: string[] = [] as string[];
    let newDevices: string[] = [] as string[];
    let num: number = 0;
    // const SNObjects: DeviceCSVObject[] = (await firstValueFrom(this.deviceService.getSerialNumbersInOrganizationCollection(selectedOrg.id))).docs.map
    //   (a => ({ ...a.data(), id: a.id }
    //   ));

    try {
      const devicesRef = (await firstValueFrom(await this.get_devices(this.selectedOrgId))).docs;
      const batch = this.db.firestore.batch();

      for (let i = 0; i < this.deviceCSV!.devices.length; i++) {
        let match: boolean = false;
        let deviceCSV = this.deviceCSV!.devices[i];

        devicesRef.forEach(async deviceRef => {
          console.log("deleting device", deviceRef.data().SerialNumber, "in organization", this.selectedOrgId);
          if (deviceRef.data().SerialNumber == deviceCSV.SerialNumber) { match = true; existingDevices.push(deviceRef.data().SerialNumber); }
        });

        if (match) {
          num++;
        }
        else {
          const newDocRef = this.db.firestore.collection(this.deviceService.DbCollection).doc();
          newDevices.push(newDocRef.id);
          batch.set(newDocRef, this.deviceCSV!.devices[i]);
        }
      }
      await batch.commit().then(() => {

        console.log("successfully created docs");

        if (!selectedOrg.devices) selectedOrg.devices = [];
        selectedOrg.devices.push(...newDevices);
        this.orgService.updateElement(selectedOrg).then(() => {
          if (existingDevices.length > 0) {
            this.warning = true;
            let d: string = "";
            existingDevices.forEach(dev => { d += dev + "\n"; });
            // alert("It seems some of your devices already exist in the database.\nSerialNumbers: \n" + d);
            if (num >= this.deviceCSV.devices.length) this.fail = true;
            if (this.fail) {
              this.results = `All ${num} were unable to be added to the database due to the fact that they already exist.\nSerialNumbers: \n ${d}`;
            }
            else this.results = `It seems some of your devices already exist in the database (${num} devices). All other devices were saved successfully.\n SerialNumbers: \n ${d}`;
          } else
            this.results = "All devices successfully saved to database!"

          this.getDevicesInSelectedOrg();
        });
      }).catch(err => { console.error(err); });

    } catch (err) {
      console.error(err);
    }

    this.loading = false;
    this.showResults = true;
  }

  editDevice(device: DeviceCSVObject) {

  }
  deleteDevice(device: DeviceCSVObject) {
    if (!this.selectedOrgId) return;
    this.modals.CreateGenericConfirmationModal().subscribe((confirm) => {
      if (confirm) {
        this._deleteDevice(device);
      }
    });
  }
  private async _deleteDevice(device: DeviceCSVObject) {
    try {
      const batch = this.db.firestore.batch();
      const deviceRef = await this.deviceService.getDocRefById(device.id);
      const deviceDoc = await firstValueFrom((await this.deviceService.getDocRefById(device.id)).get());
      console.log("deleting device", deviceDoc.data()?.SerialNumber, "in organization", this.selectedOrgId);

      batch.delete(deviceRef.ref);
      await batch.commit().then(() => {
        console.log("successfully deleted doc", deviceDoc.data()?.SerialNumber);
        this.getDevicesInSelectedOrg();
      }).catch(err => { console.error(err); });
    } catch (err) {
      console.error(err);
    }
  }

  //TODO: Convert to batch write
  async moveToOrganization(device: DeviceCSVObject) {
    const _selectedOrgId = `${this.selectedOrgId}`; // copy value
    const modalRef = this.modalService.open(AscentDeviceMoveModalComponent, { centered: true, backdrop: false });
    modalRef.componentInstance.deviceId = device.id;
    this.deviceService.moveDeviceEvent.subscribe(async event => {
      if (event.confirm) {
        // move devices to input org
        let nextOrg = event.orgId;
        if (this.manageDevicesArray && this.manageDevicesArray.length > 0) {
          let lastOrg = _selectedOrgId;
          // for (let i = 0; i < this.manageDevicesArray?.length; i++) {
          //   this.manageDevicesArray[i].organizationId = nextOrg;
          // }

          const _lastOrg = await this.orgService.getById(lastOrg);
          if (_lastOrg && _lastOrg.devices) {
            for (let x = 0; x < _lastOrg.devices.length; x++) {
              if (_lastOrg.devices[x] == event.deviceId) {
                _lastOrg.devices.splice(x, 1);
              }
            }
            console.log("updating last org", _lastOrg);
            await this.orgService.updateElement(_lastOrg);
          }
          const _nextOrg = await this.orgService.getById(nextOrg);
          if (_nextOrg) {
            if (!_nextOrg.devices) _nextOrg.devices = [];
            _nextOrg.devices.push(event.deviceId);
            console.log("updating next org", _nextOrg);
            await this.orgService.updateElement(_nextOrg);
          }
          const device = await this.deviceService.getById(event.deviceId);
          if (device) {
            console.log("updating device", device);
            device.organizationId = nextOrg;
            await this.deviceService.updateElement(device);
            await this.getDevicesInSelectedOrg();
          }
        }
        this.form.controls['organizationSelect'].setValue(_selectedOrgId);
      }
      modalRef.close();
    });
  }
  moveAllToOrganization() {

    const _selectedOrgId = `${this.selectedOrgId}`; // copy value
    const modalRef = this.modalService.open(AscentDeviceMoveModalComponent, { centered: true, backdrop: false });

    this.deviceService.moveDeviceEvent.subscribe(async event => {
      if (event.confirm) {
        // move devices to input org
        let lastOrg = _selectedOrgId;
        let nextOrg = event.orgId;
        modalRef.componentInstance.loading = true;

        if (this.manageDevicesArray && this.manageDevicesArray.length > 0) {

          const _lastOrg = await this.orgService.getById(lastOrg);
          const _nextOrg = await this.orgService.getById(nextOrg);

          for (let i = 0; i < this.manageDevicesArray?.length; i++) {
            const deviceId = this.manageDevicesArray[i].id;

            if (_lastOrg && _lastOrg.devices) {
              for (let x = 0; x < _lastOrg.devices.length; x++) {
                if (_lastOrg.devices[x] == deviceId) {
                  _lastOrg.devices.splice(x, 1);
                }
              }
            }

            if (_nextOrg) {
              if (!_nextOrg.devices) _nextOrg.devices = [];
              _nextOrg.devices.push(deviceId);
            }
          }

          if (_lastOrg && _lastOrg.devices) {
            console.log("updating last org", _lastOrg);
            await this.orgService.updateElement(_lastOrg);
          }

          if (_nextOrg) {
            console.log("updating next org", _nextOrg);
            await this.orgService.updateElement(_nextOrg);
          }



          try {
            const devicesRef = (await firstValueFrom(await this.get_devices(_selectedOrgId))).docs;
            const batch = this.db.firestore.batch();
            devicesRef.forEach(async a => {
              console.log("updating", a.id, "with organizationId", nextOrg);
              batch.update(a.ref, { organizationId: nextOrg });
            });
            await batch.commit().then(() => {
              console.log("successfully updated docs");
            }).catch(err => { console.error(err); });

          } catch (err) {
            console.error(err);
          }

          this.form.controls['organizationSelect'].setValue(_selectedOrgId);
          await this.getDevicesInSelectedOrg();
        }
        modalRef.close();
      }
    });

  }
  removeAllDevices() {
    if (!this.selectedOrgId) return;
    this.modals.CreateGenericConfirmationModal().subscribe((confirm) => {
      if (confirm) {
        this._removeAllDevices();
      }
    });
  }
  private async _removeAllDevices() {
    const selectedOrg = await this.orgService.getById(this.selectedOrgId);
    if (!selectedOrg) { console.error("No selected org"); return; }
    try {
      const orgDeviceList = selectedOrg?.devices!;
      const devicesRef = (await firstValueFrom(await this.get_devices(this.selectedOrgId))).docs;
      const batch = this.db.firestore.batch();
      devicesRef.forEach(async a => {
        console.log("deleting device", a.data().SerialNumber, "in organization", this.selectedOrgId);
        if (orgDeviceList) {
          for (let i = 0; i < orgDeviceList.length; i++) {
            if (orgDeviceList[i] == a.id) orgDeviceList.splice(i, 1);
          }
        }
        selectedOrg!.devices = orgDeviceList;
        batch.delete(a.ref);
      });
      await batch.commit().then(() => {
        console.log("successfully deleted docs");
        this.orgService.updateElement(selectedOrg!).then(() => {
          this.getDevicesInSelectedOrg();
        });
      }).catch(err => { console.error(err); });

    } catch (err) {
      console.error(err);
    }
  }

  async get_devices(_selectedOrgId: string) {
    return this.fs.firestore.collection<DeviceCSVObject>(this.deviceService.DbCollection, ref => ref.where("organizationId", "==", _selectedOrgId)).get();
  }
}
