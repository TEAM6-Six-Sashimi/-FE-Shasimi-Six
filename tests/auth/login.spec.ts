import { test, expect } from "@playwright/test";

test("학생 로그인 성공", async ({ page }) => {

  await page.goto("/auth/login");

  await page.getByLabel("아이디").fill("student01");
  await page.getByLabel("비밀번호").fill("student");

  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL("/");

});