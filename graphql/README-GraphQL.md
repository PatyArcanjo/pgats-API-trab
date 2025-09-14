# API GraphQL de Estudantes

Esta API GraphQL expõe os serviços de estudantes e notas usando ApolloServer e Express.

## Instalação

1. Instale as dependências necessárias:
   ```bash
   npm install apollo-server-express graphql express jsonwebtoken
   ```

2. Inicie o servidor GraphQL:
   ```bash
   node graphql/server.js
   ```

3. Acesse o playground GraphQL em:
   [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Autenticação
- Para Mutations protegidas (registrar estudante, lançar nota), envie o token JWT no header:
  ```
  Authorization: Bearer SEU_TOKEN_AQUI
  ```
- O token é obtido via mutation `login(username, password)`.

## Types, Queries e Mutations

### Types
- `Estudante`: name, username, notas, notaFinal
- `Usuario`: username, token

### Queries
- `estudante(username: String!): Estudante` — consulta estudante
- `estudantes: [Estudante]` — lista todos estudantes

### Mutations
- `login(username: String!, password: String!): Usuario` — retorna token JWT
- `registrarEstudante(name: String!, username: String!): Estudante` — exige token JWT
- `lancarNota(username: String!, nota: Int!): Estudante` — exige token JWT

## Exemplo de Mutation de Login
```graphql
mutation {
  login(username: "admin", password: "admin") {
    token
  }
}
```

## Exemplo de Mutation protegida
```graphql
mutation {
  registrarEstudante(name: "João", username: "joao") {
    username
  }
}
```

## Testes
Os testes de integração GraphQL estão em `tests/student.graphql.test.js` e podem ser executados com:
```bash
npm run test:graphql
```
