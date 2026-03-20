import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <WhatsAppButton /> {/* It stays fixed to the bottom right */}
        </body>
      </html>
    </ClerkProvider>
  );
}