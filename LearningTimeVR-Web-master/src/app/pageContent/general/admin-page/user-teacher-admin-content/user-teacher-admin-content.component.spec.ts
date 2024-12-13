import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeacherAdminContentComponent } from './user-teacher-admin-content.component';

describe('UserTeacherAdminContentComponent', () => {
  let component: UserTeacherAdminContentComponent;
  let fixture: ComponentFixture<UserTeacherAdminContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTeacherAdminContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTeacherAdminContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
