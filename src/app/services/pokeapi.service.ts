import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { PokemonDataService } from './pokemon-data.service';

import { Pokemon, PokemonFull, PokemonLight } from '@models/pokemon.model';

import {
  GET_POKEMON_FULL,
  GET_ALL_POKEMON_LIGHT,
} from '../queries/pokeapi.queries';

export interface PokemonLightListResponse {
  pokemon_v2_pokemon: Array<{
    id: number;
    name: string;
    pokemon_v2_pokemontypes: Array<{
      pokemon_v2_type: Array<{
        name: string;
      }>;
    }>;
  }>;
}

export interface PokemonListResponse {
  pokemon_v2_pokemon: Array<{
    id: number;
    pokemon_v2_pokemontypes: Array<{
      pokemon_v2_type: Array<{
        name: string;
      }>;
    }>;
  }>;
}

export interface PokemonFullResponse {
  pokemon_v2_pokemon: PokemonFull[];
}

export interface PokemonLightQueryParams {
  offset: number;
  limit: number;
}

export interface PokemonFullQueryParams {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  constructor(
    private apollo: Apollo,
    private pokemonDataService: PokemonDataService
  ) {}

  // Returns all pokemon names from cache
  // Or fetch them from API and assign them a captured value before storing the list to cache
  fetchAllPokemonLight(): Observable<Pokemon[]> {
    if (this.pokemonDataService.pokemonList)
      return of(this.pokemonDataService.pokemonList);

    return this.apollo
      .watchQuery<PokemonLightListResponse, PokemonLightQueryParams>({
        query: GET_ALL_POKEMON_LIGHT,
        variables: {
          offset: 0,
          limit: 1500,
        },
      })
      .valueChanges.pipe(
        map((response) => response.data.pokemon_v2_pokemon),
        map((rawPokemonList) => {
          const list = rawPokemonList.map((rawPokemon): PokemonLight => {
            const types = rawPokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type;
            return {
              ...rawPokemon,
              captured: Math.random() < 0.1,
              model_type: 'light',
              types: ['grass'],
            };
          });

          this.pokemonDataService.pokemonList = list;
          this.pokemonDataService.updateLocalStorage();
          return this.pokemonDataService.pokemonList;
        })
      );
  }

  // Fetch a Pokemon with extensive details and add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    // Return it from cache if available with details
    if (this.pokemonDataService.pokemonList) {
      const cachedPokemon = this.pokemonDataService.pokemonList.find(
        (pokemon) => pokemon.id === Number(pokemonId)
      );
      if (cachedPokemon && cachedPokemon.model_type === 'full') {
        return of(cachedPokemon as PokemonFull);
      }
    }
    // Else fetch details from API and add the details to the cached pokemon
    return this.apollo
      .watchQuery<PokemonFullResponse, PokemonFullQueryParams>({
        query: GET_POKEMON_FULL,
        variables: { id: pokemonId },
      })
      .valueChanges.pipe(
        map((response) => {
          const pokemon: PokemonFull = {
            ...response.data.pokemon_v2_pokemon[0],
            model_type: 'full',
          };
          return this.pokemonDataService.storePokemonInCache(pokemon);
        })
      );
  }

  // Return the list of captured pokemon from the cache or API
  getCapturedPokemon(): Observable<Pokemon[]> {
    return this.fetchAllPokemonLight().pipe(
      map((pokemonList: Pokemon[]) =>
        pokemonList.filter((pokemon) => pokemon.captured)
      )
    );
  }
}
