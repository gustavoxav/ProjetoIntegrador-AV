<?php

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

/**
 * Conexão com banco de dados e retorno do objeto pdo
 * @return PDO
 */
if (!function_exists('conectarPDO')) {
    function conectarPDO(): PDO
    {

        return new PDO(
            'mysql:dbname=' . $_ENV['DB_DATABASE'] . ';host=' . $_ENV['DB_HOST'] . ';charset=' . $_ENV['DB_CHARSET'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASS'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }
}
