export type PokemonType =
  | 'grass'
  | 'fire'
  | 'water'
  | 'bug'
  | 'normal'
  | 'poison'
  | 'electric'
  | 'ground'
  | 'fairy'
  | 'fighting'
  | 'psychic'
  | 'rock'
  | 'ice'
  | 'ghost'
  | 'flying'
  | 'dragon'
  | 'steel'
  | 'dark';

export const typeGradients: { [key in PokemonType]: string } = {
  grass:
    'linear-gradient(45deg, rgb(33, 212, 182) 0%, rgb(134, 213, 134) 100%)',
  fire: 'linear-gradient(45deg, rgb(255, 221, 31) 0%, rgb(241, 148, 147) 100%)',
  water:
    'linear-gradient(45deg, rgb(38, 111, 227) 0%, rgb(146, 221, 205) 100%)',
  bug: 'linear-gradient(45deg, rgb(22, 223, 32) 0%, rgb(200, 220, 127) 100%)',
  normal:
    'linear-gradient(45deg, rgb(242, 246, 55) 0%, rgb(237, 179, 166) 100%)',
  poison:
    'linear-gradient(45deg, rgb(175, 49, 131) 0%, rgb(164, 135, 192) 100%)',
  electric:
    'linear-gradient(45deg, rgb(227, 255, 46) 0%, rgb(252, 181, 151) 100%)',
  ground:
    'linear-gradient(45deg, rgb(204, 218, 11) 0%, rgb(224, 135, 108) 100%)',
  fairy:
    'linear-gradient(45deg, rgb(255, 138, 138) 0%, rgb(254, 241, 248) 100%)',
  fighting:
    'linear-gradient(45deg, rgb(210, 170, 40) 0%, rgb(210, 142, 142) 100%)',
  psychic:
    'linear-gradient(45deg, rgb(196, 235, 0) 0%, rgb(233, 147, 103) 100%)',
  rock: 'linear-gradient(45deg, rgb(140, 121, 43) 0%, rgb(174, 111, 111) 100%)',
  ice: 'linear-gradient(45deg, rgb(58 9 89) 0%, rgb(140, 153, 202) 100%',
  ghost:
    'linear-gradient(45deg, rgb(134, 36, 143) 0%, rgb(107, 100, 180) 100%)',
  flying:
    'linear-gradient(45deg, rgb(255, 138, 138) 0%, rgb(254, 241, 248) 100%)',
  dragon:
    'linear-gradient(45deg, rgb(109, 125, 248) 0%, rgb(213, 245, 246) 100%)',
  steel: 'linear-gradient(45deg, rgb(73, 40, 175) 0%, rgb(121, 164, 195) 100%)',
  dark: 'linear-gradient(45deg, rgb(24, 55, 129) 0%, rgb(71, 184, 169) 100%)',
};

export function getGradientForType(type: PokemonType): string {
  return typeGradients[type] || '';
}
