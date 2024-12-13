import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpmCreatorComponent } from './rpm-creator.component';

xdescribe('RpmCreatorComponent', () => {
  let component: RpmCreatorComponent;
  let fixture: ComponentFixture<RpmCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpmCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpmCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
