import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  @Input() id: string | null;
  @Input() title: string | null;

  constructor(public activeModal: NgbActiveModal){ }

  close() {
    this.activeModal.close();
  }
  
  public confirm() {
    this.activeModal.close(this.id);
  }
}
