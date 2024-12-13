import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCreatorModalComponent } from './class-creator-modal.component';

describe('ClassCreatorModalComponent', () => {
  let component: ClassCreatorModalComponent;
  let fixture: ComponentFixture<ClassCreatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassCreatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
