# Sistema de Autenticação

## Funcionalidades:

- **Login/Logout** com controle de sessão
- **Hash SHA-512** com sal e pimenta para senhas
- **Timeout de sessão** de 10 minutos
- **Controle de permissões** por cargo (Gerente, Atendente, Mecânico)
- **Proteção de rotas** sensíveis

## Componentes

### 1. AuthHelper (Infraestrutura)
- Gerenciamento de sessões PHP nativas -> com session_start()
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

## Rotas Protegidas

...


## Códigos de Erro

- `NAO_AUTENTICADO` - Usuário não está logado
- `SEM_PERMISSAO` - Usuário não tem permissão suficiente
- `ERRO_INTERNO` - Erro interno do servidor