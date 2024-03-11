import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyPokemonsComponent } from '../my-pokemons/my-pokemons.component';
import { NgIf, NgFor } from '@angular/common';
import { PokemonDataService } from '../../services/pokemon-data.service';
import { Pokemon } from '@models/pokemon.model';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [MyPokemonsComponent, NgFor],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent {
  @Input() isOpen: boolean = false;

  @Output() closePanel = new EventEmitter<void>();

  public capturedPokemons: Pokemon[] = [];

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit() {
    if (this.pokemonDataService.pokemonList) {
      this.capturedPokemons = this.pokemonDataService.pokemonList.filter(
        (pokemon) => pokemon.captured
      );
    }
  }

  close() {
    this.closePanel.emit();
  }
}
