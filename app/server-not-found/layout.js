import StartContainer from "@/components/ui/StartContainer";
import Link from "next/link";
import Image from "next/image";

export default function ServerNotFoundLayout({ children }) {
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
        {children}
      </div>
    </StartContainer>
  );
}
