import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PokemonDataService } from '../../services/pokemon-data.service';
import { PokeapiService } from '../../services/pokeapi.service';
import { Pokemon } from '@models/pokemon.model';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';
import { PokemonTileComponent } from '../pokemon-tile/pokemon-tile.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PokemonSearchComponent,
    PokemonTileComponent,
    NgStyle,
  ],
  templateUrl: './pokemons-list.component.html',
  styleUrl: './pokemons-list.component.css',
})
export class PokemonsListComponent implements OnInit {
  CHUNK: number = 8;
  limit: number = this.CHUNK;
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
    console.log('list component init');
    this.pokemonDataService.pokemonList
      .pipe(
        tap((list) => {
          this.list_length = list.length;
          this.displayed_pokemons = this.slicePokemonList(list);
        })
      )
      .subscribe();
  }

  slicePokemonList(list: Pokemon[]) {
    return list.slice(this.offset, this.offset + this.limit);
  }

  onMorePokemons() {
    this.limit += this.limit;
    this.displayed_pokemons = this.slicePokemonList(this.displayed_pokemons);
  }

  onLessPokemons() {
    this.limit = Math.max(this.CHUNK, this.limit - this.CHUNK);
    this.displayed_pokemons = this.slicePokemonList(this.displayed_pokemons);
  }
}
