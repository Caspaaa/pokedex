import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonFull, PokemonLight } from '@models/pokemon.model';

@Component({
  selector: 'app-my-pokemons',
  standalone: true,
  imports: [NgFor],
  templateUrl: './my-pokemons.component.html',
  styleUrl: './my-pokemons.component.css',
})
export class MyPokemonsComponent {
  public capturedPokemons: (PokemonLight | PokemonFull)[] = [];

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit(): void {
    this.pokeapiService.getCapturedPokemon().subscribe((capturedPokemons) => {
      console.log('capturedPokemons', capturedPokemons);
      this.capturedPokemons = capturedPokemons;
    });
  }
}
