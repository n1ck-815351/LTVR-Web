import { EventEmitter, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConfirmationModalComponent } from 'app/modals/global/global-confirmation-modal/global-confirmation-modal.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalModalsService {
  public genericConfirmationEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal) { }

  /** 
    * You must subscribe in order for this observable to reach the endpoint. The subscription can be empty.
    */
  public CreateGenericConfirmationModal(headerTxt: string = "Are you sure?", bodyTxt = "Are you sure you want to proceed?", confirmBtnTxt: string = "Yes", cancelBtnTxt: string = "No"): Observable<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(GlobalConfirmationModalComponent, { centered: true });
    const componentInstance: GlobalConfirmationModalComponent = modalRef.componentInstance;
    componentInstance.cancelBtnTxt = cancelBtnTxt;
    componentInstance.confirmBtnTxt = confirmBtnTxt;
    componentInstance.headerTxt = headerTxt;
    componentInstance.bodyTxt = bodyTxt;

    return new Observable<boolean>((observer) => {
      const subscription = this.genericConfirmationEvent.subscribe((result: boolean) => {
        observer.next(result);
        observer.complete();
        modalRef.close();
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      };
    });
  }
}
