import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo/logo-black.svg"
              alt="Logo"
              width={27}
              height={27}
            />
            <span className="font-bold inline-block text-4xl">Deforge</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
