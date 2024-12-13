import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.component.html',
  styleUrls: ['./imagemodal.component.scss']
})
export class ImagemodalComponent {
  url: string;
  title:string;
  constructor(public activeModal: NgbActiveModal) { }

  close() {
    this.activeModal.close();
  }
}

