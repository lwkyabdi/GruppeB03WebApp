import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-8 font-sans">
      <h1 className="text-3xl font-bold">Logg inn</h1>
      <LoginForm />
      <p className="mt-6 text-sm">
        Ingen konto?{" "}
        <a className="underline" href="/register">
          Registrer deg
        </a>
      </p>
    </main>
  );
}