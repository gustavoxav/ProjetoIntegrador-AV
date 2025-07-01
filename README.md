# Projeto Integrador - Grupo g9

# Alunos
Gustavo Xavier Saldanha  
Thiago Rocha Duarte

# Aplicação para aluguel de bicicletas

Sistema web para gestão de locação de equipamentos desenvolvido como projeto integrador. O sistema permite controlar o processo completo de locação, devolução, gestão de avarias e relatórios.

Este projeto desenvolve um sistema web para gestão de locação de equipamentos de uma loja de bicicletas. O sistema permite controlar o processo completo de locação e devolução.

## Tecnologias Utilizadas

### Backend
- **PHP** - Linguagem de programação principal
- **MySQL** - Sistema de gerenciamento de banco de dados
- **Composer** - Gerenciador de dependências PHP
- **phputil/router** - Roteamento de requisições HTTP
- **phputil/cors** - Configuração de CORS
- **vlucas/phpdotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **TypeScript** - Linguagem de programação principal
- **Vite** - Build tool e servidor de desenvolvimento
- **Page.js** - Roteamento client-side
- **D3.js** - Biblioteca para visualização de dados
- **Bootstrap 5.3.6** - Framework CSS para estilização e componentes
- **Bootstrap Icons** - Ícones utilizados na interface

### Testes e Qualidade
- **Vitest** - Framework de testes unitários
- **Playwright** - Framework de testes end-to-end (e2e)
- **Kahlan** - Framework de testes para PHP
- **PHPStan** - Análise estática de código PHP

## Como baixar e executar o projeto

### Pré-requisitos
- **Node.js** (versão 18+)
- **PHP** (versão 8.0+)
- **MySQL/MariaDB** (versão 8.0+)
- **Composer**
- **pnpm** (recomendado)

### 1. Clone o repositório:
```bash
git clone https://gitlab.com/cefet-nf/pis-2025-1/g9.git
cd g9
```

### 2. Configuração do Backend (API)
```bash
# Acesse a pasta da API
cd api

# Instale as dependências
composer install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações de banco de dados

# Crie o banco de dados e execute as migrações
composer db-prepare

# Inicie o servidor da API
composer start
```

### 3. Configuração do Frontend
```bash
# Acesse a pasta do frontend (abra um novo terminal)
cd front

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com a URL da API

# Inicie o servidor de desenvolvimento
pnpm dev
```

### 4. Executar Testes

#### Testes do Backend:
```bash
cd api
composer test        # Executa todos os testes
composer kahlan      # Apenas testes unitários
composer phpstan     # Apenas análise estática
```

#### Testes do Frontend:
```bash
cd front
pnpm test               # Testes unitários
pnpm e2e                # Testes end-to-end
```

## Estrutura do Projeto

```
g9/
├── api/                   # Backend PHP
│   ├── src/               # Código fonte organizado por domínio
│   │   ├── cliente/       # Módulo de clientes
│   │   ├── equipamento/   # Módulo de equipamentos
│   │   ├── locacao/       # Módulo de locações
│   │   ├── devolucao/     # Módulo de devoluções
│   │   ├── avaria/        # Módulo de avarias
│   │   ├── funcionario/   # Módulo de funcionários
│   │   └── infra/         # Infraestrutura e utilitários
│   ├── db/                # Scripts de banco de dados
│   ├── spec/              # Testes unitários
│   └── composer.json      # Dependências PHP
├── front/                 # Frontend TypeScript
│   ├── src/               # Código fonte organizado por módulos
│   ├── public/            # Arquivos estáticos e componentes HTML
│   ├── e2e/               # Testes end-to-end
│   ├── test/              # Testes unitários
│   └── package.json       # Dependências Node.js
├── README.md              # Documentação do projeto
└── apresentacao.pdf       # Slides de apresentação
```

## Referências Bibliográficas

