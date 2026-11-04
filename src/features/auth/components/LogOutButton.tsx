"use client";

import { useEffect, useState } from "react";
import { signOut } from "../auth-api";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setIsLoading(true);
    setError(null);

    const result = await signOut();
    setIsLoading(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    window.location.replace("/login");
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={!isReady || isLoading}
        className= "rounded-md border px-3 py-1 hover:bg-slate-50 disabled:opacity-10"
      >
        {isLoading ? "Logger ut..." : "Logg ut"}
      </button>
      {error && (
        <span role="alert" className="text-red-500">
          {error}
        </span>
      )}
    </>
  );
}