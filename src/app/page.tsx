export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-bold tracking-tight">SecureGate</h1>
        <p className="text-[clamp(0.875rem,2.5vw,1.25rem)] text-gray-500">
          Simple, secure authentication for your apps.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
          <a
            href="/auth?mode=signup"
            className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500"
          >
            Get started
          </a>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/auth?mode=login" className="text-indigo-600 hover:underline">
              Sign in
            </a>
          </p>
      </div>
    </div>
  );
}
