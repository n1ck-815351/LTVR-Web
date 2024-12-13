import { Component } from '@angular/core';
import { GlobalModalsService } from 'app/services/globalService/global-modals.service';

@Component({
  selector: 'app-global-confirmation-modal',
  templateUrl: './global-confirmation-modal.component.html',
  styleUrls: ['./global-confirmation-modal.component.scss']
})
export class GlobalConfirmationModalComponent {
  constructor(private modals: GlobalModalsService) { }
  headerTxt: string;
  bodyTxt: string;
  confirmBtnTxt: string;
  cancelBtnTxt: string;

  Confirm() {
    this.modals.genericConfirmationEvent.emit(true);
  }
  Cancel() {
    this.modals.genericConfirmationEvent.emit(false);
  }
}
