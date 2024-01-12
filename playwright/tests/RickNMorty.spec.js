import { test, expect } from "@playwright/test";

const PAGE_LINK = "https://vvatom.github.io/rick-and-morty-lottery/";
const ID_REG_EX = /^ID:.*/;
test.describe("Rick and Morty characters", async () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(PAGE_LINK);
    const title = page.getByText("Rick and Morty characters");
    expect(title).toBeDefined();
    await page.getByText("YES").click();
    testInfo.setTimeout(testInfo.timeout + 5000);
  });

  test("change character", async ({ page }) => {
    const firstID = await page.getByText(ID_REG_EX).textContent();
    expect(firstID).toBeDefined();
    await page.locator(".portal__image").click();

    const secondID = await page.getByText(ID_REG_EX).textContent();
    expect(secondID).toBeDefined();

    expect(firstID).not.toBe(secondID);
  });
});
