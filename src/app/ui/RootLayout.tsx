import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <main className="mx-auto max-w-screen-lg px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
