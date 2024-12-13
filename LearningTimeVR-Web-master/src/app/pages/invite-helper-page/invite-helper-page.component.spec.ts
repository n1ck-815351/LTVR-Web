import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteHelperPageComponent } from './invite-helper-page.component';

xdescribe('InviteHelperPageComponent', () => {
  let component: InviteHelperPageComponent;
  let fixture: ComponentFixture<InviteHelperPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteHelperPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteHelperPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
