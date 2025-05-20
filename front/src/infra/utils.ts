export async function navegarPara(
  seletor: string,
  urlEsperada: string,
  page: any
) {
  await page.locator(seletor).click();
  await page.waitForURL(`**/${urlEsperada}`);
}
