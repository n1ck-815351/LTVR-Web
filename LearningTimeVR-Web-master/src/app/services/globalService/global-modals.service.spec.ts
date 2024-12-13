import { TestBed } from '@angular/core/testing';

import { GlobalModalsService } from './global-modals.service';

describe('GlobalModalsService', () => {
  let service: GlobalModalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalModalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
