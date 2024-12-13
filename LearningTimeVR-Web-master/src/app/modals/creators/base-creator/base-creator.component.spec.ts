import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCreatorComponent } from './base-creator.component';

xdescribe('BaseCreatorComponent', () => {
  let component: BaseCreatorComponent;
  let fixture: ComponentFixture<BaseCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
