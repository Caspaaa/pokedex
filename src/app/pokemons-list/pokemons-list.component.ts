import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface Pokemon {
  base_experience: number;
  height: number;
  id: number;
  name: string;
  order: number;
  is_default: boolean;
  pokemon_v2_pokemonsprites: Array<{
    id: number;
    sprites: {
      front_default: string;
    };
  }>;
}

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemons-list.component.html',
  styleUrl: './pokemons-list.component.css',
})
export class PokemonsListComponent implements OnInit {
  pokemons: Array<Pokemon> = [];
  filteredPokemons: Array<{ name: string; url: string }> = [];
  previousPage: string | null = null;
  nextPage: string | null = null;
  isLoading: boolean = false;

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.pokeapiService.fetchPokemons().subscribe(({ data }) => {
      this.pokemons = data.pokemon_v2_pokemon;
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
