import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

import { PokeapiService } from '../../services/pokeapi.service';

import { Pokemon } from '@models/pokemon.model';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './pokemons-list.component.html',
  styleUrl: './pokemons-list.component.css',
})
export class PokemonsListComponent implements OnInit {
  pokemons: Array<Pokemon> = [];
  names: Array<{ name: string; url: string }> = [];
  filteredPokemons: Array<{ name: string; url: string }> = [];
  previousPage: string | null = null;
  nextPage: string | null = null;
  isLoading: boolean = false;

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeapiService.fetchPokemons().subscribe(({ data }) => {
      this.pokemons = data.pokemon_v2_pokemon;
      this.loadAllPokemonNames();
    });
  }

  loadAllPokemonNames() {
    this.pokeapiService.fetchAllPokemonNames().subscribe(({ data }) => {
      this.names = data.pokemon_v2_pokemon;
    });
  }

  onNextPokemons() {
    this.pokeapiService.nextPokemons().subscribe(({ data }) => {
      this.pokemons = data.pokemon_v2_pokemon;
    });
  }

  onPreviousPokemons() {
    this.pokeapiService.previousPokemons().subscribe(({ data }) => {
      this.pokemons = data.pokemon_v2_pokemon;
    });
  }
}
