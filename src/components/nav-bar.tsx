import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function NavBar() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-sm font-bold text-white">
            M
          </span>
          MediaMonitor
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Search
          </Link>

          {session?.user && (
            <>
              <Link
                href="/subscriptions"
                className="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Subscriptions
              </Link>
              <Link
                href="/alerts"
                className="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Alerts
              </Link>
            </>
          )}

          {session?.user ? (
            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-3">
              <span className="hidden text-slate-500 sm:inline">{session.user.email}</span>
              <SignOutButton />
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-3">
              <Link
                href="/login"
                className="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-slate-900 px-3 py-2 font-medium text-white hover:bg-slate-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
