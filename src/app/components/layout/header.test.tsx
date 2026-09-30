// @vitest-environment happy-dom

import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

test("headeren viser MovieMate", () => {
  render(<Header />);
  expect(screen.getByRole("heading", { name: "MovieMate" }))
    .toBeInTheDocument();
});

//testen er satt opp av AI, kun for å sjekke at headeren vises.