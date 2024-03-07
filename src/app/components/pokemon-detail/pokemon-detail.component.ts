import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonDetails } from '@models/pokemon.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css',
})
export class PokemonDetailComponent {
  pokemonDetails: PokemonDetails | null = null;
  constructor(
    private pokeapiService: PokeapiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPokemonDetails();
  }

  loadPokemonDetails(): void {
    const pokemonId: number = Number(this.route.snapshot.paramMap.get('id'));
    if (pokemonId) {
      this.pokeapiService
        .fetchPokemonDetails(pokemonId)
        .subscribe((response) => {
          if (response) {
            this.pokemonDetails = response.data.pokemon_v2_pokemon[0];
          }
        });
    }
  }
}
