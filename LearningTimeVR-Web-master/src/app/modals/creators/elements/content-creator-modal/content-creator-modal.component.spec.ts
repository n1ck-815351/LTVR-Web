import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCreatorModalComponent } from './content-creator-modal.component';

xdescribe('ContentCreatorModalComponent', () => {
  let component: ContentCreatorModalComponent;
  let fixture: ComponentFixture<ContentCreatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentCreatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
