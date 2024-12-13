import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() icon: string = '';

  @Output() buttonClickEvent = new EventEmitter();

  public onButtonClick() {
    this.buttonClickEvent.emit();
  }
}
