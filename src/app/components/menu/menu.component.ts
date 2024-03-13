import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonSearchComponent } from '../pokemon-input/pokemon-input.component';

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
    this.togglePanel.emit();
  }
}
