import gql from 'graphql-tag';

export const GET_ALL_POKEMON_LIGHT = gql`
  query getPokemons($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemon(
      offset: $offset
      limit: $limit
      where: { id: { _lt: 10000 } }
    ) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
    }
  }
`;

export const GET_POKEMON_FULL = gql`
  query getPokemonFull($id: Int!) {
    pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
    }
  }
`;
