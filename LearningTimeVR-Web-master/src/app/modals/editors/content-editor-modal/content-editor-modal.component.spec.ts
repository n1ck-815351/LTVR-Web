import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditorModalComponent } from './content-editor-modal.component';

xdescribe('ContentEditorModalComponent', () => {
  let component: ContentEditorModalComponent;
  let fixture: ComponentFixture<ContentEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentEditorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
