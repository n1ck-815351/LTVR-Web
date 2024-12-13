import { TestBed } from '@angular/core/testing';

import { EnrolleeService } from './enrollee.service';

xdescribe('EnrolleeService', () => {
  let service: EnrolleeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolleeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
