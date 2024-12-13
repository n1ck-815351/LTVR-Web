import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subject-creator-modal',
  templateUrl: './subject-creator-modal.component.html',
  styleUrls: ['./subject-creator-modal.component.scss']
})
export class SubjectCreatorModalComponent {
  public inputForm: FormGroup;

}
