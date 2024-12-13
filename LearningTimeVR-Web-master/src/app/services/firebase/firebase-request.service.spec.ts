import { TestBed } from '@angular/core/testing';

import { FirebaseRequestService } from './firebase-request.service';

xdescribe('FirebaseRequestService', () => {
  let service: FirebaseRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
