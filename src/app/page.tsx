export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight">SecureGate</h1>
        <p className="text-lg text-gray-500">
          Simple, secure authentication for your apps.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <a
          href="/signup"
          className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500"
        >
          Get started
        </a>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="underline text-indigo-600">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
