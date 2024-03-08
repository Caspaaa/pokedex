import { Component, Input } from '@angular/core';
import {
  ActivatedRoute,
  RouterOutlet,
  RouterLink,
  Router,
} from '@angular/router';

import { PokeapiService } from '../../services/pokeapi.service';
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
  PokemonFull: PokemonFull | null = null;

  constructor(
    private pokeapiService: PokeapiService,
    private route: ActivatedRoute,
    private router: Router
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
      .subscribe((PokemonFull: PokemonFull) => {
        if (PokemonFull) {
          this.PokemonFull = PokemonFull;
        }
      });
  }
}
