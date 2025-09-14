import { TestBed } from '@angular/core/testing';

import { TicketXService } from './ticket-x.service';

describe('TicketXService', () => {
  let service: TicketXService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketXService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
