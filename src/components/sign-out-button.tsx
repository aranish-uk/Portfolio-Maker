"use client";

import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export function SignOutButton() {
  return (
    <button
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/30 hover:text-red-300"
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      title="Log off"
    >
      <ArrowRightStartOnRectangleIcon className="size-5" />
      <span className="hidden sm:inline">Log off</span>
    </button>
  );
}
