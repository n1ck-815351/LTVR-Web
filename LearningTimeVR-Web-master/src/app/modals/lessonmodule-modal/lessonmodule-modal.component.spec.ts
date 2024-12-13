import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonmoduleModalComponent } from './lessonmodule-modal.component';

describe('LessonmoduleModalComponent', () => {
  let component: LessonmoduleModalComponent;
  let fixture: ComponentFixture<LessonmoduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonmoduleModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonmoduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
