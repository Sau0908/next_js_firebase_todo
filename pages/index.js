import Image from "next/image";
import { Inter } from "next/font/google";
import Login from "@/components/Auth/Login";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}
