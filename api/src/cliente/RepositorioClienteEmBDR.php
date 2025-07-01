<?php

class RepositorioClienteEmBDR implements RepositorioCliente
{
  public function __construct(
    private PDO $pdo
  ) {}

  /**
   * Buscar todos os clientes. Retorna null caso não encontre.
   *
   * @throws \RepositorioException
   * @return Cliente[]|null
   */
  public function buscarClientes(): array|null
  {
    try {
      // echo "buscando clientes";
      $sql = "SELECT * FROM cliente";
      $ps = $this->pdo->prepare($sql);
      $ps->execute();
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $resultados = $ps->fetchAll();

      if (!$resultados) return null;

      $clientes = [];
      foreach ($resultados as $dados) {
        $clientes[] = new Cliente(
          codigo: (int) $dados['id'],
          nomeCompleto: $dados['nome_completo'],
          dataNascimento: $dados['data_nascimento'],
          cpf: $dados['cpf'],
          telefone: $dados['telefone'],
          email: $dados['email'],
          endereco: $dados['endereco'],
          foto: $dados['foto'],
        );
      }

      return $clientes;
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar clientes. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }

  public function buscarClienteFiltro(int|string $query): Cliente|null
  {
    try {
      $query = ltrim((string) $query, '/');

      if (strlen($query) === 11) {
        $sql = "SELECT * FROM cliente WHERE cpf = :param LIMIT 1";
      } else {
        $sql = "SELECT * FROM cliente WHERE id = :param LIMIT 1";
      }

      $ps = $this->pdo->prepare($sql);
      $ps->execute([':param' => $query]);
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $dados = $ps->fetch();

      if (!$dados) return null;

      return new Cliente(
        codigo: (int) $dados['id'],
        nomeCompleto: $dados['nome_completo'],
        dataNascimento: $dados['data_nascimento'],
        cpf: $dados['cpf'],
        telefone: $dados['telefone'],
        email: $dados['email'],
        endereco: $dados['endereco'],
        foto: $dados['foto'],
      );
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Ocorreu um erro ao buscar cliente por código ou CPF. Tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }

  /**
   * Salva um novo cliente no banco de dados.
   * 
   * @param Cliente $cliente O cliente a ser salvo
   * @return Cliente O cliente salvo (inclusive com ID)
   * @throws RepositorioException Em caso de erro de persistência
   */
  public function salvar(Cliente $cliente): Cliente
  {
    try {
      $sql = "INSERT INTO cliente (nome_completo, cpf, telefone, data_nascimento, email, endereco, foto)
            VALUES (:nome, :cpf, :telefone, :data_nascimento, :email, :endereco, :foto)";

      $ps = $this->pdo->prepare($sql);

      $ps->execute([
        ':nome' => $cliente->getNomeCompleto(),
        ':cpf' => $cliente->getCpf(),
        ':telefone' => $cliente->getTelefone(),
        ':data_nascimento' => $cliente->getDataNascimento(),
        ':email' => $cliente->getEmail(),
        ':endereco' => $cliente->getEndereco(),
        ':foto' => $cliente->getFoto(),
      ]);

      $id = (int) $this->pdo->lastInsertId();

      $clienteSalvo = $this->buscarClienteFiltro((int)$id);
      if ($clienteSalvo === null) {
        throw new RepositorioException('Erro ao recuperar cliente salvo');
      }
      return $clienteSalvo;
    } catch (PDOException $ex) {
      throw new RepositorioException(
        'Erro ao salvar cliente. Verifique os dados e tente novamente.',
        (int) $ex->getCode(),
        $ex
      );
    }
  }
}
