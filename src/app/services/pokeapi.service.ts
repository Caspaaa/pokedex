import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

import { PokemonNameListResponse } from '@models/pokemon.model';

import { ApolloQueryResult } from '@apollo/client';
import { ActivatedRoute } from '@angular/router';

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

const GET_POKEMON_DETAILS = gql`
  query getPokemonDetails($id: Int!) {
    pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      base_experience
      height
      id
      name
      order
      weight
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonmoves {
        move_id
        level
        pokemon_v2_move {
          name
          accuracy
          pp
          power
        }
      }
      pokemon_v2_pokemonspecy {
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private limit = 9;
  private offset = 0;

  constructor(
    private apollo: Apollo,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
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
        query: GET_ALL_POKEMONS_NAMES,
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

  fetchPokemonDetails() {
    // const pokemonId = this.route.snapshot.paramMap.get('id');
    console.log('this.route', this.route);
    return this.apollo.watchQuery<any>({
      query: GET_POKEMON_DETAILS,
      variables: {
        id: 1, // todo: replace this with uri param
      },
    }).valueChanges;
  }
}
