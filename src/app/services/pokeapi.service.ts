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
import { stat } from 'fs';

export interface AllPokemonLightResponse {
  pokemon_v2_pokemon: Array<{
    id: number;
    name: string;
    pokemon_v2_pokemontypes: Array<{
      pokemon_v2_type: {
        name: string;
      };
    }>;
  }>;
}

interface RawPokemonFull {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: Array<{
    pokemon_v2_type: {
      name: string;
    };
  }>;
  pokemon_v2_pokemonstats: Array<{
    base_stat: number;
    pokemon_v2_stat: {
      name: string;
    };
  }>;
  pokemon_v2_pokemonmoves: Array<{
    level: number;
    pokemon_v2_move: {
      name: string;
      accuracy: number;
      pp: number;
      power: number;
    };
    version_group_id: number;
  }>;
}

export interface PokemonFullResponse {
  pokemon_v2_pokemon: Array<RawPokemonFull>;
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
    private apollo: Apollo // private pokemonDataService: PokemonDataService
  ) {
    // this.fetchAllPokemonLight().subscribe();
  }

  // Returns all pokemon names from cache
  // Or fetch them from API and assign them a captured value before storing the list to cache
  fetchAllPokemonLight(): Observable<Pokemon[]> {
    console.log('fetchAllPokemonLight');
    return this.apollo
      .watchQuery<AllPokemonLightResponse, PokemonLightQueryParams>({
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
            const types = rawPokemon.pokemon_v2_pokemontypes.map(
              (type) => type.pokemon_v2_type.name
            );

            return {
              ...rawPokemon,
              captured: Math.random() < 0.1,
              model_type: 'light',
              types,
            };
          });

          // this.pokemonDataService.pokemonList.next(list);
          // this.pokemonDataService.updateLocalStorage(list);

          return list;
        })
      );
  }

  // Fetch a Pokemon with extensive details and add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    console.log('fetchPokemonFull');
    // Return it from cache if available with details
    return this.apollo
      .watchQuery<PokemonFullResponse, PokemonFullQueryParams>({
        query: GET_POKEMON_FULL,
        variables: { id: pokemonId },
      })
      .valueChanges.pipe(
        map((response) => response.data.pokemon_v2_pokemon[0]),
        map((rawPokemon: RawPokemonFull) => {
          console.log('rawPokemonList', rawPokemon);
          const pokemonStats = rawPokemon.pokemon_v2_pokemonstats.map(
            (stat) => {
              return {
                name: stat.pokemon_v2_stat.name,
                value: stat.base_stat,
              };
            }
          );
          const pokemonMoves = rawPokemon.pokemon_v2_pokemonmoves.map(
            (move) => {
              return {
                name: move.pokemon_v2_move.name,
                level: move.level,
                accuracy: move.pokemon_v2_move.accuracy,
                pp: move.pokemon_v2_move.pp,
                power: move.pokemon_v2_move.power,
              };
            }
          );
          const types = rawPokemon.pokemon_v2_pokemontypes.map(
            (type) => type.pokemon_v2_type.name
          );

          // TODO - remove pokemon raw graphql props still on object
          // this.pokemonDataService.storePokemonInCache(pokemon);
          return buildPokemonFull(
            rawPokemon,
            pokemonStats,
            pokemonMoves,
            types
          );
        })
      );
  }
}

const buildPokemonFull = (
  rawPokemonFull: RawPokemonFull,
  stats: any[],
  moves: any[],
  types: string[]
): PokemonFull => ({
  id: rawPokemonFull.id,
  name: rawPokemonFull.name,
  height: rawPokemonFull.height,
  weight: rawPokemonFull.weight,
  moves,
  stats,
  types,
  captured: false,
  model_type: 'full',
});
