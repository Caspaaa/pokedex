import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Pokemon } from '@models/pokemon.model';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
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

  constructor(
    private pokemonDataService: PokemonDataService,
    private router: Router
  ) {}

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
    this.pokemonDataService.pokemonList
      .pipe(
        tap((list) => {
          this.searchResults = list
            .filter((pokemon: Pokemon) =>
              pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .slice(0, 6);
        })
      )
      .subscribe();

    this.noResult = this.searchResults.length === 0;
  }

  hideResults() {
    this.showResults = false;
    this.searchControl.reset();
  }

  goToFirstResult(): void {
    if (this.searchResults.length > 0) {
      const firstResultId = this.searchResults[0].id;
      this.router.navigate(['/pokemon', firstResultId]);
      this.hideResults();
    }
  }
}
