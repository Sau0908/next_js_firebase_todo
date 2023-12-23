import Image from "next/image";
import { Inter } from "next/font/google";
import Login from "@/components/Auth/Login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}
