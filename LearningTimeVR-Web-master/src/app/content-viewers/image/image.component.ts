import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImagemodalComponent } from '../modals/imagemodal/imagemodal.component';
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input() src: any;
  @Input() title:string|null;
  @Input() contentIndex:number|null;
  id: string;

  constructor(private sanitizer: DomSanitizer, public modalService: NgbModal) {}

  openImageModal() {
    const modalRef = this.modalService.open(ImagemodalComponent, { centered: true, size:'xl' });
    modalRef.componentInstance.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
    modalRef.componentInstance.title = this.title;
  }
}