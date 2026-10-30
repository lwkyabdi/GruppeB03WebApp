import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { env } from "cloudflare:workers";
import { db, schema } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseUrl: env.BETTER_AUTH_URL,
    emailPassword: {
        enabled: true,
        minPasswordLength: 8
    },
});