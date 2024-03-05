import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonDetails } from '@models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css',
})
export class PokemonDetailComponent {
  pokemonDetails: PokemonDetails | null = null;
  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemonDetails();
  }

  loadPokemonDetails(): void {
    this.pokeapiService.fetchPokemonDetails().subscribe((response) => {
      if (response) {
        this.pokemonDetails = response.data.pokemon_v2_pokemon[0];
      }
    });
  }
}
