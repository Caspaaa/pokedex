import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pokemon } from '@models/pokemon.model';

@Component({
  selector: 'app-pokemon-tile',
  standalone: true,
  imports: [RouterLink, NgFor, NgStyle, CommonModule],
  templateUrl: './pokemon-tile.component.html',
  styleUrl: './pokemon-tile.component.css',
})
export class PokemonTileComponent {
  @Input() pokemon: Pokemon | null = null;
}
