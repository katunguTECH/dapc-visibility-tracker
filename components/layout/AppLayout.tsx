import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold">DAPC Visibility Tracker</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}