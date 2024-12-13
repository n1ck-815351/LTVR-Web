import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGeneratorComponent } from './link-generator.component';

xdescribe('LinkGeneratorComponent', () => {
  let component: LinkGeneratorComponent;
  let fixture: ComponentFixture<LinkGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
