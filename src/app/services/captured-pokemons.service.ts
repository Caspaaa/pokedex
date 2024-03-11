import { Injectable } from '@angular/core';
import { PokemonDataService } from './pokemon-data.service';
import { PokemonLight } from '@models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class CapturedPokemonsService {
  constructor(private pokemonDataService: PokemonDataService) {}

  toggleCapturedStatus(id: number): void {
    const currentList = this.pokemonDataService.pokemonList;
    if (currentList) {
      const currentPokemon = currentList.find((pokemon) => pokemon.id);
      if (currentPokemon) currentPokemon.captured = !currentPokemon.captured;
      this.pokemonDataService.updateLocalStorage(currentList);
    }
  }
}
