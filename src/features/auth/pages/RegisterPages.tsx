import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  return (
    <main className="mx-auto max-w-md p-8 font-sans">
      <h1 className="text-3xl font-bold">Registrer deg</h1>
      <RegisterForm />
      <p className="mt-6 text-sm">
        Har du allerede en konto?{" "}
        <a className="underline" href="/login">
          Logg inn
        </a>
      </p>
    </main>
  );
}