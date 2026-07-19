import { test, expect } from "@playwright/test";
import { login } from "../utils/login";

const COURSE_URL = "/courses/정보처리기사/1";

test.describe("수강평 신고", () => {

  test.beforeEach(async ({ page }) => {
    await login(page, "instructor01", "instructor");
    await page.goto(COURSE_URL);
  });

  test("욕설 및 비방으로 신고할 수 있다.", async ({ page }) => {

    await page.getByLabel("수강평 신고").first().click();

    await page.getByText("욕설 및 비방").click();

    await page
      .getByPlaceholder("신고 사유를 입력해주세요")
      .fill("욕설이 포함되어 있습니다.");

    await page
      .getByRole("button", { name: "신고하기" })
      .click();

    await expect(
      page.getByText("신고가 접수되었습니다.")
    ).toBeVisible();

  });

  test("사유를 선택하지 않으면 신고할 수 없다.", async ({ page }) => {

    await page.getByLabel("수강평 신고").first().click();

    await page
      .getByRole("button", { name: "신고하기" })
      .click();

    await expect(
      page.getByText("신고 사유를 선택해주세요.")
    ).toBeVisible();

  });

  test("욕설 선택 후 내용 없이도 신고할 수 있다.", async ({ page }) => {

    await page.getByLabel("수강평 신고").first().click();

    await page.getByText("욕설 및 비방").click();

    await page
      .getByRole("button", { name: "신고하기" })
      .click();

    await expect(
      page.getByText("신고가 접수되었습니다.")
    ).toBeVisible();

  });

  test("기타는 내용을 입력하지 않으면 신고할 수 없다.", async ({ page }) => {

    await page.getByLabel("수강평 신고").first().click();

    await page.getByText("기타").click();

    await page
      .getByRole("button", { name: "신고하기" })
      .click();

    await expect(
      page.getByText("상세 사유를 입력해주세요.")
    ).toBeVisible();

  });

});