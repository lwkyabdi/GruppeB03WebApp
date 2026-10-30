import { RouteMiddleware } from "rwsdk/router";
import { auth } from "./auth";
import { toSessionUser } from "./auth-types";


export const setUser: RouteMiddleware = async ({ ctx, request }) => {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        ctx.user = session ? toSessionUser(session.user) : null;
    } catch (error) {
        console.error("Kunne ikke lese sesjon: ", error);
        ctx.user = null;
    }
};

export const requireUser: RouteMiddleware = ({ ctx }) => {
  if (!ctx.user) {
    return Response.json(
      {
        ok: false,
        error: {
          code: "401",
          message: "Du må være innlogget. Logg inn ved å gå til /login",
          fieldErrors: {},
        },
      },
      { status: 401 },
    );
  }
};

export const requireUserPage: RouteMiddleware = ({ ctx }) => {
  if (!ctx.user) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }
};