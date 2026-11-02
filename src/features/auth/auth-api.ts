import { authClient } from "./auth-client";

export type AuthResult = | { ok: true } | { ok: false; error: { message: string } };

export async function signIn(input: {
    email: string;
    password: string;
}): Promise<AuthResult> {
    try {
        const { error } = await authClient.signIn.email(input);
        if (error) {
            return { ok: false, error: { message: "Feil e-mail eller passord" } };
        }
        return { ok: true };
    } catch (error) {
        console.error(error);
        return { ok: false, error: { message: "Ingen kontakt med server, prøv igjen." } };
    }
};

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
        const { error } = await authClient.signUp.email(input);
        if (error) {
            if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
                return { ok: false, error: { message: "E-posten er allerede i bruk, skriv ny e-post." } };
            }
            return { ok: false, error: { message: "Kunne ikke lage bruker, prøv igjen." } };
        }
        return { ok: true };
    } catch (error) {
        console.error(error);
        return { ok: false, error: { message: "Ingen kontakt med server, prøv igjen." } };
    }
};

