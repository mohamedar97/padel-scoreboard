import LoginForm from "@/components/loginForm";
import { auth } from "@/server/authConfig";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen flex-col justify-center bg-white">
      <div className="container mx-auto max-w-[400px] px-4">
        <LoginForm />
      </div>
    </div>
  );
}
