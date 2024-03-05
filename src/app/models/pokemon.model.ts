export interface Pokemon {
  highQualityImage: string;
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
    pokemon_v2_pokemon: Pokemon[];
  };
}
