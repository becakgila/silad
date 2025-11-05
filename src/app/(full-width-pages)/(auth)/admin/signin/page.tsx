import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Silad UPR SignIn Page",
  description: "Aplikasi Sistem Layanan Akademik Digital Universitas Palangka Raya",
};

export default function SignIn() {
  return <SignInForm />;
}
