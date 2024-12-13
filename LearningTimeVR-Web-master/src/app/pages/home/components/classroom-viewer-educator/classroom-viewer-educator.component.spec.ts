import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomViewerEducatorComponent } from './classroom-viewer-educator.component';

xdescribe('ClassroomViewerEducatorComponent', () => {
  let component: ClassroomViewerEducatorComponent;
  let fixture: ComponentFixture<ClassroomViewerEducatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomViewerEducatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomViewerEducatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
