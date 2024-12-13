import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCreatorModalComponent } from './subject-creator-modal.component';

describe('SubjectCreatorModalComponent', () => {
  let component: SubjectCreatorModalComponent;
  let fixture: ComponentFixture<SubjectCreatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectCreatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
