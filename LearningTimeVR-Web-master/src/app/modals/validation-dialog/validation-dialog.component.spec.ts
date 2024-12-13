import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDialogComponent } from './validation-dialog.component';

xdescribe('ValidationDialogComponent', () => {
  let component: ValidationDialogComponent;
  let fixture: ComponentFixture<ValidationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
