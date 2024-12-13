import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemodalComponent } from './imagemodal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ImagemodalComponent', () => {
  let component: ImagemodalComponent;
  let fixture: ComponentFixture<ImagemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ NgbActiveModal ],
      declarations: [ ImagemodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
