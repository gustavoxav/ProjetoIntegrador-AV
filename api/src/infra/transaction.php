<?php

/**
 * Conexão com banco de dados e retorno do objeto pdo
 * @return PDO
 */
function conectarPDO(): PDO
{
    return new PDO(
        'mysql:dbname=database_g9;host=localhost;charset=utf8',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}
