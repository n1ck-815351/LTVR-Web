import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCreatorModalComponent } from './generic-creator-modal.component';

xdescribe('GenericCreatorModalComponent', () => {
  let component: GenericCreatorModalComponent;
  let fixture: ComponentFixture<GenericCreatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericCreatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
