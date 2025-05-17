<?php

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

try {

  $pdo = new PDO(
    'mysql:host=' . $_ENV['DB_HOST'] . ';charset=' . $_ENV['DB_CHARSET'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );

  $sql = stream_get_contents(STDIN);

  if (!$sql) {
    throw new Exception("Nenhum conteúdo recebido.");
  }

  $pdo->exec($sql);
} catch (Exception $e) {
  echo "Erro: " . $e->getMessage() . "\n";
  exit(1);
}