import { TestBed } from '@angular/core/testing';

import { UploadQueueService } from './upload-queue.service';

xdescribe('UploadQueueService', () => {
  let service: UploadQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
