import { TestBed } from '@angular/core/testing';

import { SubscriptionUtilityService } from './subscription-utility.service';

describe('SubscriptionUtilityService', () => {
  let service: SubscriptionUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
