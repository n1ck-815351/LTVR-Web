import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-youtubemodal',
  templateUrl: './youtubemodal.component.html',
  styleUrls: ['./youtubemodal.component.scss']
})
export class YoutubemodalComponent {
  url: string;
  title:string;
  constructor(public activeModal: NgbActiveModal) { }

  close() {
    this.activeModal.close();
  }
}

