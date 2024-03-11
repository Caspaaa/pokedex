import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidePanelComponent } from './components/side-panel/side-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SidePanelComponent],
})
export class AppComponent {
  title = 'pokedex';

  isSidePanelOpen = false;

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }
}
