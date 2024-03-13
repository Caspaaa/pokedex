import { Injectable } from '@angular/core';
import { PokemonDataService } from './pokemon-data.service';
import { PokemonLight } from '@models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class CapturedPokemonsService {
  constructor(private pokemonDataService: PokemonDataService) {}

  toggleCapturedStatus(id: number): void {
    const currentList = this.pokemonDataService.pokemonList.getValue();
    const pokemonIndex = currentList.findIndex(
      (pokemon) => pokemon.id === Number(id)
    );

    if (pokemonIndex !== -1) {
      currentList[pokemonIndex].captured = !currentList[pokemonIndex].captured;

      this.pokemonDataService.pokemonList.next(currentList);
      this.pokemonDataService.updateLocalStorage(currentList);
    } else {
    }
  }
}
