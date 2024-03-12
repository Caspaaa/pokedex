import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { map } from 'rxjs';
import { PokemonFull, PokemonLight } from '@models/pokemon.model';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';
import { PokeapiService } from '../../services/pokeapi.service';
import { CapturedPokemonsService } from '../../services/captured-pokemons.service';
import { PokemonDataService } from '../../services/pokemon-data.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    PokemonSearchComponent,
    CommonModule,
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css',
})
export class PokemonDetailComponent {
  pokemonFull: PokemonFull | null = null;
  @ViewChild('buttonPrevious')
  buttonPrevious: ElementRef<HTMLButtonElement> | null = null;
  @ViewChild('buttonNext') buttonNext: ElementRef<HTMLButtonElement> | null =
    null;
  elementRef: any;

  constructor(
    private pokeapiService: PokeapiService,
    private pokemonDataService: PokemonDataService,
    private route: ActivatedRoute,
    private capturePokemonsService: CapturedPokemonsService
  ) {}

  ngOnInit() {
    if (!this.pokemonDataService.pokemonList) {
      this.pokeapiService.fetchAllPokemonLight().subscribe();
    }

    const UriPokemonId = this.route.params.pipe(map((params) => params['id']));

    UriPokemonId.subscribe((id) => {
      this.loadPokemonFull(id);
    });
  }

  loadPokemonFull(id: number) {
    this.pokeapiService
      .fetchPokemonFull(id)
      .subscribe((pokemon: PokemonFull) => {
        if (pokemon) {
          this.pokemonFull = pokemon;
        }
      });
  }

  togglePokemonCapture() {
    if (this.pokemonFull) {
      this.pokemonFull.captured = !this.pokemonFull?.captured;
      this.capturePokemonsService.toggleCapturedStatus(this.pokemonFull.id);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.buttonPrevious)
      if (event.key === 'ArrowLeft') {
        if (this.buttonPrevious) this.buttonPrevious.nativeElement.click();
      } else if (event.key === 'ArrowRight') {
        if (this.buttonNext) this.buttonNext.nativeElement.click();
      }
  }
}
