// src/app/[theme]/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Workshop Not Found</h2>
      <p className="text-gray-600">
        The workshop you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
  );
}
