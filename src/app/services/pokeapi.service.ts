import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { PokemonDataService } from './pokemon-data.service';

import {
  Pokemon,
  PokemonFull,
  PokemonLight,
  Stat,
} from '@models/pokemon.model';

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
  pokemon_v2_pokemon: {
    id: number;
    name: string;
    height: number;
    weight: number;
    pokemon_v2_pokemontypes: Array<{
      pokemon_v2_type: Array<{
        name: string;
      }>;
    }>;
    pokemon_v2_pokemonstats: Array<{
      base_stat: number;
      pokemon_v2_stat: Array<{
        name: string;
      }>;
    }>;
  };
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
  ) {
    this.fetchAllPokemonLight().subscribe();
  }

  // Returns all pokemon names from cache
  // Or fetch them from API and assign them a captured value before storing the list to cache
  // TODO - Fix type
  fetchAllPokemonLight(): Observable<Pokemon[] | Pokemon> {
    console.log('fetchAllPokemonLight');
    return this.pokemonDataService.pokemonList.pipe(
      switchMap((list) => {
        console.log('pokemon list in cache');
        if (list.length > 0) return list;
        else {
          console.log('no cache, fetchAllPokemonLight');
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
                // TODO - Set types
                const list = rawPokemonList.map((rawPokemon): PokemonLight => {
                  const typesResponse: any = rawPokemon.pokemon_v2_pokemontypes;
                  const rawTypesList: any = typesResponse.map(
                    (type: any) => type.pokemon_v2_type
                  );
                  const typesList: any = rawTypesList.map(
                    (item: any) => item.name
                  );
                  return {
                    ...rawPokemon,
                    captured: Math.random() < 0.1,
                    model_type: 'light',
                    types: typesList,
                  };
                });
                this.pokemonDataService.pokemonList.next(list);
                this.pokemonDataService.updateLocalStorage(list);
                return list;
              })
            );
        }
      })
    );
  }

  // Fetch a Pokemon with extensive details and add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    console.log('fetchPokemonFull');
    // Return it from cache if available with details
    return this.pokemonDataService.pokemonList.pipe(
      switchMap((list) => {
        const cachedPokemon = list.find(
          (pokemon) => pokemon.id === Number(pokemonId)
        );
        if (cachedPokemon && cachedPokemon.model_type === 'full') {
          return of(cachedPokemon as PokemonFull);
        } else {
          console.log('pokemon full is not in cache');
          return this.apollo
            .watchQuery<PokemonFullResponse, PokemonFullQueryParams>({
              query: GET_POKEMON_FULL,
              variables: { id: pokemonId },
            })
            .valueChanges.pipe(
              map((response) => {
                // TODO - Set types
                const pokemonResponse: any = response.data.pokemon_v2_pokemon;
                const pokemonData: any = pokemonResponse[0];
                const pokemonStats: any =
                  pokemonData.pokemon_v2_pokemonstats.map((stat: any) => {
                    return {
                      name: stat.pokemon_v2_stat.name,
                      value: stat.base_stat,
                    };
                  });
                // TODO - Set types
                const rawPokemonMoves: any =
                  pokemonData.pokemon_v2_pokemonmoves;
                const pokemonMoves = rawPokemonMoves.map((move: any) => {
                  return {
                    name: move.pokemon_v2_move.name,
                    level: move.level,
                    accuracy: move.pokemon_v2_move.accuracy,
                    pp: move.pokemon_v2_move.pp,
                    power: move.pokemon_v2_move.power,
                  };
                });

                // TODO - Fix this type
                const pokemon: any = {
                  ...cachedPokemon,
                  model_type: 'full',
                  stats: pokemonStats,
                  moves: pokemonMoves,
                };
                // TODO - remove pokemon raw graphql props still on object
                this.pokemonDataService.storePokemonInCache(pokemon);
                return pokemon as PokemonFull;
              })
            );
        }
      })
    );
  }
}
