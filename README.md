# Projeto Integrador - Grupo g9

# Alunos
Gustavo Xavier Saldanha  
Thiago Rocha Duarte

# Aplicação para aluguel de bicicletas

## Objetivo


## Tecnologias Utilizadas


## Funcionalidades


## Como baixar o projeto
1. Clone o repositório:
   ```bash
   git clone https://gitlab.com/cefet-nf/pis-2025-1/g9.git

2. Acesse a pasta do projeto:
   ```bash
   cd g9


## ENDPOINTS DE DEVOLUÇÃO

Todos os exemplos abaixo são da mesma locação/devolução, para facilitar a comparação e para onde vai cada coisa.

1. **GET /api/devolucoes/simulacao/:locacaoId**
   - Simula o valor a ser pago na devolução, mas não registra no banco
   - Parâmetro: ID da locação (na URL - :locacaoId)
   - Retorna: Valor calculado para pagamento da devolução
   
   **Exemplo de resposta:**
   ```json
   {
      "locacao": {
         "codigo": 2,
         "dataHoraLocacao": "2025-05-22 04:41:40",
         "horasContratadas": 1,
         "dataHoraEntregaPrevista": "2025-05-22 05:41:40",
         "desconto": 0,
         "valorTotal": 1,
         "cliente": {
            "codigo": 5,
            "nomeCompleto": "Mariano Costa",
            "telefone": "(11) 92345-6789"
         },
         "registradoPor": {
            "codigo": 1,
            "nome": "Patrícia Oliveira"
         },
         "itens": [
            {
               "codigo": 8,
               "tempoContratado": 1,
               "subtotal": 1,
               "equipamento": {
                  "codigo": 8,
                  "modelo": "Squeeze 600ml",
                  "fabricante": "Nike",
                  "descricao": "Squeeze térmico",
                  "valorHora": "1.00",
                  "avarias": "",
                  "disponivel": false
               }
            }
         ]
      },
      "dataHoraDevolucao": "2025-05-22 04:57:16",
      "valorPago": 1
   }
   ```

2. **POST /api/devolucoes**
   - Registra uma nova devolução no sistema
   - Corpo da requisição: Dados da devolução. "locacaoId" e "registradoPor" são obrigatórios. "dataHoraDevolucao" e "valorPago" são opcionais. Se não for passado, ele vai calcular e colocar no banco de dados. Sugiro passar esses parâmetros, que você recebe na rota de simulação (tem os mesmos nomes), para garantir que vai ser o mais correto.
   - Retorna: Dados da devolução registrada
   
   **Exemplo de corpo da requisição:**
   ```json
   {
   "locacaoId": 2,
      "registradoPor": {
         "codigo": 5,
         "nome": "Aline Fernandes"
      },
      "dataHoraDevolucao": "2025-05-22 05:03:05",
      "valorPago": 1
   }
   ```
   
   **Exemplo de resposta:**
   ```json
   {
      "codigo": 1,
      "dataHoraDevolucao": "2025-05-22 05:03:05",
      "valorPago": "1.00",
      "locacao": {
         "codigo": 2,
         "dataHoraLocacao": "2025-05-22 04:41:40",
         "horasContratadas": 1,
         "dataHoraEntregaPrevista": "2025-05-22 05:41:40",
         "cliente": {
            "codigo": 5,
            "nomeCompleto": "Mariano Costa",
            "cpf": "65432198700"
         }
      },
      "registradoPor": {
         "codigo": 5,
         "nome": "Aline Fernandes"
      }
   }
   ```

3. **GET /api/devolucoes**
   - Lista todas as devoluções cadastradas no sistema
   - Não precisa de parâmetro nenhum, que nem as outras rotas de GET ALL
   - Retorna: Array com todas as devoluções
   
   **Exemplo de resposta:**
   ```json
   [
      {
         "codigo": 1,
         "dataHoraDevolucao": "2025-05-22 05:03:05",
         "valorPago": "1.00",
         "locacao": {
            "codigo": 2,
            "dataHoraLocacao": "2025-05-22 04:41:40",
            "horasContratadas": 1,
            "dataHoraEntregaPrevista": "2025-05-22 05:41:40",
            "cliente": {
               "codigo": 5,
               "nomeCompleto": "Mariano Costa",
               "cpf": "65432198700"
            }
         },
         "registradoPor": {
            "codigo": 5,
            "nome": "Aline Fernandes"
         }
      }
   ]
   ```

## CEFET-RJ, Sistemas de Informação
