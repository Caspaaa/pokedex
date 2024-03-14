import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { PokemonsListComponent } from '../pokemons-list/pokemons-list.component';
import { MenuComponent } from './menu.component';

// const fakeActivatedRoute = {
//   params: of({ id: '1' }),
//   snapshot: {
//     paramMap: convertToParamMap({ id: '1' }),
//   },
// };

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        Apollo,
        provideRouter([
          {
            path: '',
            pathMatch: 'full',
            component: PokemonsListComponent,
          },
          {
            path: 'pokemon/:id',
            component: PokemonDetailComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
