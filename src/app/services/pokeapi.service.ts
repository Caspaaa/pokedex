import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

import {
  PokemonBasic,
  PokemonFull,
  PokemonFullResponse,
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
  // List used as layer between application and cache
  private pokemonList: (PokemonLight | PokemonFull)[] | null = null;

  constructor(
    private apollo: Apollo,
    private localStorageService: LocalStorageService
  ) {
    this.loadPokemonListFromCache();
  }

  // Copy pokemon list from localStorage into a local variable
  loadPokemonListFromCache() {
    const cachedList: string | null = this.localStorageService.getItem('list');
    const currentTime: number = new Date().getTime();
    if (cachedList) {
      const {
        expiringTime,
        allPokemons,
      }: {
        expiringTime: number;
        allPokemons: (PokemonLight | PokemonFull)[];
      } = JSON.parse(cachedList);
      if (currentTime < expiringTime) {
        this.pokemonList = allPokemons;
      }
    }
  }

  // Update cache with local pokemon list
  updateLocalStorage() {
    if (this.pokemonList) {
      const currentTime = new Date().getTime();
      const expiringTime = currentTime + 7 * 24 * 60 * 60 * 1000; // 1 week
      this.localStorageService.setItem(
        'list',
        JSON.stringify({
          expiringTime,
          allPokemons: this.pokemonList,
        })
      );
    }
  }

  // Returns all pokemon names from cache
  // Or fetch them from API and assign them a captured value before storing the list to cache
  fetchAllPokemonLight(): Observable<(PokemonLight | PokemonFull)[]> {
    if (this.pokemonList) return of(this.pokemonList);

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
        map((list: PokemonLight[]) => {
          // Add a random captured value to each pokemon so our Pokedex is not empty
          list = list.map((pokemon) => ({
            ...pokemon,
            captured: Math.random() < 0.1,
          }));

          this.pokemonList = list;
          this.updateLocalStorage();
          return this.pokemonList;
        })
      );
  }

  // Returns a chunk of Pokemons with basic details
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

  // Fetch a Pokemon with extensive details and add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    // Return it from cache if available with details
    if (this.pokemonList) {
      const cachedPokemon = this.pokemonList.find(
        (pokemon: PokemonLight | PokemonFull) =>
          pokemon.id === Number(pokemonId)
      );
      if (cachedPokemon && 'weight' in cachedPokemon) {
        return of(cachedPokemon);
      }
    }
    // Else fetch details from API and add the details to the cached pokemon
    return this.apollo
      .watchQuery<any>({
        query: GET_POKEMON_DETAILS,
        variables: { id: pokemonId },
      })
      .valueChanges.pipe(
        map(
          (pokemon: PokemonFullResponse) => pokemon.data.pokemon_v2_pokemon[0]
        ),
        map((pokemon: PokemonFull) => {
          return this.storePokemonInCache(pokemon);
        })
      );
  }

  // Adds more details to a pokemon in the cached list and returns it
  storePokemonInCache(pokemonFull: PokemonFull): PokemonFull {
    let pokemonToStore: PokemonFull = { ...pokemonFull };
    if (!this.pokemonList) {
      this.pokemonList = [];
    }
    const pokemonIndex = this.pokemonList.findIndex(
      (pokemon) => pokemon.id === pokemonFull.id
    );

    if (pokemonIndex) {
      pokemonToStore = {
        ...this.pokemonList[pokemonIndex],
        ...pokemonToStore,
      };
      this.pokemonList[pokemonIndex] = pokemonToStore;
    }

    this.updateLocalStorage();

    return pokemonToStore;
  }

  // Return the list of captured pokemon from the cache or API
  getCapturedPokemon(): Observable<(PokemonLight | PokemonFull)[]> {
    return this.fetchAllPokemonLight().pipe(
      map((pokemonList: (PokemonLight | PokemonFull)[]) =>
        pokemonList.filter((pokemon) => pokemon.captured)
      )
    );
  }
}
