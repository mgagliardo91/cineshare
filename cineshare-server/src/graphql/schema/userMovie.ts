import { gql } from 'apollo-server-express';

export default gql`
  type UserMovie {
    id: ID!
    movie: Movie!
    user: User!
  }

  type UserMovieConnection {
    edges: [UserMovie!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }
`;