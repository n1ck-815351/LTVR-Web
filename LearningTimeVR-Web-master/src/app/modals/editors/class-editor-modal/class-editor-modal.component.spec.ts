import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassEditorModalComponent } from './class-editor-modal.component';

xdescribe('ClassEditorModalComponent', () => {
  let component: ClassEditorModalComponent;
  let fixture: ComponentFixture<ClassEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassEditorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
