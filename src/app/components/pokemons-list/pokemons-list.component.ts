import { CommonModule, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Pokemon } from '@models/pokemon.model';
import { tap } from 'rxjs';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonDataService } from '../../services/pokemon-data.service';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';
import { PokemonTileComponent } from '../pokemon-tile/pokemon-tile.component';

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
  list: Pokemon[] = [];
  list_length: number = 0;
  displayed_pokemons: Pokemon[] = [];
  previousPage: string | null = null;
  nextPage: string | null = null;
  @ViewChild('buttonPrevious')
  buttonPrevious: ElementRef<HTMLButtonElement> | null = null;
  @ViewChild('buttonNext')
  buttonNext: ElementRef<HTMLButtonElement> | null = null;

  constructor(
    private pokemonDataService: PokemonDataService,
    private pokeapiService: PokeapiService
  ) {}

  ngOnInit() {
    this.pokemonDataService.pokemonList
      .pipe(
        tap((list) => {
          this.list = list;
          this.list_length = list.length;
          this.displayed_pokemons = this.slicePokemonList(list);
        })
      )
      .subscribe();
  }

  slicePokemonList(list: Pokemon[]) {
    return list.slice(this.offset, this.limit);
  }

  onMorePokemons() {
    this.offset = this.limit;
    this.limit += this.CHUNK;
    this.displayed_pokemons = this.slicePokemonList(this.list);
  }

  onLessPokemons() {
    this.limit = this.offset;
    this.offset = Math.max(0, this.offset - this.CHUNK);
    this.displayed_pokemons = this.slicePokemonList(this.list);
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
