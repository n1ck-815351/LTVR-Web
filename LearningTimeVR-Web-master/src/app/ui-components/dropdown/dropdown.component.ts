import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { DropdownOption } from 'app/models/Interfaces/DropdownOption';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() optionsList: DropdownOption[];
  @Input() selectedOption = '';
  @Output() changeEvent = new EventEmitter();

  public onChange(value: any) {
    this.changeEvent.emit(value);
  }
}
