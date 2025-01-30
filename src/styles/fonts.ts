import { Nunito } from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"], // Include the Latin subset
  weight: ["400", "600", "700"], // Add '600' for Semi-Bold, along with others if needed
  variable: "--font-nunito", // Optional CSS variable for global use
});
