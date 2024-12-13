import { Component, Input, Output, ViewChild, ElementRef, AfterViewInit, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClassroomKVP } from 'app/models/Interfaces/ClassroomKVP';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements AfterViewInit {
  
  // README: Autocomplete example provided by:
  // https://stackblitz.com/edit/angular-material-autocomplete-input-value-change?file=app%2Fautocomplete-overview-example.html

  @ViewChild('searchInput') searchInput : ElementRef;
  
  @Input() placeholderLabel: string = "What are you searching today?";
  @Input() placeholderText: string = "Search";
  @Input() autoCompleteOptions: ClassroomKVP[] = [];

  @Output() selectedText: string;
  @Output() selectedOption: string;
  
  searchControl = new FormControl('');
  filteredOptions: Observable<any[]>;
  @Output() changeEvent = new EventEmitter();

  ngAfterViewInit(): void { }

  ngOnInit() {
    if (this.autoCompleteOptions.length === 0) {
      this.searchControl.disable();
    }

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(key => key ? this.filterResults(key) : this.autoCompleteOptions.slice())
    );

  }

  // Return a specific kvp from the provided classroom kvp.
  findInOptions(optionArray: ClassroomKVP[], key: string): ClassroomKVP | undefined {
    let selectedOption: ClassroomKVP | undefined;
    selectedOption = optionArray.find(option =>
      option.title.toLowerCase()==key.toLowerCase());
    return selectedOption;
  }

  // Provide a filtered list of selected options.
  private filterResults(key: string) {
    if (key) {
      return this.autoCompleteOptions.filter(option =>
        option.title.toLowerCase().indexOf(key.toLowerCase()) === 0);
    }
    return [];
  }

  public onTextChange(selected: any) {
    console.log('OnTextChanged: ',selected)
    if (selected) {
      this.selectedText = selected;
    }
  }

  public onChange(value: any) {
    console.log('search comp: ', value)
  }

  // Set the output value of selected autocomplete option.
  public onOptionSelected(selected: string) {
    if (selected) {
      this.selectedOption = selected;
      console.log('onOptionSelected: title => ', this.selectedOption)
      console.log('onOptionSelected: id => ', this.findInOptions(this.autoCompleteOptions, this.selectedOption)?.id)
    }
  }

  // Option to overwrite the value provided in the search bar
  // Example: 
  // User types "Class", then selects "Class A"
  // The input box will change to "classId1234" after 0ms
  onEnter(evt: any){
    const selectedOption = this.findInOptions(this.autoCompleteOptions, evt.source.value);
    if (evt.source.selected) {
      console.log('onEnter:', selectedOption);
      if(selectedOption) {
        setTimeout(()=>{
          this.searchControl.patchValue(selectedOption.title);
          this.changeEvent.emit(selectedOption.title);
        }, 0);
      }
    }
  }
}
