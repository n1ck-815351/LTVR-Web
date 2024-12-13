import { TestBed } from '@angular/core/testing';

import { ErrorUtilityService } from './error-utility.service';

describe('ErrorUtilityService', () => {
  let service: ErrorUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
