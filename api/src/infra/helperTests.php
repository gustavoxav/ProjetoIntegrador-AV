<?php

function realizarLoginTests(string $cargo = 'Gerente')
{
    $codigo = rand(1, 1000);
    $_SESSION = [
        'funcionario' => [
            'codigo' => $codigo,
            'nome' => 'Funcionário Teste',
            'cpf' => str_pad($codigo, 11, '0', STR_PAD_LEFT),
            'cargo' => $cargo
        ],
        'ultimo_acesso' => time()
    ];
}

function realizarLogout()
{
    unset($_SESSION['funcionario']);
    unset($_SESSION['ultimo_acesso']);
}