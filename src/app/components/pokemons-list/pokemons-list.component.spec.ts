import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { PokemonsListComponent } from './pokemons-list.component';

describe('PokemonsListComponent', () => {
  let component: PokemonsListComponent;
  let fixture: ComponentFixture<PokemonsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonsListComponent],
      providers: [Apollo, { provide: ToastrService, useValue: ToastrService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
