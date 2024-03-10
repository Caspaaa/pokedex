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

  constructor(
    private apollo: Apollo,
    private localStorageService: LocalStorageService
  ) {}

  // TODO : variable globale avec la liste - travailler avec cette liste et à chaque fin d'action, update le localstorage avec toujours la même methode

  // Fetch all Pokemon names (useful for search input)
  //  - Returns from cache if available
  //  - If not, create a random captured status for each pokemon and store the list in localStorage
  fetchAllPokemonLight(): Observable<any> {
    console.log('fetchAllPokemonLight');
    const cachedList: string | null = this.localStorageService.getItem('list');
    const currentTime: number = new Date().getTime();

    if (cachedList) {
      const { expiringTime, allPokemons } = JSON.parse(cachedList);
      if (currentTime < expiringTime) {
        const pokemons: (PokemonLight | PokemonFull)[] = allPokemons;

        return of(pokemons);
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
        tap((list: PokemonLight[]) => {
          const ttl = 7 * 24 * 60 * 60 * 1000; // 1 week
          const expiringTime = currentTime + ttl;
          list = list.map((pokemon) => ({
            ...pokemon,
            captured: Math.random() < 0.1,
          }));
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

  // Fetch a Pokemon with extensive details and add the captured property
  fetchPokemonFull(pokemonId: number): Observable<PokemonFull> {
    // check cache

    const cachedList: string | null = this.localStorageService.getItem('list');
    const currentTime: number = new Date().getTime();

    if (cachedList) {
      const {
        expiringTime,
        allPokemons,
      }: { expiringTime: number; allPokemons: (PokemonLight | PokemonFull)[] } =
        JSON.parse(cachedList);

      const pokemonIndex = allPokemons.findIndex(
        (pokemon) => pokemon.id === Number(pokemonId)
      );

      const cachedPokemon = allPokemons[pokemonIndex];

      if ('weight' in cachedPokemon) {
        return of(cachedPokemon);
      }
    }
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

  storePokemonInCache(pokemonFull: PokemonFull): PokemonFull {
    const cachedList: string | null = this.localStorageService.getItem('list');
    const currentTime: number = new Date().getTime();

    if (cachedList) {
      const {
        expiringTime,
        allPokemons,
      }: { expiringTime: number; allPokemons: (PokemonLight | PokemonFull)[] } =
        JSON.parse(cachedList);
      if (currentTime < expiringTime) {
        const pokemonIndex: number = allPokemons.findIndex(
          (pokemon) => pokemon.id === pokemonFull.id
        );
        const newPokemon: PokemonFull = {
          ...allPokemons[pokemonIndex],
          ...pokemonFull,
        };

        allPokemons[pokemonIndex] = newPokemon;

        this.localStorageService.setItem(
          'list',
          JSON.stringify({
            expiringTime,
            allPokemons: allPokemons,
          })
        );

        return newPokemon;
      }
    }
    return pokemonFull;
  }

  // Returns the captured status of a Pokemon from the cached name list
  isPokemonCaptured(id: number) {
    const cachedList: string | null = this.localStorageService.getItem('list');

    if (cachedList) {
      const {
        expiringTime,
        allPokemons,
      }: { expiringTime: number; allPokemons: (PokemonLight | PokemonFull)[] } =
        JSON.parse(cachedList);

      if (!allPokemons) return false;

      const pokemonIndex = allPokemons.findIndex(
        (pokemon) => pokemon.id === Number(id)
      );

      return allPokemons[pokemonIndex]?.captured;
    }
    return false;
  }

  getCapturedPokemon(): Observable<(PokemonLight | PokemonFull)[]> {
    return this.fetchAllPokemonLight().pipe(
      map((pokemonList: (PokemonLight | PokemonFull)[]) =>
        pokemonList.filter((pokemon) => pokemon.captured)
      )
    );
  }
}
