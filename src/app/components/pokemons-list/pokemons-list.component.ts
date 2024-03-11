import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PokemonDataService } from '../../services/pokemon-data.service';
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
  limit: number = 10;
  offset: number = 0;
  list_length: number = 0;
  displayed_pokemons: Pokemon[] = [];
  previousPage: string | null = null;
  nextPage: string | null = null;

  constructor(
    private pokemonDataService: PokemonDataService,
    private pokeapiService: PokeapiService
  ) {}

  ngOnInit() {
    this.pokeapiService.fetchAllPokemonLight().subscribe((response) => {
      if (response) {
        if (this.pokemonDataService.pokemonList)
          this.list_length = this.pokemonDataService.pokemonList.length;
        this.slicePokemonList();
      }
    });
  }

  slicePokemonList() {
    if (this.pokemonDataService.pokemonList) {
      this.displayed_pokemons = this.pokemonDataService.pokemonList.slice(
        this.offset,
        this.offset + this.limit
      );
    }
  }

  onMorePokemons() {
    this.limit += this.limit;
    this.slicePokemonList();
  }

  onLessPokemons() {
    this.limit = Math.max(10, this.limit - 10);
    this.slicePokemonList();
  }
}
