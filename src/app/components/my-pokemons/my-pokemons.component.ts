import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Pokemon } from '@models/pokemon.model';
import { tap } from 'rxjs';
import { PokemonDataService } from '../../services/pokemon-data.service';

@Component({
  selector: 'app-my-pokemons',
  standalone: true,
  imports: [NgFor],
  templateUrl: './my-pokemons.component.html',
  styleUrl: './my-pokemons.component.css',
})
export class MyPokemonsComponent {
  private pokemonDataService = inject(PokemonDataService);
  public capturedPokemons: Pokemon[] = [];

  constructor() {}

  ngOnInit() {
    this.pokemonDataService.pokemonList
      .pipe(tap((list) => list.filter((pokemon) => pokemon.captured)))
      .subscribe();
  }
}
