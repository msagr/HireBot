"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const Social = () => {
    return (
        <div className="w-full space-y-4">
            <Button
                variant="outline"
                className="w-full py-6 flex items-center justify-center gap-3 text-foreground/80 hover:text-foreground"
                onClick={() => {}}
            >
                <FcGoogle className="h-5 w-5" />
                <span>Continue with Google</span>
            </Button>
            <Button
                variant="outline"
                className="w-full py-6 flex items-center justify-center gap-3 text-foreground/80 hover:text-foreground"
                onClick={() => {}}
            >
                <FaGithub className="h-5 w-5" />
                <span>Continue with GitHub</span>
            </Button>
        </div>
    );
};