import { TestBed } from '@angular/core/testing';

import { TaxanomyService } from './taxanomy.service';

describe('TaxanomyService', () => {
  let service: TaxanomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxanomyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
