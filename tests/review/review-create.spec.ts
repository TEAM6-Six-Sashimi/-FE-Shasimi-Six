import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

const COURSE_URL = "/courses/정보처리기사/1";

test.describe("수강평 작성", () => {

  test.beforeEach(async ({ page }) => {
    await login(page, "student01", "student");
    await page.goto(COURSE_URL);
  });

  test("정상적으로 리뷰를 작성할 수 있다.", async ({ page }) => {

    await page.getByLabel("5점").click();

    await page
      .locator("#review-content")
      .fill("Playwright 자동 테스트입니다.");

    await page
      .getByRole("button", { name: "리뷰 등록" })
      .click();

    await expect(
      page.getByText("리뷰 등록 확인")
    ).toBeVisible();

    await page
      .getByRole("button", { name: "확인" })
      .click();

    await expect(
      page.getByText("리뷰가 등록되었습니다.")
    ).toBeVisible();

  });

  test("평점을 선택하지 않으면 작성할 수 없다.", async ({ page }) => {

    await page.locator("#review-content")
      .fill("내용만 입력");

    await page.getByRole("button", {
      name: "리뷰 등록",
    }).click();

    await expect(
      page.getByText("평점을 선택해주세요.")
    ).toBeVisible();

  });

  test("내용을 입력하지 않으면 작성할 수 없다.", async ({ page }) => {

    await page.getByLabel("5점").click();

    await page.getByRole("button", {
      name: "리뷰 등록",
    }).click();

    await expect(
      page.getByText("내용을 입력해주세요.")
    ).toBeVisible();

  });

  test("공백만 입력하면 작성할 수 없다.", async ({ page }) => {

    await page.getByLabel("5점").click();

    await page.locator("#review-content")
      .fill("      ");

    await page.getByRole("button", {
      name: "리뷰 등록",
    }).click();

    await expect(
      page.getByText("내용을 입력해주세요.")
    ).toBeVisible();

  });

  test("200자를 초과하면 자동으로 잘린다.", async ({ page }) => {

    await page.getByLabel("5점").click();

    const text = "가".repeat(250);

    await page.locator("#review-content")
      .fill(text);

    await expect(
      page.locator("#review-content")
    ).toHaveValue("가".repeat(200));

  });

  test("등록 확인 모달에서 취소하면 등록되지 않는다.", async ({ page }) => {

    await page.getByLabel("5점").click();

    await page.locator("#review-content")
      .fill("취소 테스트");

    await page
      .getByRole("button", { name: "리뷰 등록" })
      .click();

    await page
      .getByRole("button", { name: "취소" })
      .click();

    await expect(
      page.getByText("리뷰 등록 확인")
    ).not.toBeVisible();

  });

});