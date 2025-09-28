import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export default function Home() {
    return (
        <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-gray-900">
            <div className="space-y-6">
                <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
                    Auth
                </h1>
                <p className="text-white text-lg">
                    A simple and secure authentication service
                </p>
                <LoginButton>
                  <Button variant="secondary" size="lg">
                      Sign in
                  </Button>
                </LoginButton>
            </div>
        </main>
    )
};