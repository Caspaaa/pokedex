import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';

import {
  PokemonBasic,
  PokemonListResponse,
  PokemonLight,
} from '@models/pokemon.model';
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
  pokemons: Array<PokemonBasic> = [];
  previousPage: string | null = null;
  nextPage: string | null = null;
  isLoading: boolean = false;

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeapiService
      .fetchPokemons()
      .subscribe((pokemonList: PokemonBasic[]) => {
        this.pokemons = pokemonList;
      });
  }

  onNextPokemons() {
    this.pokeapiService
      .nextPokemons()
      .subscribe((nextPokemons: PokemonBasic[]) => {
        this.pokemons = nextPokemons;
      });
  }

  onPreviousPokemons() {
    this.pokeapiService
      .previousPokemons()
      .subscribe((previousPokemons: PokemonBasic[]) => {
        this.pokemons = previousPokemons;
      });
  }
}
