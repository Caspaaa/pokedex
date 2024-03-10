import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { PokemonDataService } from '../../services/pokemon-data.service';
import { Pokemon } from '@models/pokemon.model';

@Component({
  selector: 'app-my-pokemons',
  standalone: true,
  imports: [NgFor],
  templateUrl: './my-pokemons.component.html',
  styleUrl: './my-pokemons.component.css',
})
export class MyPokemonsComponent {
  public capturedPokemons: Pokemon[] = [];

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit() {
    if (this.pokemonDataService.pokemonList) {
      this.capturedPokemons = this.pokemonDataService.pokemonList.filter(
        (pokemon) => pokemon.captured
      );
    }
  }
}
