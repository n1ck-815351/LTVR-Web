import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQueueComponent } from './download-queue.component';

xdescribe('DownloadQueueComponent', () => {
  let component: UploadQueueComponent;
  let fixture: ComponentFixture<UploadQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
