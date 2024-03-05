import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { PokemonsListComponent } from './components/pokemons-list/pokemons-list.component';

export const routes: Routes = [
  { path: '', component: PokemonsListComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
];
