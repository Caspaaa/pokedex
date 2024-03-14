import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

import { PokemonDataService } from './pokemon-data.service';

import { Router } from '@angular/router';
import { Pokemon, PokemonFull, PokemonLight } from '@models/pokemon.model';

import {
  GET_ALL_POKEMON_LIGHT,
  GET_POKEMON_FULL,
} from '../queries/pokeapi.queries';

import { ToastrService } from 'ngx-toastr';

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

export interface PokemonFullResponse {
  pokemon_v2_pokemon: Array<{
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
  }>;
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
    private pokemonDataService: PokemonDataService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  // Returns all pokemon names from cache
  // Or fetch them from API and assign them a captured value before storing the list to cache
  fetchAllPokemonLight(): Observable<Pokemon[]> {
    return this.pokemonDataService.pokemonList.pipe(
      switchMap((list) => {
        if (list.length > 0) return of(list);

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

              this.pokemonDataService.pokemonList.next(list);
              this.pokemonDataService.updateLocalStorage(list);

              return list;
            }),
            catchError((error) => {
              this.toastr.error(
                'The list of pokemon could not be loaded',
                'Something went wrong'
              );
              this.router.navigate(['/error']);

              return of(error);
            })
          );
      })
    );
  }

  // Fetch a Pokemon with extensive details and add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    // Return it from cache if available with details
    return this.pokemonDataService.pokemonList.pipe(
      switchMap((list) => {
        const cachedPokemon = list.find(
          (pokemon) => pokemon.id === Number(pokemonId)
        );
        if (cachedPokemon && cachedPokemon.model_type === 'full') {
          return of(cachedPokemon);
        } else {
          return this.apollo
            .watchQuery<PokemonFullResponse, PokemonFullQueryParams>({
              query: GET_POKEMON_FULL,
              variables: { id: pokemonId },
            })
            .valueChanges.pipe(
              map((response) => response.data.pokemon_v2_pokemon[0]),
              map((rawPokemon) => {
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
                const pokemon: any = {
                  ...cachedPokemon,
                  model_type: 'full',
                  stats: pokemonStats,
                  moves: pokemonMoves,
                };
                // TODO - remove pokemon raw graphql props still on object
                this.pokemonDataService.storePokemonInCache(pokemon);
                return pokemon;
              }),
              catchError((error) => {
                console.log('error', error);
                this.toastr.error(
                  'This pokemon could not be found',
                  'Something went wrong'
                );
                this.router.navigate(['/error']);
                return of(error);
              })
            );
        }
      })
    );
  }
}
