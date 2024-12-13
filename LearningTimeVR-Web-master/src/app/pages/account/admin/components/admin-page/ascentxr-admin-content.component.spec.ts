import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscentxrAdminContentComponent } from './ascentxr-admin-content.component';

describe('AscentxrAdminContentComponent', () => {
  let component: AscentxrAdminContentComponent;
  let fixture: ComponentFixture<AscentxrAdminContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AscentxrAdminContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AscentxrAdminContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
