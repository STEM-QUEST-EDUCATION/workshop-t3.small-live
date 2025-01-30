import { useRouter } from "next/navigation"; // Use Next.js router
import Image from "next/image";

export default function BackButton() {
  const router = useRouter(); // Initialize router

  const handleGoBack = () => {
    router.push("/"); // Navigate to the previous page
  };

  return (
    <button
      onClick={handleGoBack}
      className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
    >
      <Image
        src="/buttons/back-button.svg"
        alt="Go Back"
        width={25}
        height={25}
      />
    </button>
  );
}
