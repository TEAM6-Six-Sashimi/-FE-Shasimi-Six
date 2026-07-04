import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

const COURSE_URL = "/courses/정보처리기사/1";

test.describe("수강평 읽기 전용", () => {

  test.beforeEach(async ({ page }) => {
    // 구매하지 않은 학생 계정
    await login(page, "student06", "student");

    await page.goto(COURSE_URL);
  });

  test("구매하지 않은 학생은 리뷰 작성 폼이 보이지 않는다.", async ({ page }) => {

    await expect(
      page.getByRole("heading", {
        name: "수강평 작성하기",
      })
    ).not.toBeVisible();

  });

  test("구매 후 리뷰를 작성할 수 있다는 안내가 보인다.", async ({ page }) => {

    await expect(
      page.getByText("강의 구매 후 리뷰를 작성할 수 있습니다.")
    ).toBeVisible();

  });

  test("기존 리뷰 목록은 조회할 수 있다.", async ({ page }) => {

    await expect(
      page.getByRole("navigation", {
        name: "수강평 정렬",
      })
    ).toBeVisible();

  });

});