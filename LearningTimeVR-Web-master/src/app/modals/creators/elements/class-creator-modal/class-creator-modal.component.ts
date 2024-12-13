import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-class-creator-modal',
  templateUrl: './class-creator-modal.component.html',
  styleUrls: ['./class-creator-modal.component.scss']
})
export class ClassCreatorModalComponent {
  
  public inputForm:FormGroup;

}
