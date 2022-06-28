import { TestBed } from '@angular/core/testing';

import { GisService } from './gis.service';

describe('GisService', () => {
  let service: GisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
