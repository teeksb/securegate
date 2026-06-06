import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth?mode=login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-center text-gray-900">Dashboard</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <span>Verified</span>
            <span>✓</span>
          </span>
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Name
            </p>
            <p className="text-sm font-medium text-gray-900">
              {session.user.name ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email
            </p>
            <p className="text-sm text-gray-700">{session.user.email}</p>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/auth?mode=login" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-400"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
