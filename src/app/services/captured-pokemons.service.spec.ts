import { TestBed } from '@angular/core/testing';

import { CapturedPokemonsService } from './captured-pokemons.service';

describe('CapturedPokemonsService', () => {
  let service: CapturedPokemonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapturedPokemonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
