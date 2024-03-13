import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Pokemon, PokemonFull } from '@models/pokemon.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonDataService {
  // List used as layer between application and cache
  public pokemonList = new BehaviorSubject<Pokemon[]>([]);

  constructor(private localStorageService: LocalStorageService) {
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
        allPokemons: Pokemon[];
      } = JSON.parse(cachedList);
      if (currentTime < expiringTime) {
        this.pokemonList.next(allPokemons);
      }
    }
  }

  // Update cache with local pokemon list
  updateLocalStorage(pokemonList: Pokemon[]) {
    if (pokemonList) {
      const currentTime = new Date().getTime();
      const expiringTime = currentTime + 7 * 24 * 60 * 60 * 1000; // 1 week
      this.localStorageService.setItem(
        'list',
        JSON.stringify({
          expiringTime,
          allPokemons: pokemonList,
        })
      );
    }
  }

  // Adds more details to a pokemon in the cached list
  storePokemonInCache(pokemonFull: PokemonFull): void {
    const currentList = this.pokemonList.getValue();
    const pokemonIndex = currentList.findIndex(
      (pokemon) => pokemon.id === pokemonFull.id
    );
    if (pokemonIndex !== -1) {
      currentList[pokemonIndex] = {
        ...currentList[pokemonIndex],
        ...pokemonFull,
      };
    }
    this.updateLocalStorage(currentList);
  }
}
