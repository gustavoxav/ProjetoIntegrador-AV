import { expect, describe, it } from "vitest";
import { ErroDominio } from "../src/infra/ErroDominio";

describe("ErroDominio", () => {
  describe("constructor", () => {
    it("Deve criar uma instância sem mensagem", () => {
      const erro = new ErroDominio();
      
      expect(erro).toBeInstanceOf(Error);
      expect(erro).toBeInstanceOf(ErroDominio);
      expect(erro.getProblemas()).toEqual([]);
    });

    it("Deve criar uma instância com mensagem", () => {
      const mensagem = "Mensagem";
      const erro = new ErroDominio(mensagem);
      
      expect(erro.message).toBe(mensagem);
      expect(erro.getProblemas()).toEqual([]);
    });
  });

  describe("comProblemas", () => {
    it("Deve criar uma instância com problemas", () => {
      const problemas = ["1", "2", "3"];
      const erro = ErroDominio.comProblemas(problemas);
      
      expect(erro).toBeInstanceOf(ErroDominio);
      expect(erro.getProblemas()).toEqual(problemas);
    });

    it("Deve criar uma instância com array vazio de problemas", () => {
      const erro = ErroDominio.comProblemas([]);
      
      expect(erro.getProblemas()).toEqual([]);
    });
  });

  describe("setProblemas", () => {
    it("Deve definir problemas em uma instância existente", () => {
      const erro = new ErroDominio();
      const problemas = ["1", "2"];
      
      erro.setProblemas(problemas);
      
      expect(erro.getProblemas()).toEqual(problemas);
    });

    it("Deve sobrescrever problemas existentes", () => {
      const problemasIniciais = ["1"];
      const erro = ErroDominio.comProblemas(problemasIniciais);
      
      const novosProblemas = ["2", "3"];
      erro.setProblemas(novosProblemas);
      
      expect(erro.getProblemas()).toEqual(novosProblemas);
      expect(erro.getProblemas()).not.toContain("1");
    });
  });

  describe("getProblemas", () => {
    it("Deve retornar array vazio quando não há problemas", () => {
      const erro = new ErroDominio();
      
      expect(erro.getProblemas()).toEqual([]);
      expect(erro.getProblemas()).toHaveLength(0);
    });

    it("Deve retornar todos os problemas definidos", () => {
      const problemas = ["1", "2", "3"];
      const erro = ErroDominio.comProblemas(problemas);
      
      const problemasRetornados = erro.getProblemas();
      
      expect(problemasRetornados).toEqual(problemas);
      expect(problemasRetornados).toHaveLength(3);
    });
  });

  describe("comportamento como Error", () => {
    it("Deve poder ser capturado como Error", () => {
      const erro = ErroDominio.comProblemas(["1"]);
      
      expect(() => {
        throw erro;
      }).toThrow(Error);
    });

    it("Deve poder ser usado em instanceof checks", () => {
      const erro = ErroDominio.comProblemas(["1"]);
      
      expect(erro instanceof Error).toBe(true);
      expect(erro instanceof ErroDominio).toBe(true);
    });
  });
}); 