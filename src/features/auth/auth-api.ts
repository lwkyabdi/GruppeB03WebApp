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