// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600">Page not found</p>
        <a href="/" className="text-blue-600 mt-4 inline-block">Go home</a>
      </div>
    </div>
  );
}