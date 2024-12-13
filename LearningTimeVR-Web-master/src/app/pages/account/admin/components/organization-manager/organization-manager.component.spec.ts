import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationManagerComponent } from './organization-manager.component';

xdescribe('OrganizationManagerComponent', () => {
  let component: OrganizationManagerComponent;
  let fixture: ComponentFixture<OrganizationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
