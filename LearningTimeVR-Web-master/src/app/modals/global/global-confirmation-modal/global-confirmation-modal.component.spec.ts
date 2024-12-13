import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConfirmationModalComponent } from './global-confirmation-modal.component';

describe('GlobalConfirmationModalComponent', () => {
  let component: GlobalConfirmationModalComponent;
  let fixture: ComponentFixture<GlobalConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalConfirmationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
