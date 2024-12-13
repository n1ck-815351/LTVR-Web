import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassCreatorModalComponent } from './class-creator-modal.component';

describe('ClassCreatorModalComponent', () => {
  let component: ClassCreatorModalComponent;
  let fixture: ComponentFixture<ClassCreatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ NgbActiveModal ],
      declarations: [ ClassCreatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassCreatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
