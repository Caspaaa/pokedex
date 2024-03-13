import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyPokemonsComponent } from '../my-pokemons/my-pokemons.component';
import { NgIf, NgFor } from '@angular/common';
import { PokemonDataService } from '../../services/pokemon-data.service';
import { Pokemon } from '@models/pokemon.model';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { PokeapiService } from '../../services/pokeapi.service';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [MyPokemonsComponent, NgFor, RouterLink],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent {
  @Input() isOpen: boolean = false;

  @Output() closePanel = new EventEmitter<void>();

  public capturedPokemons: Pokemon[] = [];
  result: any;

  constructor(private pokemonApiService: PokeapiService) {}

  ngOnInit() {
    this.pokemonApiService
      .fetchAllPokemonLight()
      .pipe(
        tap((list) => {
          this.capturedPokemons = list.filter((pokemon) => pokemon.captured);
        })
      )
      .subscribe();
  }

  close() {
    this.closePanel.emit();
  }
}
