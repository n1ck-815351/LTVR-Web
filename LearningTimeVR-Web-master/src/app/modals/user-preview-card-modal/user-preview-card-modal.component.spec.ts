import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreviewCardModalComponent } from './user-preview-card-modal.component';

xdescribe('UserPreviewCardModalComponent', () => {
  let component: UserPreviewCardModalComponent;
  let fixture: ComponentFixture<UserPreviewCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPreviewCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPreviewCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
