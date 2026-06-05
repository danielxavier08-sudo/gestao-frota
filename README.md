# 🚛 Gestão de Frota — DW2 IFCE

Sistema de Gestão de Frota desenvolvido para a disciplina **Desenvolvimento Web II** do curso de Informática para Internet EAD do IFCE.

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5, CSS3, JavaScript (Fetch API) |
| Back-end | Node.js + Express |
| Banco de dados | MySQL 8+ (mysql2/promise) |
| Autenticação | JWT (jsonwebtoken) + bcryptjs |
| Arquitetura | MVC + Front Controller |

## Estrutura do Projeto

```
gestao-frota/
├── database/
│   └── frota_db.sql          # Script SQL (cria banco + tabelas + dados)
├── public/                   # Front-end estático
│   ├── index.html            # SPA principal
│   ├── css/style.css
│   └── js/
│       ├── api.js            # Camada de comunicação com a API
│       ├── ui.js             # Utilitários de interface
│       ├── app.js            # Roteador e autenticação
│       ├── veiculos.js       # CRUD Veículos
│       ├── motoristas.js     # CRUD Motoristas
│       └── oficinas.js       # CRUD Oficinas
└── src/                      # Back-end
    ├── app.js                # Front Controller / servidor Express
    ├── config/
    │   └── database.js       # Pool de conexões MySQL
    ├── controllers/
    │   ├── authController.js
    │   ├── veiculoController.js
    │   ├── motoristaController.js
    │   └── oficinaController.js
    ├── middlewares/
    │   └── auth.js           # Verificação JWT
    ├── models/
    │   ├── veiculoModel.js
    │   ├── motoristaModel.js
    │   ├── oficinaModel.js
    │   └── usuarioModel.js
    └── routes/
        └── api.js            # Mapa de rotas REST
```

## Como rodar

### 1. Pré-requisitos
- Node.js 18+
- MySQL 8+

### 2. Banco de dados
```sql
-- No MySQL Workbench ou terminal MySQL:
SOURCE database/frota_db.sql;
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com seus dados de MySQL
```

Edite o `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=frota_db
PORT=3000
JWT_SECRET=frota_secret_dw2_ifce_2024
```

### 4. Instalar dependências e rodar
```bash
npm install
npm start
# ou para desenvolvimento com hot-reload:
npm run dev
```

### 5. Acessar
Abra http://localhost:3000

**Login padrão:**
- E-mail: `admin@frota.com`
- Senha: `admin123`

## API REST — Endpoints

| Verbo | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/veiculos` | Listar veículos |
| GET | `/api/v1/veiculos/:id` | Buscar por ID |
| POST | `/api/v1/veiculos` | Criar veículo |
| PUT | `/api/v1/veiculos/:id` | Atualizar veículo |
| DELETE | `/api/v1/veiculos/:id` | Remover veículo |
| GET | `/api/v1/motoristas` | Listar motoristas |
| GET | `/api/v1/motoristas/:id` | Buscar por ID |
| POST | `/api/v1/motoristas` | Criar motorista |
| PUT | `/api/v1/motoristas/:id` | Atualizar motorista |
| DELETE | `/api/v1/motoristas/:id` | Remover motorista |
| GET | `/api/v1/oficinas` | Listar oficinas |
| GET | `/api/v1/oficinas/:id` | Buscar por ID |
| POST | `/api/v1/oficinas` | Criar oficina |
| PUT | `/api/v1/oficinas/:id` | Atualizar oficina |
| DELETE | `/api/v1/oficinas/:id` | Remover oficina |

Todos os endpoints (exceto `/auth/login`) requerem header:
```
Authorization: Bearer <token>
```

## Fluxo de branches (atividade)

```bash
# Criar branch de feature
git checkout -b feature/crud

# Após implementar o CRUD, commitar
git add .
git commit -m "feat: CRUD completo para veículos, motoristas e oficinas"

# Abrir Merge Request no GitHub e mesclar na main
git checkout main
git merge feature/crud
```

## Entidades do Banco

- **veiculos** — placa, modelo, ano, km, status
- **motoristas** — nome, cnh, categoria, validade_cnh, telefone, status
- **oficinas** — nome, cidade, telefone, especialidade, status
- **usuarios** — nome, email, senha_hash, perfil

---
IFCE · Informática para Internet EAD · DW2 · Etapas 1–7
