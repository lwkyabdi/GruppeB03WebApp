// Testen er laget med hjelp av ChatGPT.
// Testen avdekket at skjemaene kunne brukes før React var klart.
// Med AI ble LoginForm.tsx og RegisterForm.tsx endret slik at
// felt og knapper er deaktivert frem til React er klart (isready og useeffect).
// Skjemaene fikk også method="post", slik at vanlig innsending ikke legger passord i URL-en.
// Etter rettelsen ble hovedflyt-testen kjørt på nytt og bestod.
// test med i terminal:
// npm run test:e2e:headed -- e2e/watchlist-flow.e2e.ts

import { test, expect } from "@playwright/test";

test("brukeren kan søke, lagre en film og markere den som favoritt", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "MovieMate-test123!";

  await page.goto("/register");
  await page.getByLabel("Navn", { exact: true }).fill("Testbruker");
  await page.getByLabel("E-post", { exact: true }).fill(email);
  await page.getByLabel("Passord", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Registrer deg", exact: true }).click();
  await expect(page).toHaveURL("/");

  await page.getByRole("button", { name: "Logg ut", exact: true }).click();
  await expect(page).toHaveURL("/login");

  await page.getByLabel("E-post", { exact: true }).fill(email);
  await page.getByLabel("Passord", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Logg inn", exact: true }).click();
  await expect(page).toHaveURL("/");

  await page.getByRole("link", { name: "Søk", exact: true }).click();
  await page.getByLabel("Filmtittel").fill("Interstellar");
  await page.getByRole("button", { name: "Søk", exact: true }).click();

  const movieCard = page.locator(".movie-card").filter({
    has: page.getByRole("heading", {
      name: "Interstellar",
      exact: true,
    }),
  });

  await movieCard.getByRole("link").click();
  await expect(
    page.getByRole("heading", { name: "Interstellar", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", {
    name: "Legg til i watchlist",
    exact: true,
  }).click();

  await expect(
    page.getByRole("button", { name: "I watchlisten", exact: true }),
  ).toBeDisabled();

  await page.getByRole("link", { name: "Watchlist", exact: true }).click();
  await page.reload();

  const savedMovie = page.getByTestId("watchlist-item").filter({
    hasText: "Interstellar",
  });
  await expect(savedMovie).toHaveCount(1);

  // Marker filmen som favoritt og vis bare favoritter.
  await savedMovie.getByRole("button", { name: "Legg til i favoritter" }).click();
  await expect(
    savedMovie.getByRole("button", { name: "Fjern fra favoritter" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("combobox", { name: "Favoritter", exact: true }).selectOption("true");
  await page.getByRole("button", { name: "Filtrer", exact: true }).click();
  await expect(page).toHaveURL(/favorite=true/);
  await expect(savedMovie).toHaveCount(1);

  // Favorittmarkeringen skal være lagret også etter oppdatering.
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Favoritter", exact: true })).toHaveValue("true");
  await expect(
    savedMovie.getByRole("button", { name: "Fjern fra favoritter" }),
  ).toHaveAttribute("aria-pressed", "true");

  // Fjern favorittmarkeringen. Filmen skal fortsatt ligge i watchlisten.
  await savedMovie.getByRole("button", { name: "Fjern fra favoritter" }).click();
  await expect(savedMovie).toHaveCount(0);
  await page.getByRole("link", { name: "Nullstill", exact: true }).click();
  await expect(savedMovie).toHaveCount(1);
  await expect(
    savedMovie.getByRole("button", { name: "Legg til i favoritter" }),
  ).toHaveAttribute("aria-pressed", "false");
});
