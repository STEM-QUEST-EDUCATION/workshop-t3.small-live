

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-[400px] mx-auto">
        {/* Video player skeleton - 9:16 aspect ratio for vertical video */}
        <div className="relative w-full aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 animate-spin text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>

        
      </div>
    </div>
  )
}

