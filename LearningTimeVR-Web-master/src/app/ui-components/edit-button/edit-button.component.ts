import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent {
  @Output() buttonClickEvent = new EventEmitter();

  public onButtonClick() {
    this.buttonClickEvent.emit();
  }
}
