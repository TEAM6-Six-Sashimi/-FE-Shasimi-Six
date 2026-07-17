import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

const COURSE_URL = "/courses/정보처리기사/1";

test.describe("강의 재생 - 미리보기(비구매자)", () => {

  test.beforeEach(async ({ page }) => {
    // 구매하지 않은 학생 계정
    await login(page, "student06", "student");
    await page.goto(COURSE_URL);
  });

  test("미리보기 세션의 영상 길이가 0:00에 고정되지 않고 정상 표시된다.", async ({ page }) => {

    await page.getByRole("link", { name: "재생" }).first().click();

    await expect(page).toHaveURL(/\/player\//);
    await expect(page.getByText("0:00 / 0:00")).not.toBeVisible();

  });

  test("미리보기 종료를 눌러도 강제 로그아웃되지 않는다.", async ({ page }) => {

    await page.getByRole("link", { name: "재생" }).first().click();
    await expect(page).toHaveURL(/\/player\//);

    await page.getByRole("button", { name: "미리보기 종료" }).click();

    await expect(page.getByText("로그인이 필요합니다.")).not.toBeVisible();
    await expect(page.getByRole("link", { name: "로그인" })).not.toBeVisible();

  });

});
