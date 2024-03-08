import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { PokemonLight } from '@models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class CapturedPokemonsService {
  constructor(private localStorageService: LocalStorageService) {}

  toggleCapturedStatus(id: number): void {
    let { expiringTime, allPokemons } = JSON.parse(
      this.localStorageService.getItem('list')
    );
    const pokemonIndex = allPokemons.findIndex(
      (pokemon: PokemonLight) => pokemon.id === id
    );
    if (pokemonIndex !== -1) {
      allPokemons[pokemonIndex].captured = !allPokemons[pokemonIndex].captured;
      this.localStorageService.setItem(
        'list',
        JSON.stringify({ expiringTime, allPokemons })
      );
    }
  }
}
