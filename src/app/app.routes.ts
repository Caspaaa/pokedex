import { Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { PokemonsListComponent } from './components/pokemons-list/pokemons-list.component';

export const routes: Routes = [
  { path: '', component: PokemonsListComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' },
];
