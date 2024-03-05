import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';

import { Pokemon } from '@models/pokemon.model';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PokemonSearchComponent,
  ],
  templateUrl: './pokemons-list.component.html',
  styleUrl: './pokemons-list.component.css',
})
export class PokemonsListComponent implements OnInit {
  pokemons: Array<Pokemon> = [];
  names: Array<{ id: number; name: string }> = [];
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
    console.log('loadAllPokemonNames');
    this.pokeapiService.fetchAllPokemonNames().subscribe((response) => {
      if (response) {
        console.log('response');
        this.names = response.data.pokemon_v2_pokemon;
        console.log('this.names.length', this.names.length);
      }
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
