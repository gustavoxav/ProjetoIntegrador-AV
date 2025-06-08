<?php
class AuthHelper
{
    private const PIMENTA = 'projetoI123456';

    public static function verificarSenha(string $senha, string $salt, string $hash): bool
    {
        return hash('sha512', $salt . $senha . self::PIMENTA) === $hash;
    }
}