### Frameworks e Bibliotecas
- **Bootstrap 5.3.6**. Disponível em: <https://getbootstrap.com/docs/5.3/components>. Acesso em: 27 mai. 2025.
- **D3.js - Data-Driven Documents**. Disponível em: <https://d3js.org/>. Acesso em: 27 mai. 2025.
- **Page.js - Client-side routing**. Disponível em: <https://github.com/visionmedia/page.js>. Acesso em: 27 mai. 2025.
- **Vite - Build Tool**. Disponível em: <https://vitejs.dev/guide/>. Acesso em: 27 mai. 2025.

### Testes e Qualidade
- **Playwright Testing Framework**. Disponível em: <https://playwright.dev/docs/writing-tests>. Acesso em: 27 mai. 2025.
- **Vitest - Unit Testing Framework**. Disponível em: <https://vitest.dev/>. Acesso em: 27 mai. 2025.
- **Kahlan - PHP Testing Framework**. Disponível em: <https://kahlan.github.io/docs/>. Acesso em: 27 mai. 2025.
- **PHPStan - Static Analysis**. Disponível em: <https://phpstan.org/user-guide/rule-levels>. Acesso em: 27 mai. 2025.

### Gerenciamento de Dependências
- **Composer - PHP Dependency Manager**. Disponível em: <https://getcomposer.org/doc/>. Acesso em: 27 mai. 2025.
- **pnpm - Package Manager**. Disponível em: <https://pnpm.io/>. Acesso em: 27 mai. 2025.

### Templates e Recursos Visuais
- **404 Page Template - Bootstrap 5 Example**. Disponível em: <https://bootstrapexamples.com/@valeria/404-page-template-2>. Acesso em: 27 mai. 2025.
- **Bootstrap Icons**. Disponível em: <https://icons.getbootstrap.com/>. Acesso em: 27 mai. 2025.
- **Imagem**. Disponível em: <https://super.abril.com.br/wp-content/uploads/2018/05/humanidade-causa-cc3a2ncer-em-animais-selvagens.png?w=720&h=440&crop=1>. Acesso em: 27 maio. 2025.
- **Imagem**. Disponível em: <https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/10/26/1095416860-20144148136268.jpg>. Acessoem: 27 maio. 2025.
- **Imagem**. Disponível em: <https://vegazeta.com.br/wp-content/uploads/2021/03/Arthurs-Acres-Animal-Sanctuary-2.jpg>. Acesso em: 27 maio.2025.
- **Imagem**. Disponível em: <https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-animal.jpg>. Acesso em: 27 maio. 2025.
- **Imagem**. Disponível em: <https://portaledicase.com/wp-content/uploads/2025/02/Hipopotamo-1024x683.jpg>. Acesso em: 27 maio. 2025. 
- **Imagem**. Disponível em: <https://jpimg.com.br/uploads/2025/03/7-animais-mais-fofos-do-mundo.jpg>. Acesso em: 27 maio. 2025.
- **Imagem**. Disponível em: <https://jpimg.com.br/uploads/2025/02/8-animais-mais-fortes-do-mundo.jpg>. Acesso em: 27 maio. 2025.
- **Imagem**. Disponível em: <https://rizzoimobiliaria.com.br/images/media/dfe779831f7a3f38504a77dbfa883a341673881279.jpg>. Acesso em: 27maio. 2025.
- **Imagem**. Disponível em: <https://cdn.gazetasp.com.br/img/c/825/500/dn_arquivo/2025/01/lobo-guara.jpg>. Acesso em: 27 maio. 2025.
- **Imagem**. Disponível em: <https://ogimg.infoglobo.com.br/in/14638550-9ee-f9a/FT1086A/20141123-125719.jpg>. Acesso em: 27 maio. 2025.
- **Imagem**. Disponível em: <https://ufape.com.br/wp-content/uploads/2024/06/Ufape-Hospital-Veterinario-filhote-de-cachorro-brincando-na-grama-GS2-MKT-Freepik.jpg>. Acesso em: 27 maio. 2025.


## CEFET-RJ, Sistemas de Informação
