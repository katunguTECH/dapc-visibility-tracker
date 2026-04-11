// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DAPC Visibility Audit',
  description: 'Check your business visibility online',
};

// Simple layout without any complex imports
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap children with error boundary */}
        <RootLayoutErrorBoundary>
          {children}
        </RootLayoutErrorBoundary>
      </body>
    </html>
  );
}

// Client component to catch errors
function RootLayoutErrorBoundary({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
  
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Layout error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <button onClick={() => window.location.reload()}>Reload page</button>
      </div>
    );
  }
}