import { expect, type Page } from "@playwright/test";

const GUEST_LOGIN_BUTTON_NAME = /Continue as (Guest|Turtle)/i;
const OAUTH_SIGN_IN_BUTTON_NAME = /Sign in with (GitHub|Google)/i;
const DEPLOYMENT_NOT_FOUND_COPY = "This deployment cannot be found";
const LOGIN_SURFACE_TIMEOUT_MS = 10_000;
const LOGIN_SURFACE_POLL_INTERVAL_MS = 250;

type LoginSurfaceState = "composer" | "guest" | "oauth" | "deployment-not-found";

export class GuestLoginUnavailableError extends Error {
  constructor(message = "Guest login is unavailable in this deployment.") {
    super(message);
    this.name = "GuestLoginUnavailableError";
  }
}

export class DeploymentTargetUnavailableError extends Error {
  constructor(message = "The configured Playwright deployment target is unavailable.") {
    super(message);
    this.name = "DeploymentTargetUnavailableError";
  }
}

export function isGuestLoginUnavailableError(error: unknown): error is GuestLoginUnavailableError {
  return error instanceof GuestLoginUnavailableError;
}

async function isOAuthOnlyLoginVisible(page: Page): Promise<boolean> {
  const authButtons = page.getByRole("button", {
    name: OAUTH_SIGN_IN_BUTTON_NAME,
  });
  const buttonCount = await authButtons.count();

  for (let index = 0; index < buttonCount; index += 1) {
    if (await authButtons.nth(index).isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

async function isDeploymentNotFoundVisible(page: Page): Promise<boolean> {
  return page
    .getByText(DEPLOYMENT_NOT_FOUND_COPY, { exact: false })
    .first()
    .isVisible()
    .catch(() => false);
}

async function getLoginSurfaceState(page: Page): Promise<LoginSurfaceState | null> {
  const composer = page.getByPlaceholder("Start a post");
  if (await composer.isVisible().catch(() => false)) {
    return "composer";
  }

  const guestButton = page.getByRole("button", {
    name: GUEST_LOGIN_BUTTON_NAME,
  });
  if (await guestButton.isVisible().catch(() => false)) {
    return "guest";
  }

  if (await isOAuthOnlyLoginVisible(page)) {
    return "oauth";
  }

  if (await isDeploymentNotFoundVisible(page)) {
    return "deployment-not-found";
  }

  return null;
}

async function waitForLoginSurface(page: Page): Promise<LoginSurfaceState | null> {
  const deadline = Date.now() + LOGIN_SURFACE_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const state = await getLoginSurfaceState(page);
    if (state) {
      return state;
    }

    await page.waitForTimeout(LOGIN_SURFACE_POLL_INTERVAL_MS);
  }

  return getLoginSurfaceState(page);
}

export async function loginAsGuest(page: Page): Promise<void> {
  const composer = page.getByPlaceholder("Start a post");
  const guestButton = page.getByRole("button", {
    name: GUEST_LOGIN_BUTTON_NAME,
  });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const state = await waitForLoginSurface(page);
    if (state === "composer") {
      return;
    }

    if (state === "deployment-not-found") {
      throw new DeploymentTargetUnavailableError(
        "The configured Playwright deployment target is serving Vercel DEPLOYMENT_NOT_FOUND.",
      );
    }

    if (state === "oauth") {
      throw new GuestLoginUnavailableError(
        "Guest login is unavailable in this deployment; only OAuth sign-in is exposed.",
      );
    }

    if (state === "guest") {
      await guestButton.click({ timeout: 15_000 });
      await page.waitForLoadState("domcontentloaded").catch(() => {});

      const postClickState = await waitForLoginSurface(page);
      if (postClickState === "composer") {
        return;
      }

      if (postClickState === "deployment-not-found") {
        throw new DeploymentTargetUnavailableError(
          "The configured Playwright deployment target is serving Vercel DEPLOYMENT_NOT_FOUND.",
        );
      }

      if (postClickState === "oauth") {
        throw new GuestLoginUnavailableError(
          "Guest login is unavailable in this deployment; only OAuth sign-in is exposed.",
        );
      }
    }

    await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
  }

  await expect(composer).toBeVisible({ timeout: 20_000 });
}
