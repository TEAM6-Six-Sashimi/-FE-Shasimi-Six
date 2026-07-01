import { Page } from "@playwright/test";

export async function login(
  page: Page,
  id: string,
  password: string
) {
  await page.goto("/auth/login");

  await page.getByLabel("아이디").fill(id);
  await page.getByLabel("비밀번호").fill(password);

  await page.getByRole("button", { name: "로그인" }).click();

  await page.waitForURL("/");
}