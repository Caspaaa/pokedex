export interface PokemonBasic {
  base_experience: number;
  height: number;
  id: number;
  name: string;
  order: number;
  is_default: boolean;
  pokemon_v2_pokemonsprites: Array<{
    id: number;
    sprites: {
      front_default: string;
    };
  }>;
}

export interface PokemonListResponse {
  data: {
    pokemon_v2_pokemon: PokemonBasic[];
  };
}

export interface PokemonLight {
  id: number;
  name: string;
  captured?: boolean;
}

export interface PokemonLightListResponse {
  data: {
    pokemon_v2_pokemon: PokemonLight[];
  };
}

export interface PokemonFull {
  base_experience: number;
  height: number;
  id: number;
  name: string;
  order: number;
  weight: number;
  pokemon_v2_pokemontypes: any;
  pokemon_v2_pokemonmoves: any;
  pokemon_v2_pokemonspecy: any;
  captured: boolean;
}

export interface PokemonFullListResponse {
  data: {
    pokemon_v2_pokemon: PokemonFull[];
  };
}
