# API de Estudantes

Esta API permite registrar estudantes, lançar notas, consultar estudantes e calcular a média final das notas. Utiliza Express, JavaScript e Swagger para documentação.

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install express body-parser swagger-ui-express
   ```
3. Inicie o servidor:
   ```bash
   node server.js
   ```

## Endpoints REST

- `POST /login` – Login de usuário (username, password)
- `POST /students` – Registrar estudante (name, username)
- `GET /students/:username` – Consultar estudante
- `POST /students/:username/notas` – Lançar nota (nota)
- `GET /api-docs` – Documentação Swagger

## API GraphQL

Os arquivos da API GraphQL estão em `graphql/`.

Para executar a API GraphQL:

1. Instale as dependências:
   ```bash
   npm install apollo-server-express graphql jsonwebtoken
   ```
2. Inicie o servidor GraphQL:
   ```bash
   node graphql/server.js
   ```
3. Acesse o playground em:
   [http://localhost:4000/graphql](http://localhost:4000/graphql)

### Queries e Mutations
- `login(username, password)` – retorna token JWT
- `registrarEstudante(name, username)` – exige token JWT
- `lancarNota(username, nota)` – exige token JWT
- `estudante(username)` – consulta estudante
- `estudantes` – lista todos estudantes

Para Mutations protegidas, envie o token JWT no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## Regras de Negócio
- Não permite estudantes duplicados
- Notas entre 0 e 10 (default 0)
- Máximo de 3 notas por estudante
- Login obrigatório para operações

## Testes
Os testes automatizados estão em `tests/` e podem ser executados com Mocha/Supertest.

## Documentação
Acesse `/api-docs` para visualizar a documentação Swagger.
