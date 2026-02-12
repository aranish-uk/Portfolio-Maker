"use client";

import { signIn } from "next-auth/react";

type ProviderConfig = { id: string; label: string };

export function SignInButtons({ providers }: { providers: ProviderConfig[] }) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-left text-sm font-medium text-slate-100 transition hover:border-indigo-500 hover:bg-slate-800"
        >
          Continue with {provider.label}
        </button>
      ))}
      {!providers.length ? (
        <p className="text-sm text-amber-300">
          No auth provider is configured. Add OAuth credentials in environment variables.
        </p>
      ) : null}
    </div>
  );
}
