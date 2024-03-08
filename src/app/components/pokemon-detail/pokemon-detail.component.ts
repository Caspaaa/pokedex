import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterLink } from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';
import { CapturedPokemonsService } from '../../services/captured-pokemons.service';
import { PokemonFull } from '@models/pokemon.model';
import { NgIf } from '@angular/common';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';
import { map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, PokemonSearchComponent],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css',
})
export class PokemonDetailComponent {
  pokemonFull: PokemonFull | null = null;

  constructor(
    private pokeapiService: PokeapiService,
    private route: ActivatedRoute,
    private capturePokemonsService: CapturedPokemonsService
  ) {}

  ngOnInit() {
    const UriPokemonId = this.route.params.pipe(map((params) => params['id']));

    UriPokemonId.subscribe((id) => {
      this.loadPokemonFull(id);
    });
  }

  loadPokemonFull(id: number) {
    this.pokeapiService
      .fetchPokemonFull(id)
      .subscribe((pokemonFull: PokemonFull) => {
        if (pokemonFull) {
          this.pokemonFull = pokemonFull;
        }
      });
  }

  togglePokemonCapture() {
    if (this.pokemonFull) {
      this.pokemonFull.captured = !this.pokemonFull?.captured;
      this.capturePokemonsService.toggleCapturedStatus(this.pokemonFull.id);
    }
  }
}
