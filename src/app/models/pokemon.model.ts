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
  model_type: 'full';
  height: number;
  weight: number;
  stats: Stat[];
  moves: Move[];
}

export interface Stat {
  name: string;
  value: number;
}

export interface Move {
  name: string;
  level: number;
  accuracy: number;
  pp: number;
  power: number;
}
