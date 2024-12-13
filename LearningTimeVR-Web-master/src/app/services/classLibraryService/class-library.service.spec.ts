import { TestBed } from '@angular/core/testing';

import { ClassLibraryService } from './class-library.service';

xdescribe('ClassLibraryService', () => {
  let service: ClassLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
