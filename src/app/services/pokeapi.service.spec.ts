import { TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { Pokemon } from '@models/pokemon.model';
import { Apollo } from 'apollo-angular';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { PokeapiService } from './pokeapi.service';
import { PokemonDataService } from './pokemon-data.service';

class FakePokemonDataService {
  public pokemonList = of([
    {
      id: 1,
      name: 'Bulbasaur',
      model_type: 'light',
      types: ['grass', 'poison'],
      captured: false,
    },
  ]);
}

const toastrService = {
  success: (
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>
  ) => {},
  error: (
    message?: string,
    title?: string,
    override?: Partial<IndividualConfig>
  ) => {},
};

describe('PokeapiService', () => {
  let service: PokeapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PokemonDataService, useValue: new FakePokemonDataService() },
        Apollo,
        Router,
        { provide: ToastrService, useValue: toastrService },
      ],
    });
    service = TestBed.inject(PokeapiService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });

  it('fetchAllPokemonLight should return an array of Pokemon when there is an array of Pokemon in the cache', (done: DoneFn) => {
    service.fetchAllPokemonLight().subscribe((pokemonList: Pokemon[]) => {
      expect(pokemonList).toEqual([
        {
          id: 1,
          name: 'Bulbasaur',
          model_type: 'light',
          types: ['grass', 'poison'],
          captured: false,
        },
      ]);
      done();
    });
  });
});
