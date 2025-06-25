# Sistema de Autenticação - Pra ajudar a gente se tiver alguma dúvida de implementação

## Funcionalidades:

- **Login/Logout** com controle de sessão
- **Hash SHA-512** com sal e pimenta para senhas
- **Timeout de sessão** de 10 minutos
- **Controle de permissões** por cargo (Gerente, Atendente, Mecânico)
- **Proteção de rotas** sensíveis

## Componentes

### 1. AuthHelper (Infraestrutura)
- Gerenciamento de sessões PHP nativas com session_start()
- Configuração de cookies com session_set_cookie_params()
- Verificação de senhas com hash SHA-512
- Controle de timeout (10 minutos)
- Verificação de permissões por cargo

### 2. GestorFuncionario (Regra de Negócio)
- Login com validação de credenciais
- Logout com destruição de sessão
- Verificação de autenticação
- Controle de permissões

### 3. AuthMiddleware (Aplicação)
- Middleware para proteção de rotas
- Verificação de autenticação e permissões
- Respostas padronizadas para erros de autorização (faz sentido ter isso? um código específico para cada tipo de erro)

## Rotas da API

### POST /api/login

**Request:**
```json
{
  "cpf": "22222222222",
  "senha": "123456"
}
```

**Response (Sucesso):**
```json
{
  "sucesso": true,
  "funcionario": {
    "codigo": 2,
    "nome": "Renato Silva",
    "cpf": "22222222222",
    "cargo": "Atendente"
  },
  "mensagem": "Login realizado com sucesso."
}
```

### POST /api/logout

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Logout realizado com sucesso."
}
```

### GET /api/auth/me

**Response (Autenticado):**
```json
{
  "sucesso": true,
  "autenticado": true,
  "funcionario": {
    "codigo": 2,
    "nome": "Renato Silva",
    "cpf": "22222222222",
    "cargo": "Atendente"
  }
}
```

**Response (Não autenticado):**
```json
{
  "sucesso": false,
  "autenticado": false,
  "erro": "Usuário não autenticado ou sessão expirada."
}
```

## Hierarquia de Permissões

1. **Mecânico** - Nível básico
2. **Atendente** - Nível intermediário (inclui permissões de Mecânico)
3. **Gerente** - Nível máximo (inclui todas as permissões)

## Rotas Protegidas e Controles de Acesso

### Regras de Acesso por Cargo:

#### **Mecânico** - Acesso Limitado
- NÃO pode fazer locações (`POST /api/locacoes`)
- NÃO pode fazer devoluções (`POST /api/devolucoes`)

#### **Atendente** - Acesso Intermediário
- Pode fazer locações (`POST /api/locacoes`)
- Pode fazer devoluções (`POST /api/devolucoes`)

#### **Gerente** - Acesso Total
- Pode acessar todas as funcionalidades

### Rotas com Controle de Acesso:
- `POST /api/locacoes` - **Apenas Atendente ou Gerente**
- `POST /api/devolucoes` - **Apenas Atendente ou Gerente**

### Respostas de Erro de Acesso:

**Usuário não autenticado (401):**
```json
{
  "sucesso": false,
  "erro": "Acesso negado. Faça login para continuar.",
  "codigo": "NAO_AUTENTICADO"
}
```

**Permissão insuficiente (403):**
```json
{
  "sucesso": false,
  "erro": "Acesso negado. Você não tem permissão para acessar este recurso.",
  "codigo": "SEM_PERMISSAO"
}
```

## Códigos de Erro

- `NAO_AUTENTICADO` - Usuário não está logado
- `SEM_PERMISSAO` - Usuário não tem permissão suficiente
- `ERRO_INTERNO` - Erro interno do servidor