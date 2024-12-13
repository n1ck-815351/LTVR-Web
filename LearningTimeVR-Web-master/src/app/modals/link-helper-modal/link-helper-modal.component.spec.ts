import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkHelperModalComponent } from './link-helper-modal.component';

xdescribe('LinkHelperModalComponent', () => {
  let component: LinkHelperModalComponent;
  let fixture: ComponentFixture<LinkHelperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkHelperModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkHelperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
