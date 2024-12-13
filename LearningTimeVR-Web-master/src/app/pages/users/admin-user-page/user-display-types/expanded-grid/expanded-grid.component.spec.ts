import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedGridComponent } from './expanded-grid.component';

xdescribe('ExpandedGridComponent', () => {
  let component: ExpandedGridComponent;
  let fixture: ComponentFixture<ExpandedGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandedGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
