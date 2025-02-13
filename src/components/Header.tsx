"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Padel Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold">Padelers</span>
        </div>

        {status === "authenticated" && (
          <Button variant="ghost" onClick={() => signOut()}>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
