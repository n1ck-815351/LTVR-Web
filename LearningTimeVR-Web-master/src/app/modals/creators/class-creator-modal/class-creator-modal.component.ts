import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-class-creator-modal',
  templateUrl: './class-creator-modal.component.html',
  styleUrls: ['./class-creator-modal.component.scss']
})
export class ClassCreatorModalComponent {

  constructor(public activeModal: NgbActiveModal) { console.log(this.modalType);  }

  @Output() entryData: EventEmitter<any> = new EventEmitter();
  
  public data = {
    title: '',
    description: ''
  };
  private copy = {
    title:'',
    description:''
  };
  
  public setData(element:any){
    this.copy = JSON.parse(JSON.stringify(element));
    this.data = JSON.parse(JSON.stringify(element));
  }
  
  public modalType = 'Create';
  
  public canSave() {
    return this.form.valid;
  }

  public save() {
    this.activeModal.close(this.data);
  }

  public close(){
    console.log("data",this.data,"copy",this.copy);
    this.activeModal.close();
  }

  form: FormGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required])
  });
  get title() { return this.form.get("title"); }
  get description() { return this.form.get("description"); }
}
