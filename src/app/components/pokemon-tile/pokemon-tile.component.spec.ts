import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTileComponent } from './pokemon-tile.component';

describe('PokemonTileComponent', () => {
  let component: PokemonTileComponent;
  let fixture: ComponentFixture<PokemonTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
