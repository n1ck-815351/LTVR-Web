import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomViewerComponent } from './classroom-viewer.component';

xdescribe('ClassroomViewerComponent', () => {
  let component: ClassroomViewerComponent;
  let fixture: ComponentFixture<ClassroomViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
