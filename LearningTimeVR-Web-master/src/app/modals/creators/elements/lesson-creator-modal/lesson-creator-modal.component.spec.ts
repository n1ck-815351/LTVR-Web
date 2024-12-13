import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCreatorModalComponent } from './lesson-creator-modal.component';

describe('LessonCreatorModalComponent', () => {
  let component: LessonCreatorModalComponent;
  let fixture: ComponentFixture<LessonCreatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonCreatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
