import { AuthUserProvider } from "@/context/useAuth";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
