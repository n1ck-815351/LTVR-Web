import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmersionImageComponent } from './emersion-image.component';

describe('EmersionImageComponent', () => {
  let component: EmersionImageComponent;
  let fixture: ComponentFixture<EmersionImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmersionImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmersionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
