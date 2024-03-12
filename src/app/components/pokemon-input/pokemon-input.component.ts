import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Pokemon } from '@models/pokemon.model';
import { PokemonDataService } from '../../services/pokemon-data.service';

@Component({
  selector: 'app-pokemon-input',
  templateUrl: './pokemon-input.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  standalone: true,
})
export class PokemonSearchComponent implements OnInit {
  public names: any = [];
  public searchControl = new FormControl();
  public searchResults: Pokemon[] = [];
  public showResults: boolean = false;
  public noResult = false;

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged() // Only emit when the current value is different than the last.
      )
      .subscribe((searchInput) => {
        this.showResults = true;
        this.performSearch(searchInput);
      });
  }

  performSearch(searchInput: string) {
    if (!searchInput) {
      this.searchResults = [];
      return;
    }
    if (this.pokemonDataService.pokemonList)
      this.searchResults = this.pokemonDataService.pokemonList.filter(
        (pokemon: Pokemon) =>
          pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
      );

    this.noResult = this.searchResults.length === 0;
  }

  hideResults() {
    this.showResults = false;
    this.searchControl.reset();
  }
}
