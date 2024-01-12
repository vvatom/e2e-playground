import { test, expect } from "@playwright/test";

const PAGE_LINK = "https://vvatom.github.io/to-do-list/";

const TASKS = ["test 1", "test 2", "test 3"];
const TASKS_COUNTER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

test.describe("ToDo List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_LINK);
    await page.getByPlaceholder("Type your task...").click();
    await page.getByPlaceholder("Type your task...").fill("check test");
    await page.getByRole("button", { name: "+" }).click();
  });

  test("should load website", async ({ page }) => {
    await expect(page).toHaveTitle("Tasks list");
    const title = page.getByText("Tasks list");
    expect(title).toBeDefined();
  });

  test("should display task as Done", async ({ page }) => {
    const task = page.getByText("check test");
    await task.click();
    const doneFilter = page.getByText("Done");
    await doneFilter.click();
    expect(page.getByText("check test")).toBeDefined();
  });

  test("should display task as To do", async ({ page }) => {
    const doneFilter = page.getByText("To do");
    await doneFilter.click();
    expect(page.getByText("check test")).toBeDefined();
  });

  test("should be able to remove task", async ({ page }) => {
    const remove = page.locator(`//button[contains(@class, 'taskButton')]`);
    await remove.click();
    const test = page.getByText("check test");
    expect(test).toHaveCount(0);
  });

  test("should be able to add multiple tasks", async ({ page }) => {
    for await (const item of TASKS) {
      await page.getByPlaceholder("Type your task...").click();
      await page.getByPlaceholder("Type your task...").fill(item);
      await page.getByRole("button", { name: "+" }).click();
    }

    for await (const item of TASKS) {
      expect(page.getByText(item)).toBeDefined();
    }
  });

  test("should be able to add task with Enter key", async ({ page }) => {
    await page.getByPlaceholder("Type your task...").click();
    await page.getByPlaceholder("Type your task...").fill("enter key");
    await page.keyboard.press("Enter");
  });

  test("should be able to scroll the task list", async ({ page }) => {
    for await (const item of TASKS_COUNTER) {
      await page.getByPlaceholder("Type your task...").click();
      await page.getByPlaceholder("Type your task...").fill(item);
      await page.getByRole("button", { name: "+" }).click();
    }

    const lastElement = page.getByText("10");
    await lastElement.scrollIntoViewIfNeeded();
    expect(lastElement).toBeVisible();
  });

  test("should display tasks correctly after page reload", async ({ page }) => {
    await page.getByPlaceholder("Type your task...").click();
    await page.getByPlaceholder("Type your task...").fill("refresh");
    await page.getByRole("button", { name: "+" }).click();

    await page.reload();
    expect(page.getByText("refresh")).toBeDefined();
  });

  test.describe("specific viewport block", () => {
    test.use({ viewport: { width: 800, height: 1600 } });

    test("should display tasks correctly on a mobile screen", async ({
      page,
    }) => {
      expect(page.getByText("check test")).toBeDefined();
    });
  });
});
