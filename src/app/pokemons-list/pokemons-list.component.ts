import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../pokeapi.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemons-list.component.html',
  styleUrl: './pokemons-list.component.css',
})
export class PokemonsListComponent implements OnInit {
  pokemons: Array<{ name: string; url: string }> = [];
  filteredPokemons: Array<{ name: string; url: string }> = [];
  previousPage: string | null = null;
  nextPage: string | null = null;
  isLoading: boolean = false;

  // why
  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    // this.loadPokemons();
    // this.loadAllPokemons();
    this.pokeapiService.fetchPokemons().subscribe(({ data, loading }) => {
      this.pokemons = data.pokemon_v2_pokemon;
      this.isLoading = loading;
    });
  }

  // loadPokemons(url: string = 'https://pokeapi.co/api/v2/pokemon?limit=20') {
  //   this.isLoading = true;
  //   this.pokeapiService.fetchPokemons(url).subscribe({
  //     next: (data) => {
  //       if (data) {
  //         this.pokemons = data.results;
  //         this.previousPage = data.previous;
  //         this.nextPage = data.next;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('something wrong occurred: ' + error);
  //       this.isLoading = false;
  //     },
  //     complete() {
  //       console.log('done');
  //     },
  //   });
  // }

  // loadAllPokemons() {
  //   this.isLoading = true;
  //   this.pokeapiService.fetchAllPokemonse().subscribe((pokemons) => {
  //     this.pokemons = pokemons;
  //     this.filteredPokemons = pokemons;
  //     this.isLoading = false;
  //   });
  // }

  // onNextPage() {
  //   if (this.nextPage) this.loadPokemons(this.nextPage);
  // }

  // onPreviousPage() {
  //   if (this.previousPage) this.loadPokemons(this.previousPage);
  // }
}
