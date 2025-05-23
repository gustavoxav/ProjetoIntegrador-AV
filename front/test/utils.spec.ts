import { expect, describe, it } from "vitest";
import { formatarDataHora } from "../src/infra/utils";

describe("utils", () => {
  describe("formatarDataHora", () => {
    it("Deve formatar uma data ISO corretamente", () => {
      const isoString = "2025-05-20T15:55:14Z";
      const resultado = formatarDataHora(isoString);
      
      expect(resultado).toMatch(/^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/);
    });

    it("Deve formatar uma data específica corretamente", () => {
      const isoString = "2024-03-15T08:30:00Z";
      const resultado = formatarDataHora(isoString);
      
      expect(resultado).toBe("15/03/2024 - 05:30"); // por causa do fuso horário
    });
  });
}); 