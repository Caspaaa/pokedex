import { Component, Input } from '@angular/core';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pokemon } from '@models/pokemon.model';
import {
  getGradientForType,
  getColorForType,
  PokemonType,
} from '../../utils/types-gradients';

@Component({
  selector: 'app-pokemon-tile',
  standalone: true,
  imports: [RouterLink, NgFor, NgStyle, CommonModule],
  templateUrl: './pokemon-tile.component.html',
  styleUrl: './pokemon-tile.component.css',
})
export class PokemonTileComponent {
  @Input() pokemon: Pokemon | null = null;

  public background: string = '';
  public color: string = '';

  ngOnInit() {
    this.getBackground();
    this.getColors();
  }

  getBackground() {
    if (this.pokemon) {
      const mainType = this.pokemon.types[0];
      this.background = getGradientForType(mainType as PokemonType);
    }
  }

  getColors() {
    if (this.pokemon) {
      const mainType = this.pokemon.types[0];
      this.color = getColorForType(mainType as PokemonType);
    }
  }
}
