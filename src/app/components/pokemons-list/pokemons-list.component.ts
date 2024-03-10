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
  previousPage: string | null = null;
  nextPage: string | null = null;
  isLoading: boolean = false;

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeapiService
      .fetchAllPokemonLight()
      .subscribe((pokemonList: Pokemon[]) => {
        this.pokemons = pokemonList;
      });
  }

  // onNextPokemons() {
  //   this.pokeapiService.nextPokemons().subscribe((nextPokemons: Pokemon[]) => {
  //     this.pokemons = nextPokemons;
  //   });
  // }

  // onPreviousPokemons() {
  //   this.pokeapiService
  //     .previousPokemons()
  //     .subscribe((previousPokemons: PokemonBasic[]) => {
  //       this.pokemons = previousPokemons;
  //     });
  // }
}
