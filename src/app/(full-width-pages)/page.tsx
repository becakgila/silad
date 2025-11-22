import SignInFormMhs from "@/components/auth/SignInFormMhs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Silad UPR Admin SignIn Page",
  description: "Aplikasi Sistem Layanan Akademik Digital Universitas Palangka Raya",
};

export default function SignIn() {
  return <SignInFormMhs />;
}
