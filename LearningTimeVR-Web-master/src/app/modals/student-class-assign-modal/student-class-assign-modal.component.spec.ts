import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassAssignModalComponent } from './student-class-assign-modal.component';

xdescribe('StudentClassAssignModalComponent', () => {
  let component: StudentClassAssignModalComponent;
  let fixture: ComponentFixture<StudentClassAssignModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentClassAssignModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentClassAssignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
