import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

import { Pokemon, PokemonListResponse } from '@models/pokemon.model';
import { ApolloQueryResult } from '@apollo/client';

const GET_POKEMONS = gql`
  query getPokemons($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(offset: $offset, limit: $limit) {
      base_experience
      height
      id
      name
      order
      is_default
      pokemon_v2_pokemonsprites {
        id
        sprites
      }
    }
  }
`;

const GET_ALL_POKEMONS_NAMES = gql`
  query getPokemons($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(offset: $offset, limit: $limit) {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private limit = 9;
  private offset = 0;

  constructor(private apollo: Apollo) {}

  fetchAllPokemonNames(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_POKEMONS_NAMES,
      variables: {
        offset: 0,
        limit: 1300,
      },
    }).valueChanges;
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
}
