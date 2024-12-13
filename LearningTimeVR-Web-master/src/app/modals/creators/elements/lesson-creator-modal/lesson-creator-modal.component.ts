import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lesson-creator-modal',
  templateUrl: './lesson-creator-modal.component.html',
  styleUrls: ['./lesson-creator-modal.component.scss']
})
export class LessonCreatorModalComponent {
  public inputForm: FormGroup;

}
