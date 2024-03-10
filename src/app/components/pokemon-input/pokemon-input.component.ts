import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PokemonBasic, PokemonFull, PokemonLight } from '@models/pokemon.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';

@Component({
  selector: 'app-pokemon-input',
  templateUrl: './pokemon-input.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  standalone: true,
})
export class PokemonSearchComponent implements OnInit {
  public names: any = [];
  public searchControl = new FormControl();
  public searchResults: PokemonLight[] = [];

  public noResult = false;

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit(): void {
    this.loadAllPokemonLight();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged() // Only emit when the current value is different than the last.
      )
      .subscribe((searchInput) => {
        this.performSearch(searchInput);
      });
  }

  loadAllPokemonLight() {
    this.pokeapiService
      .fetchAllPokemonLight()
      .subscribe((pokemons: PokemonLight[]) => {
        if (pokemons) {
          this.names = pokemons;
        }
      });
  }

  performSearch(searchInput: string) {
    if (!searchInput) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.names.filter((pokemon: PokemonLight) =>
      pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    this.noResult = this.searchResults.length === 0;
  }
}
