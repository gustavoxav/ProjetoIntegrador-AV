import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const gerenteFile = 'playwright/.auth/gerente.json';
const atendenteFile = 'playwright/.auth/atendente.json';
const mecanicoFile = 'playwright/.auth/mecanico.json';

setup('authenticate as gerente', async ({ request }) => {
  await request.post(`${process.env.VITE_API_URL}/login`, {
    form: {
      'cpf': '11111111111',
      'senha': '123456'
    }
  });
  await request.storageState({ path: gerenteFile });
});

setup('authenticate as atendente', async ({ request }) => {
  await request.post(`${process.env.VITE_API_URL}/login`, {
    form: {
      'cpf': '22222222222',
      'senha': '123456'
    }
  });
  await request.storageState({ path: atendenteFile });
});

setup('authenticate as mecanico', async ({ request }) => {
  await request.post(`${process.env.VITE_API_URL}/login`, {
    form: {
      'cpf': '33333333333',
      'senha': '123456'
    }
  });
  await request.storageState({ path: mecanicoFile });
});