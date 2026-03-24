import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "Kenya Market Intelligence Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}