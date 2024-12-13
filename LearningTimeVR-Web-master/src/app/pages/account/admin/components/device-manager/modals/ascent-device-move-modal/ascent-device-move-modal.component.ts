import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { DeviceService } from 'app/services/firebase/device.service';

export interface MoveDeviceEvent {
  deviceId: string;
  orgId: string;
  confirm: boolean;
}

@Component({
  selector: 'app-ascent-device-move-modal',
  templateUrl: './ascent-device-move-modal.component.html',
  styleUrls: ['./ascent-device-move-modal.component.scss']
})
export class AscentDeviceMoveModalComponent {
  constructor(public orgService: OrganizationService, private deviceService: DeviceService) { }


  form: FormGroup = new FormGroup({
    organizationSelect: new FormControl(this.orgService.collection[0])
  });
  deviceId: string;
  loading:boolean = false;

  Confirm() {
    const e: MoveDeviceEvent = { orgId: this.form.controls["organizationSelect"].value, confirm: true, deviceId: this.deviceId };
    console.log("CONFIRMED****",e);
    this.deviceService.moveDeviceEvent.emit(e);
  }
  Cancel() {
    const e: MoveDeviceEvent = { orgId: this.form.controls["organizationSelect"].value, confirm: false, deviceId: this.deviceId };
    this.deviceService.moveDeviceEvent.emit(e);
  }
}
