import { Page } from '@playwright/test';

export async function login(page: Page, id: string, password: string) {
  await page.goto('/auth/login');

  await page.getByLabel('아이디').fill(id);
  await page.getByPlaceholder('비밀번호를 입력하세요.').fill(password);

  await Promise.all([page.waitForURL('**/'), page.getByRole('button', { name: '로그인' }).click()]);
}
