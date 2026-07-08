import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

const COURSE_URL = "/courses/정보처리기사/1";

test.describe("리뷰 삭제", () => {

  test.beforeEach(async ({ page }) => {
    await login(page, "student01", "student");
    await page.goto(COURSE_URL);
  });

  test("본인 리뷰를 삭제할 수 있다.", async ({ page }) => {

    await page.getByLabel("수강평 삭제").click();

    await expect(
      page.getByText("수강평 삭제 확인")
    ).toBeVisible();

    await page.getByRole("button", {
      name: "확인",
    }).click();

    await expect(
      page.getByText("수강평이 삭제되었습니다.")
    ).toBeVisible();

  });

  test("삭제를 취소할 수 있다.", async ({ page }) => {

    await page.getByLabel("수강평 삭제").click();

    await page.getByRole("button", {
      name: "취소",
    }).click();

    await expect(
      page.getByText("수강평 삭제 확인")
    ).not.toBeVisible();

  });

});