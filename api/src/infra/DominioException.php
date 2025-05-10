<?php
class DominioException extends RuntimeException {

    /**
     * @var string[]
     */
    private array $problemas = [];

    /**
     * Retorna os problemas
     *
     * @return string[]
     */
    public function getProblemas(): array {
        return $this->problemas;
    }

    /**
     * Cria uma exceção.
     *
     * @param string[] $problemas
     * @return DominioException
     */
    public static function com( array $problemas ): DominioException {
        $e = new DominioException();
        $e->problemas = $problemas;
        return $e;
    }
}