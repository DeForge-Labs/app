import StartContainer from "@/components/ui/StartContainer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StartContainer>
      <div className="flex flex-col w-[350px]">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <div className="p-4 bg-black/80 shadow-lg shadow-[#8754ff] w-fit rounded-3xl">
            <Image
              src="/logo/logo-white.svg"
              alt="Deforge"
              width={50}
              height={50}
            />
          </div>
        </Link>

        <div className="flex flex-col rounded-lg border mt-6 border-black/10 shadow-md bg-background dark:bg-foreground/5 dark:border-white/10">
          <p className="text-sm font-semibold mt-4 mx-auto">
            404, Page Not Found
          </p>
          <p className="text-xs text-foreground/60 mx-auto mt-1">
            The page you are looking for does not exist.
          </p>

          <div className="mt-4 flex w-full">
            <Link href="https://deforge.io" className="flex-1">
              <Button
                className="h-11 text-xs border-black/10 w-full before:rounded-t-none dark:border-white/10 border-l-0 border-b-0 rounded-br-none rounded-t-none text-destructive"
                variant="outline"
                type="button"
              >
                Home Page
              </Button>
            </Link>

            <Link href="/dashboard" className="flex-1">
              <Button
                className="flex-1 h-11 text-xs w-full border-black/10 before:rounded-t-none dark:border-white/10 border-x-0 border-b-0 rounded-bl-none rounded-t-none text-info"
                variant="outline"
                type="submit"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StartContainer>
  );
}
