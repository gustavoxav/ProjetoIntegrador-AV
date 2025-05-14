<?php

try {

  $pdo = new PDO(
    'mysql:host=localhost;charset=utf8',
    'root',
    '',
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