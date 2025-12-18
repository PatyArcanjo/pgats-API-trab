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
- `POST /students/:username/notas` – Lançar nota (nota)
- `GET /api-docs` – Documentação Swagger

## Regras de Negócio
- Não permite estudantes duplicados
- Notas entre 0 e 10 (default 0)
- Máximo de 3 notas por estudante
- Login obrigatório para operações

## Testes
Os testes automatizados estão em `tests/` e podem ser executados com Mocha/Supertest.

# Testes de Performance K6
Os testes automatizados estão em `tests/k6` e podem ser executados através do comnando : 

k6 run  test/k6/students.js 

## Documentação
Acesse `/api-docs` para visualizar a documentação Swagger.

## Exemplos de uso com k6
Esta seção traz pequenos exemplos (e onde encontrá-los no repositório) dos conceitos usados no teste de performance K6 incluído em `test/k6/students.js`.

- **Thresholds**: definido em `test/k6/students.js` — garante que o percentil 95 de `http_req_duration` seja menor que 2000 ms.
```javascript
export const options = {
   vus: 10,
   duration: '15s',
   thresholds: { http_req_duration: ['p(95)<2000'] }
};
```

- **Checks**: cada request no teste usa `check()` para validar códigos de resposta esperados. Exemplo (arquivo `test/k6/students.js`):
```javascript
const res = http.post(url, payload, params);
check(res, { 'login status is 200': (r) => r.status === 200 });
```

- **Helpers**: funções reutilizáveis ficam em `test/k6/helpers/`. Exemplo de import e uso (arquivo `test/k6/students.js`):
```javascript
import { getBaseUrl } from './helpers/baseUrl.js';
import { randomEmail } from './helpers/email.js';
import { login } from './helpers/auth.js';

const baseUrl = getBaseUrl();
const username = randomEmail();
```

- **Trends**: métrica custom para monitorar duração de um POST `/students/:username/notas` (arquivo `test/k6/students.js`):
```javascript
import { Trend } from 'k6/metrics';
const postNotasTrend = new Trend('post_notas_duration_ms');
// ...
postNotasTrend.add(duration);
```

- **Faker / geração de dados**: este repositório não usa a biblioteca `faker`; há um helper simples `randomEmail()` em `test/k6/helpers/email.js` que garante usuários únicos durante os testes.

- **Variável de Ambiente**: o `BASE_URL` é lido por `test/k6/helpers/baseUrl.js` via `__ENV.BASE_URL`. Execute o teste passando a variável:
```bash
k6 run --vus 10 --duration 15s test/k6/students.js -e BASE_URL="http://localhost:3000"
```

- **Reaproveitamento de Resposta**: o token retornado pelo login é extraído e reutilizado nas requisições subsequentes. Exemplo (arquivo `test/k6/helpers/auth.js` e `test/k6/students.js`):
```javascript
const { res, token } = login(baseUrl, 'admin', 'admin');
const authHeader = { headers: { Authorization: `Bearer ${token}` } };
http.post(`${baseUrl}/students`, JSON.stringify({ name, username }), authHeader);
```

- **Uso de Token de Autenticação**: o header `Authorization: Bearer <token>` é enviado em endpoints protegidos (veja `students.js`):
```javascript
const params = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
```

- **Groups**: o teste organiza ações com `group()` para legibilidade e relatórios. Exemplo (arquivo `test/k6/students.js`):
```javascript
group('auth', () => {
   const { res, token } = login(baseUrl, 'admin', 'admin');
   // ... fluxo do estudante
});
```

