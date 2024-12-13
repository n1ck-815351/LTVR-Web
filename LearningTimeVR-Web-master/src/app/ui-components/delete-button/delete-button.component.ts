import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  @Output() buttonClickEvent = new EventEmitter();

  public onButtonClick() {
    this.buttonClickEvent.emit();
  }
}
