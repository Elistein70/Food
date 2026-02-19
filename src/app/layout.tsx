import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kosher Star Kitchen",
  description: "Michelin-star level Kosher recipes for everyday home cooks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50 text-gray-900 antialiased">
        <header className="bg-white shadow-sm border-b border-amber-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✡</span>
              <div>
                <h1 className="text-xl font-bold text-amber-800 leading-tight">
                  Kosher Star Kitchen
                </h1>
                <p className="text-xs text-amber-600">
                  Michelin-level cooking, made for everyone
                </p>
              </div>
            </div>
            <nav className="flex gap-4">
              <a
                href="/"
                className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-100"
              >
                Recipes
              </a>
              <a
                href="/appliances"
                className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-100"
              >
                My Kitchen
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-amber-200 bg-white mt-16">
          <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-amber-600">
            Recipes are strictly Kosher. Always verify ingredients carry valid Kosher certification.
          </div>
        </footer>
      </body>
    </html>
  );
}
