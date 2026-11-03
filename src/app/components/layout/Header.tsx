import type { SessionUser } from "@/features/auth/auth-types";
import { Navigation } from "./Navigation";

export function Header({ user }: { user: SessionUser | null }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
      <h2 className="text-xl font-bold">
        <a href="/">MovieMate</a>
      </h2>
      <Navigation user={user} />
    </header>
  );
}