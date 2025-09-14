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

## Endpoints

- `POST /login` – Login de usuário (username, password)
- `POST /students` – Registrar estudante (name, username)
- `GET /students/:username` – Consultar estudante
- `POST /students/:username/grades` – Lançar nota (grade)
- `GET /api-docs` – Documentação Swagger

## Regras de Negócio
- Não permite estudantes duplicados
- Notas entre 0 e 10 (default 0)
- Máximo de 3 notas por estudante
- Login obrigatório para operações

## Testes
Os testes automatizados estão em `tests/` e podem ser executados com Jest/Supertest.

## Documentação
Acesse `/api-docs` para visualizar a documentação Swagger.
