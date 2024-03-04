import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Apollo, gql } from 'apollo-angular';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

const GET_POKEMONS = gql`
  query getPokemons {
    pokemon_v2_pokemon(offset: 0, limit: 20) {
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
  constructor(private apollo: Apollo) {}

  fetchPokemons() {
    return this.apollo.watchQuery<any>({
      query: GET_POKEMONS,
    }).valueChanges;
  }
}
// export class PokeapiService {
//   private allPokemonsCache: Array<{ name: string; url: string }> | null = null;

//   constructor(
//     private http: HttpClient,
//     private localStorageService: LocalStorageService
//   ) {}

//   fetchPokemons(
//     url: string = 'https://pokeapi.co/api/v2/pokemon?limit=20'
//   ): Observable<PokemonListResponse> {
//     const cachedData: PokemonListResponse =
//       this.localStorageService.getItem(url);
//     if (cachedData !== null) {
//       // of() function is use because we need to return an Observable in both cases
//       return of(cachedData);
//     } else {
//       return this.http.get<PokemonListResponse>(url).pipe(
//         // why do we need to use pipe()
//         tap((data) => this.localStorageService.setItem(url, data)),
//         catchError(
//           (error: HttpErrorResponse): Observable<PokemonListResponse> => {
//             console.error('Error fetching Pokémon list', error);
//             return throwError(
//               () => new Error('An error occurred while fetching the pokemons')
//             );
//           }
//         )
//       );
//     }
//   }

//   fetchAllPokemonse(): Observable<Array<{ name: string; url: string }>> {
//     const cachedPokemons = this.localStorageService.getItem('allPokemons');
//     if (cachedPokemons) {
//       this.allPokemonsCache = cachedPokemons;
//       return of(cachedPokemons);
//     } else {
//       return this.http
//         .get<any>('https://pokeapi.co/api/v2/pokemon?limit=100000')
//         .pipe(
//           map((response) => response.results),
//           tap((pokemons) => {
//             this.allPokemonsCache = pokemons;
//             this.localStorageService.setItem('allPokemons', pokemons);
//           })
//         );
//     }
//   }

//   getAllPokemonsCache(): Array<{ name: string; url: string }> | null {
//     return this.allPokemonsCache;
//   }
// }
