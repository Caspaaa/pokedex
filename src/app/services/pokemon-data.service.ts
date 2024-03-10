import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Pokemon, PokemonFull } from '@models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonDataService {
  // List used as layer between application and cache
  public pokemonList: Pokemon[] | null = null;

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
}
