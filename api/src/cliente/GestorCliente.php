<?php

class GestorCliente
{

    public function __construct(
        private RepositorioCliente $repositorioCliente
    ) {}

    /**
     * Buscar um Cliente por CPF ou Código. Caso não tenha nenhum filtro, retorna todos os clientes.
     *
     * @param int|string|null $filtro
     * @return Cliente[]
     */
    public function obterClientes(int|string|null $filtro): array|Cliente|null
    {
        try {
            if (is_null($filtro)) {
                // echo "caso 1 all";
                return $this->repositorioCliente->buscarClientes();
            }
            return $this->repositorioCliente->buscarClienteFiltro($filtro);
        } catch (\Throwable $error) {
            throw $error;
        }
    }

    /**
     * Registra um novo cliente no sistema
     * 
     * @param array{
     *   nomeCompleto: string,
     *   dataNascimento: string,
     *   cpf: string,
     *   telefone: string,
     *   email: string,
     *   endereco: string,
     *   foto: string
     * } $dadosCliente Dados do cliente a ser registrado
     * @return array<string, mixed> Cliente salvo
     * @throws Exception Em caso de erro de validação ou persistência
     */
    public function registrarCliente(array $dadosCliente): array
    {
        $dadosCliente = $this->objectToArray($dadosCliente);

        $clienteExistente = $this->repositorioCliente->buscarClienteFiltro($dadosCliente['cpf']);
        if ($clienteExistente) {
            throw new Exception("Já existe um cliente com o CPF informado");
        }

        $cliente = new Cliente(
            codigo: 0,
            nomeCompleto: $dadosCliente['nomeCompleto'] ?? '',
            dataNascimento: $dadosCliente['dataNascimento'] ?? '',
            cpf: $dadosCliente['cpf'] ?? '',
            telefone: $dadosCliente['telefone'] ?? '',
            email: $dadosCliente['email'] ?? '',
            endereco: $dadosCliente['endereco'] ?? '',
            foto: $dadosCliente['foto'] ?? ''
        );

        $erros = $cliente->validar();
        if (!empty($erros)) {
            throw new Exception("Erros de validação: " . implode(", ", $erros));
        }

        $clienteSalvo = $this->repositorioCliente->salvar($cliente);

        return $clienteSalvo;
    }


    /**
     * Converte recursivamente objetos stdClass para arrays associativos
     * 
     * @param mixed $obj O objeto a ser convertido
     * @return mixed O array resultante ou o valor original se não for um objeto
     */
    private function objectToArray($obj)
    {
        if (is_object($obj)) {
            $obj = (array) $obj;
        }

        if (is_array($obj)) {
            $new = [];
            foreach ($obj as $key => $val) {
                $new[$key] = $this->objectToArray($val);
            }
            return $new;
        }

        return $obj;
    }
}
