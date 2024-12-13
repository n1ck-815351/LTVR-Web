import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscentDeviceMoveModalComponent } from './ascent-device-move-modal.component';

xdescribe('AscentDeviceMoveModalComponent', () => {
  let component: AscentDeviceMoveModalComponent;
  let fixture: ComponentFixture<AscentDeviceMoveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AscentDeviceMoveModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AscentDeviceMoveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
