import { Component, Input } from '@angular/core';
import { FirebaseRequestService } from 'app/services/firebase/firebase-request.service';
import { Dialogue } from 'app/models/Interfaces/events/dialogue';

@Component({
  selector: 'app-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.scss']
})


export class ValidationDialogComponent {
  constructor(public fbRequestService:FirebaseRequestService){
    
  }
  @Input() element: any;
  @Input() nodeType: string;
  @Input() loading:boolean = false;
  @Input() id: string | null;
  // @Output() confirmEvent = new EventEmitter<Dialogue>();

  CommitResults(value: boolean) {
    let e: Dialogue = {
      result: value
    };
    console.log(e);
    // this.confirmEvent.emit(e);
    this.fbRequestService.confirmDialogEvent.emit(e);
  }

}
