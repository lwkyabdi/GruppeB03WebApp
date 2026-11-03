// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WatchlistFilter } from "../components/WatchlistFilter";

describe("WatchlistFilter", () => {
  it("viser det som står i URL-en", () => {
    render(<WatchlistFilter params={{ status: "watching", favorite: "true" }} />);

    expect(screen.getByLabelText("Status")).toHaveDisplayValue("Ser nå");
    expect(screen.getByLabelText("Favoritter")).toHaveDisplayValue(
      "Bare favoritter",
    );
  });

  it("står på Alle når ingenting er valgt", () => {
    render(<WatchlistFilter params={{}} />);

    expect(screen.getByLabelText("Status")).toHaveDisplayValue("Alle");
    expect(screen.getByLabelText("Favoritter")).toHaveDisplayValue("Alle");
  });

  it("sender status og favoritt som query-parametere", async () => {
    const user = userEvent.setup();
    render(<WatchlistFilter params={{}} />);

    await user.selectOptions(screen.getByLabelText("Status"), "Ferdig sett");
    await user.selectOptions(
      screen.getByLabelText("Favoritter"),
      "Bare favoritter",
    );

    expect(screen.getByTestId("watchlist-filter")).toHaveFormValues({
      status: "completed",
      favorite: "true",
    });
  });

  it("Nullstill går til lista uten filter", () => {
    render(<WatchlistFilter params={{ status: "completed" }} />);

    expect(screen.getByRole("link", { name: "Nullstill" })).toHaveAttribute(
      "href",
      "/watchlist",
    );
  });
});