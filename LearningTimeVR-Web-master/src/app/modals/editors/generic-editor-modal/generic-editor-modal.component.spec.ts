import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericEditorModalComponent } from './generic-editor-modal.component';

xdescribe('GenericEditorModalComponent', () => {
  let component: GenericEditorModalComponent;
  let fixture: ComponentFixture<GenericEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericEditorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
