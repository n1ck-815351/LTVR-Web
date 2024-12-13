import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomViewerStudentComponent } from './classroom-viewer-student.component';

describe('ClassroomViewerStudentComponent', () => {
  let component: ClassroomViewerStudentComponent;
  let fixture: ComponentFixture<ClassroomViewerStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomViewerStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomViewerStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
