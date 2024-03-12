import { Component, EventEmitter, Output } from '@angular/core';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';
import { CommonModule, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [PokemonSearchComponent, NgStyle],
})
export class MenuComponent {
  @Output() togglePanel = new EventEmitter<void>();
  toggleSidePanel() {
    console.log('toggleSidePanel');
    this.togglePanel.emit();
  }
}
