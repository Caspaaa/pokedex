import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
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
  public capturedPokemons: Pokemon[] = [];

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit() {
    this.pokemonDataService.pokemonList
      .pipe(tap((list) => list.filter((pokemon) => pokemon.captured)))
      .subscribe();
  }
}
