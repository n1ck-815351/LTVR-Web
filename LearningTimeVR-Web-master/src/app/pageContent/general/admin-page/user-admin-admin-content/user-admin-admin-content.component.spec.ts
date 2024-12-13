import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminAdminContentComponent } from './user-admin-admin-content.component';

describe('UserAdminAdminContentComponent', () => {
  let component: UserAdminAdminContentComponent;
  let fixture: ComponentFixture<UserAdminAdminContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAdminAdminContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAdminAdminContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
