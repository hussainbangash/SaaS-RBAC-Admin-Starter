import Link from "next/link";
import { signInWithCredentials } from "./actions";
import { demoAccounts, getDemoAccount } from "@/lib/auth/demo-accounts";

type LoginSearchParams = Promise<{
  demo?: string | string[];
  error?: string | string[];
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  const params = await searchParams;
  const selectedAccount = getDemoAccount(params.demo);
  const hasAuthError = Boolean(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            SaaS RBAC Starter
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Use a seeded demo account or enter credentials for a user created by
            an admin.
          </p>
        </div>

        <form action={signInWithCredentials} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={selectedAccount.email}
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:placeholder:text-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={selectedAccount.password}
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:placeholder:text-transparent"
              required
            />
          </div>

          {hasAuthError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Invalid email or password.
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Demo accounts
          </p>

          <div className="grid gap-2">
            {demoAccounts.map((account) => (
              <Link
                key={account.email}
                href={`/login?demo=${account.id}`}
                className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm transition hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">
                  {account.label}
                </span>
                <span className="block text-slate-500">{account.email}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
