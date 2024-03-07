import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

import { PokemonNameListResponse } from '@models/pokemon.model';

import { ApolloQueryResult } from '@apollo/client';
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

  fetchAllPokemonNames(): Observable<PokemonNameListResponse> {
    const cachedList: string | null = this.localStorageService.getItem('list');
    const currentTime: number = new Date().getTime();

    if (cachedList) {
      const { expiringTime, list } = JSON.parse(cachedList);
      if (currentTime < expiringTime) {
        console.log('cached list exists', list);
        return of(list);
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
        tap((list: PokemonNameListResponse) => {
          const ttl = 7 * 24 * 60 * 60 * 1000; // 1 week
          const expiringTime = currentTime + ttl;
          this.localStorageService.setItem(
            'list',
            JSON.stringify({ expiringTime, list })
          );
        })
      );
  }

  fetchPokemons(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: GET_POKEMONS,
      variables: {
        offset: this.offset,
        limit: this.limit,
      },
    }).valueChanges;
  }

  nextPokemons() {
    this.offset += this.limit;
    return this.fetchPokemons();
  }

  previousPokemons() {
    this.offset = Math.max(0, (this.offset -= this.limit));
    return this.fetchPokemons();
  }

  fetchPokemonDetails(pokemonId: number) {
    return this.apollo.watchQuery<any>({
      query: GET_POKEMON_DETAILS,
      variables: {
        id: pokemonId,
      },
    }).valueChanges;
  }
}
