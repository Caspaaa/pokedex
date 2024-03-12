import { Component, EventEmitter, Output } from '@angular/core';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [PokemonSearchComponent, RouterLink, NgStyle],
})
export class MenuComponent {
  @Output() togglePanel = new EventEmitter<void>();
  toggleSidePanel() {
    console.log('toggleSidePanel');
    this.togglePanel.emit();
  }
}
