import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSelectionComponent } from './no-selection.component';

describe('NoSelectionComponent', () => {
  let component: NoSelectionComponent;
  let fixture: ComponentFixture<NoSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
