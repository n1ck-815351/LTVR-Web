import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonmoduleEditorModalComponent } from './lessonmodule-editor-modal.component';

xdescribe('LessonmoduleEditorModalComponent', () => {
  let component: LessonmoduleEditorModalComponent;
  let fixture: ComponentFixture<LessonmoduleEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonmoduleEditorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonmoduleEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
