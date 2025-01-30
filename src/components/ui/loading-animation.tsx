// src/components/ui/loading-animation.tsx

export default function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center h-16">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
    </div>
  );
}
