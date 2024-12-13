import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmersionVideoComponent } from './emersion-video.component';

describe('EmersionVideoComponent', () => {
  let component: EmersionVideoComponent;
  let fixture: ComponentFixture<EmersionVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmersionVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmersionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
