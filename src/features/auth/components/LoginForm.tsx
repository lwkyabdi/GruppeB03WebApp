"use client";

import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { signIn } from "../auth-api";
import { loginSchema } from "../auth-validation";
import { FormField } from "./FormField";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    const result = await signIn(parsed.data);
    setIsLoading(false);

    if (!result.ok) {
+      setError(result.error.message);
      return;
    }
    window.location.replace("/");
  }

    return (
        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-3">
            <FormField
                label="E-post"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                error={fieldErrors.email?.[0]}
                disabled={isLoading}
                autoComplete="email"
            />
            <FormField
                label="Passord"
                name="password"
                type="password"
                value={password}
                onChange={setPassword}
                error={fieldErrors.password?.[0]}
                disabled={isLoading}
                autoComplete="current-password"
            />
            
            <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
            >
                {isLoading ? "Logger inn..." : "Logg inn"}
            </button>

            {error && (
                <p role="alert" className="text-sm text-red-600">
                {error}
            </p>
            )}
        </form>
    );
}