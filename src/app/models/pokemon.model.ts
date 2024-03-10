export interface Pokemon {
  id: number;
  name: string;
  model_type: 'light' | 'full';
  types: string[];
  captured: boolean;
}

export interface PokemonLight extends Pokemon {
  model_type: 'light';
}

export interface PokemonFull extends Pokemon {
  base_experience: number;
  height: number;
  order: number;
  weight: number;
  pokemon_v2_pokemontypes: any;
  pokemon_v2_pokemonmoves: any;
  pokemon_v2_pokemonspecy: any;
  model_type: 'full';
}
