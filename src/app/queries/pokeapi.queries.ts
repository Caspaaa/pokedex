import gql from 'graphql-tag';

export const GET_POKEMONS = gql`
  query getPokemons($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(offset: $offset, limit: $limit) {
      base_experience
      height
      id
      name
      order
      is_default
      pokemon_v2_pokemonsprites {
        id
        sprites
      }
    }
  }
`;

export const GET_ALL_POKEMON_NAMES = gql`
  query getPokemons($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(
      offset: $offset
      limit: $limit
      where: { id: { _lt: 10000 } }
    ) {
      id
      name
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query getPokemonFull($id: Int!) {
    pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      base_experience
      height
      id
      name
      order
      weight
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonmoves {
        move_id
        level
        pokemon_v2_move {
          name
          accuracy
          pp
          power
        }
      }
      pokemon_v2_pokemonspecy {
        name
      }
    }
  }
`;
