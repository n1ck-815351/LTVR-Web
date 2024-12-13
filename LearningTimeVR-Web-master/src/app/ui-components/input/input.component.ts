import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input() placeholderLabel: string | null  = 'Placeholder Label';
  @Input() placeholder: string | null  = 'Placeholder Text';
  @Input() defaultValue: string | null = 'Default Value';

  @Output() changeEvent = new EventEmitter();
  
  public onChange() {
    this.changeEvent.emit(this.defaultValue);
  }
}
