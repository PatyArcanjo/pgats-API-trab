const { gql } = require('apollo-server-express');

module.exports = gql`
  type Estudante {
    name: String!
    username: String!
    notas: [Int!]!
    notaFinal: Float
  }

  type Usuario {
    username: String!
    token: String
  }

  type Query {
    estudante(username: String!): Estudante
    estudantes: [Estudante]
  }

  type Mutation {
    registrarEstudante(name: String!, username: String!): Estudante
    lancarNota(username: String!, nota: Int!): Estudante
    login(username: String!, password: String!): Usuario
  }
`;
