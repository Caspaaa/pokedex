import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Pokemon, PokemonName } from '@models/pokemon.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pokemon-input',
  templateUrl: './pokemon-input.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  standalone: true,
})
export class PokemonSearchComponent implements OnInit {
  @Input() names: PokemonName[] = [];

  public searchControl = new FormControl();
  public searchResults: PokemonName[] = [];

  public noResult = false;

  constructor() {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged() // Only emit when the current value is different than the last.
      )
      .subscribe((searchInput) => {
        console.log('searchInput', searchInput);
        this.performSearch(searchInput);
      });
  }

  performSearch(searchInput: string) {
    console.log('performSearch');
    if (!searchInput) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.names.filter((pokemon: PokemonName) =>
      pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    this.noResult = this.searchResults.length === 0;
  }
}
