import { TestBed } from '@angular/core/testing';

import { PinService } from './pin.service';

xdescribe('PinService', () => {
  let service: PinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
