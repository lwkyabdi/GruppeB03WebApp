import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";
import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { SessionUser } from "./features/auth/auth-types";
import { requireUser, setUser } from "./features/auth/middleware";
import { authRoutes } from "./features/auth/auth-routes";

/**
 * Alt som ligger på `ctx` for én forespørsel.
 *
 * Tom nå. Legger dere til `user` her, blir `ctx.user` typet i hele appen,
 * fordi types/rw.d.ts mater denne typen inn i rwsdk.
 */
export type AppContext = {
  user: SessionUser | null;
};

const app = defineApp([
  // Middleware. Kjører for hver forespørsel, i rekkefølgen de står.
  setCommonHeaders(),
  setUser,
  ...authRoutes,
  route("/api/status", () => Response.json({ status: "ok", version: "0.1.0" })),

  route("/api/me", [
  requireUser,
  ({ ctx }) => Response.json({ ok: true, data: ctx.user }),
]),

  // API-rute. Ligger UTENFOR render(), så svaret er akkurat det handleren
  // returnerer: JSON, uten HTML-skall rundt.
  route("/api/status", () =>
    Response.json({ status: "ok", version: "0.1.0" })
  ),

  // Sider. render(Document, [...]) pakker dem i et helt HTML-dokument.
  render(Document, [route("/", Home)]),
]);

export default { fetch: app.fetch };
