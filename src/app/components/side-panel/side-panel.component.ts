import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyPokemonsComponent } from '../my-pokemons/my-pokemons.component';
import { NgIf, NgFor } from '@angular/common';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonLight } from '@models/pokemon.model';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [MyPokemonsComponent, NgFor],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent {
  @Input() isOpen: boolean = false;

  @Output() closePanel = new EventEmitter<void>();

  public pokemons: PokemonLight[] = [];

  constructor(private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.pokeapiService
      .fetchAllPokemonLight()
      .subscribe((pokemons: PokemonLight[]) => {
        this.pokemons = pokemons;
      });
  }

  close() {
    this.closePanel.emit();
  }
}
