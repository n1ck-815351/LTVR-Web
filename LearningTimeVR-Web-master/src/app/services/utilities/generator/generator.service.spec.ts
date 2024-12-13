import { TestBed } from '@angular/core/testing';

import { GeneratorService } from './generator.service';

xdescribe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
