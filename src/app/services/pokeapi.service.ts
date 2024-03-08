import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

import {
  PokemonBasic,
  PokemonFull,
  PokemonFullListResponse,
  PokemonListResponse,
  PokemonLight,
  PokemonLightListResponse,
} from '@models/pokemon.model';

import {
  GET_POKEMONS,
  GET_POKEMON_DETAILS,
  GET_ALL_POKEMON_NAMES,
} from '../queries/pokeapi.queries';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private limit = 9;
  private offset = 0;

  constructor(
    private apollo: Apollo,
    private localStorageService: LocalStorageService
  ) {}

  // Fetch all Pokemon names (useful for search input)
  //  - Returns from cache if available
  //  - If not, create a random captured status for each pokemon and store the list in localStorage
  fetchAllPokemonLight(): Observable<PokemonLight[]> {
    const cachedList: string | null = this.localStorageService.getItem('list');
    const currentTime: number = new Date().getTime();

    if (cachedList) {
      const { expiringTime, allPokemons } = JSON.parse(cachedList);
      if (currentTime < expiringTime) {
        return of(allPokemons);
      }
    }

    return this.apollo
      .watchQuery<any>({
        query: GET_ALL_POKEMON_NAMES,
        variables: {
          offset: 0,
          limit: 1500,
        },
      })
      .valueChanges.pipe(
        map((list: PokemonLightListResponse) => list.data.pokemon_v2_pokemon),
        map((list: PokemonLight[]) =>
          list.map((pokemon) => ({
            ...pokemon,
            captured: Math.random() < 0.1,
          }))
        ),
        tap((list: PokemonLight[]) => {
          const ttl = 7 * 24 * 60 * 60 * 1000; // 1 week
          const expiringTime = currentTime + ttl;
          this.localStorageService.setItem(
            'list',
            JSON.stringify({ expiringTime, allPokemons: list })
          );
        })
      );
  }

  // Fetch a chunk of Pokemons with minimal details
  fetchPokemons(): Observable<PokemonBasic[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_POKEMONS,
        variables: {
          offset: this.offset,
          limit: this.limit,
        },
      })
      .valueChanges.pipe(
        map((list: PokemonListResponse) => list.data.pokemon_v2_pokemon)
      );
  }

  nextPokemons() {
    this.offset += this.limit;
    return this.fetchPokemons();
  }

  previousPokemons() {
    this.offset = Math.max(0, (this.offset -= this.limit));
    return this.fetchPokemons();
  }

  // Fetch a chunk of Pokemons with extensive details + add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    return this.apollo
      .watchQuery<any>({
        query: GET_POKEMON_DETAILS,
        variables: {
          id: pokemonId,
        },
      })
      .valueChanges.pipe(
        map((list: PokemonFullListResponse) => {
          const pokemon = list.data.pokemon_v2_pokemon[0];
          const isPokemonCaptured = this.isPokemonCaptured(pokemon.id);
          return { ...pokemon, captured: isPokemonCaptured };
        })
      );
  }

  // Returns the captured status of a Pokemon from the cached name list
  isPokemonCaptured(id: number): boolean {
    const { _, allPokemons } = JSON.parse(
      this.localStorageService.getItem('list') || '[]'
    );
    if (!allPokemons) return false;
    const isCaptured = allPokemons.find(
      (pokemon: PokemonLight) => pokemon.id === id
    ).captured;
    return isCaptured;
  }

  getCapturedPokemon(): Observable<PokemonLight[]> {
    return this.fetchAllPokemonLight().pipe(
      map((pokemonList: PokemonLight[]) =>
        pokemonList.filter((pokemon) => pokemon.captured)
      )
    );
  }
}
