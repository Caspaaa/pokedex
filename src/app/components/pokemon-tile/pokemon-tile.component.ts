import { Component, Input } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pokemon } from '@models/pokemon.model';
import { getGradientForType, PokemonType } from '../../utils/types-gradients';

@Component({
  selector: 'app-pokemon-tile',
  standalone: true,
  imports: [RouterLink, NgFor, NgStyle],
  templateUrl: './pokemon-tile.component.html',
  styleUrl: './pokemon-tile.component.css',
})
export class PokemonTileComponent {
  @Input() pokemon: Pokemon | null = null;

  public gradient: string = '';

  ngOnInit() {
    if (this.pokemon) {
      const mainType = this.pokemon.types[0];
      this.gradient = getGradientForType(mainType as PokemonType);
    }
  }
}
