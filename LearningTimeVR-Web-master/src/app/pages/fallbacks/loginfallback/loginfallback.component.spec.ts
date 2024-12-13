import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginfallbackComponent } from './loginfallback.component';

xdescribe('LoginfallbackComponent', () => {
  let component: LoginfallbackComponent;
  let fixture: ComponentFixture<LoginfallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginfallbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginfallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
