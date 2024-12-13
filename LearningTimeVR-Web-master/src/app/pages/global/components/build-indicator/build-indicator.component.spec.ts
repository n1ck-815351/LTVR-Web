import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildIndicatorComponent } from './build-indicator.component';

describe('BuildIndicatorComponent', () => {
  let component: BuildIndicatorComponent;
  let fixture: ComponentFixture<BuildIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
