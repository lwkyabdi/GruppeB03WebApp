import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Feil e-mail, skriv en gyldig e-mail."),
    password: z.string().min(8, "Passord må inneholde minst 8 tegn."),
});

export const registerSchema = loginSchema.extend({
    name: z.string().trim().min(2, "Navnet må inneholde minst 2 tegn."),
});