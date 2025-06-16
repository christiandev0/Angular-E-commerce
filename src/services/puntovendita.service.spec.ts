import { TestBed } from '@angular/core/testing';

import { PuntovenditaService } from './puntovendita.service';

describe('PuntovenditaService', () => {
  let service: PuntovenditaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntovenditaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
