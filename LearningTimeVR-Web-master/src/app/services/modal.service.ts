import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from 'app/modals/confirmations/info-modal/info-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private ngbModal: NgbModal) { }
  
  public NewInfoModal(title:string,body:string){
    const modalRef = this.ngbModal.open(InfoModalComponent, { size:'lg', centered:true })
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }
}
