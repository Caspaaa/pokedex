import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { PokeapiService } from './services/pokeapi.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, SidePanelComponent, MenuComponent],
})
export class AppComponent {
  title = 'pokedex';

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.pokeapiService.fetchAllPokemonLight().subscribe();
  }

  isSidePanelOpen = false;

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }
}
