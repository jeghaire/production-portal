import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-heading text-2xl">Something went wrong!</h1>
      <p>We could not find the requested page.</p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
