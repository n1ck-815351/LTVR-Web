import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @Output() buttonClickEvent = new EventEmitter();

  public onButtonClick() {
    this.buttonClickEvent.emit();
  }
}
