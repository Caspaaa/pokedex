import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { PokemonsListComponent } from '../pokemons-list/pokemons-list.component';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
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
        { provide: ToastrService, useValue: ToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
