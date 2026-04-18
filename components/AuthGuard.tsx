"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const isLoginPage = pathname === "/login";

    if (!isLoggedIn && !isLoginPage) {
      router.push("/login");
    } else if (isLoggedIn && isLoginPage) {
      router.push("/");
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  if (!isReady && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
           <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
