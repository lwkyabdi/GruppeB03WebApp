import type { SessionUser } from "@/features/auth/auth-types";
import { LogoutButton } from "@/features/auth/components/LogOutButton";

export function Header({ user }: { user: SessionUser | null }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
      <h2 className="text-xl font-bold">
        <a href="/">MovieMate</a>
      </h2>
      <nav className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span>{user.name}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <a className="underline" href="/login">
              Logg inn
            </a>
            <a className="underline" href="/register">
              Registrer deg
            </a>
          </>
        )}
      </nav>
    </header>
  );
}