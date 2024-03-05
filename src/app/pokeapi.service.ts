import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Apollo, gql } from 'apollo-angular';

interface Pokemon {
  base_experience: number;
  height: number;
  id: number;
  name: string;
  order: number;
  is_default: boolean;
  pokemon_v2_pokemonsprites: Array<{
    id: number;
    sprites: {
      front_default: string;
    };
  }>;
}

interface PokemonListResponse {
  data: {
    pokemon_v2_pokemon: Pokemon[];
  };
}

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

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private limit = 20;
  private offset = 0;

  constructor(private apollo: Apollo) {}

  fetchPokemons(): Observable<PokemonListResponse> {
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
