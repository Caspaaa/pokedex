import { TestBed } from '@angular/core/testing';

import { Router, Routes, provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ErrorComponent } from '../components/error/error.component';
import { PokeapiService } from './pokeapi.service';
import { PokemonDataService } from './pokemon-data.service';

class FakePokemonDataServiceWithCache {
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

class FakePokemonDataServiceWithEmptyCache {
  public pokemonList = of([]);
}

const fakeApollo = {
  watchQuery: jasmine.createSpy('watchQuery').and.returnValue({
    valueChanges: of({
      data: {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'Bulbasaur',
            model_type: 'light',
            types: ['grass', 'poison'],
          },
        ],
      },
    }),
  }),
};

// const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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

const appRoutes: Routes = [{ path: 'error', component: ErrorComponent }];

describe('PokeapiService', () => {
  let service: PokeapiService; // service that fetches from the api
  let service2: PokemonDataService; // service that loads from cache

  describe('fetchAllPokemonLight when there is an array of Pokemon in the cache', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          Apollo,
          { provide: ToastrService, useValue: toastrService },
          {
            provide: PokemonDataService,
            useClass: FakePokemonDataServiceWithCache,
          },
          Router,
        ],
      });

      service = TestBed.inject(PokeapiService);
    });

    it('should return an array of Pokemon', (done: DoneFn) => {
      service.fetchAllPokemonLight().subscribe((pokemonList) => {
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

  describe('fetchAllPokemonLight when cache is empty', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: Apollo, useValue: fakeApollo },
          { provide: ToastrService, useValue: toastrService },
          {
            provide: PokemonDataService,
            useClass: FakePokemonDataServiceWithEmptyCache,
          },
          Router,
          provideRouter(appRoutes),
        ],
      });
      service2 = TestBed.inject(PokemonDataService);
    });

    it('should fetch Pokemon from the API', (done: DoneFn) => {
      service.fetchAllPokemonLight().subscribe((pokemonList) => {
        console.log('pokemonList', pokemonList);
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
});
