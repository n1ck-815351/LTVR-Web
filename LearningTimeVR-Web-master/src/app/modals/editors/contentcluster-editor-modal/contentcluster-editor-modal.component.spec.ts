import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentclusterEditorModalComponent } from './contentcluster-editor-modal.component';

xdescribe('ContentclusterEditorModalComponent', () => {
  let component: ContentclusterEditorModalComponent;
  let fixture: ComponentFixture<ContentclusterEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentclusterEditorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentclusterEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
