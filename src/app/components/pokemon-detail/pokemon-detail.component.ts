import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { PokemonFull } from '@models/pokemon.model';
import { map } from 'rxjs';
import { CapturedPokemonsService } from '../../services/captured-pokemons.service';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';

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
  pokemonId: number | null = null;
  @ViewChild('buttonPrevious')
  buttonPrevious: ElementRef<HTMLButtonElement> | null = null;
  @ViewChild('buttonNext') buttonNext: ElementRef<HTMLButtonElement> | null =
    null;
  elementRef: any;

  constructor(
    private pokeapiService: PokeapiService,
    private route: ActivatedRoute,
    private capturePokemonsService: CapturedPokemonsService
  ) {}

  ngOnInit() {
    const UriPokemonId = this.route.params.pipe(map((params) => params['id']));

    UriPokemonId.subscribe((id) => {
      this.loadPokemonFull(id);
      this.pokemonId = id;
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
    if (this.pokemonId) {
      this.capturePokemonsService.toggleCapturedStatus(this.pokemonId);
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
