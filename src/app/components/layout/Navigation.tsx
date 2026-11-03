import { SessionUser } from "@/features/auth/auth-types";
import { LogoutButton } from "@/features/auth/components/LogOutButton";

export function Navigation({ user }: { user: SessionUser | null }) {
  return (
    <nav className="navigation">
      <a href="/">Hjem</a>
      <a href="/search">Søk</a>
      {user ? (
        <>
          <a href="/watchlist">
            Watchlist
          </a>
          <span>{user.name}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <a href="/login">
            Logg inn
          </a>
          <a href="/register">
            Registrer deg
          </a>
        </>
      )}
    </nav>
  );
}
