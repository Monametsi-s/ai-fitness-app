import { SignedIn, SignedOut, SignIn, SignOutButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TerminalOverlay from "@/components/ui/TerminalOverlay";
import UserPrograms from "@/components/UserPrograms";

const HomePage = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
        <section className="relative z-10 py-24 flex-grow">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
              {/* LEFT SIDE */}
              <div className="lg:col-span-7">
                {/* Left content */}
                <div className="space-y-8 relative">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ">
                    <div>
                      <span className="text-foreground">Transform</span>
                    </div>
                    <div>
                      <span className="text-primary">Your Body</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-foreground">With Advanced</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-foreground">AI</span>
                      <span className="text-primary"> Technology</span>
                    </div>
                  </h1>

                  {/* SEPERATOR LINE */}
                  <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-70"></div>
                </div>
                <p className="text-xl text-muted-foreground w-2/3">
                  Talk to our AI assistant and get personalized diet plans and
                  workout routines designed just for you
                </p>

                {/* STATS */}
                <div className="flex items-center gap-10 py-6 font-mono">
                  <div className="flex flex-col">
                    <div className="text-2xl text-primary">500+</div>
                    <div className="text-xs uppercase tracking-wider">
                      ACTIVE USERS
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                  <div className="flex flex-col">
                    <div className="text-2xl text-primary">3min</div>
                    <div className="text-xs uppercase tracking-wider">
                      GENERATION
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                  <div className="flex flex-col">
                    <div className="text-2xl text-primary">100%</div>
                    <div className="text-xs uppercase tracking-wider">
                      PERSONALIZED
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    size="lg"
                    asChild
                    className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                  >
                    <Link
                      href={"/generate-program"}
                      className="flex items-center font-mono"
                    >
                      Build Your Program
                      <ArrowRightIcon className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="lg:col-span-5">
                {/* Right content */}
                {/* CORNER PIECES */}
                <div className="absolute -inset-4 pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
                </div>

                {/* IMAGE CONTAINER */}
                <div className="relative aspect-square max-w-lg mx-aut">
                  <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                    <img
                      src="/hero-ai3.png"
                      alt="Ai Fitness Coach"
                      className="size-full object-cover object-center"
                    />

                    {/* SCAN LINE */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%),transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                    {/* DECORATIONS ON TOP THE IMAGE */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />

                      {/* Targeting lines */}
                      <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                      <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                      <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                      <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
