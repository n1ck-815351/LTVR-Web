import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { YoutubemodalComponent } from './youtubemodal.component';

describe('YoutubemodalComponent', () => {
  let component: YoutubemodalComponent;
  let fixture: ComponentFixture<YoutubemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ NgbActiveModal ],
      declarations: [ YoutubemodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
