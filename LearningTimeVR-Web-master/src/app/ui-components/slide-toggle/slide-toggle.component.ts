import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent {
  @Input() checked: boolean;
  @Output() changeEvent = new EventEmitter();

  public onChange(value: MatSlideToggleChange) {
    this.changeEvent.emit(value);
  }
}
