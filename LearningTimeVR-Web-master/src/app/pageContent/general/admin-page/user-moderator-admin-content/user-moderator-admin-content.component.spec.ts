import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModeratorAdminContentComponent } from './user-moderator-admin-content.component';

describe('UserModeratorAdminContentComponent', () => {
  let component: UserModeratorAdminContentComponent;
  let fixture: ComponentFixture<UserModeratorAdminContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModeratorAdminContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModeratorAdminContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
