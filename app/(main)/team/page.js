import Link from "next/link";
import Image from "next/image";
import TeamList from "@/components/layout/team/TeamList";

export default function Team() {
  return (
    <div className="flex flex-col w-[350px] absolute -translate-x-1/2 -top-[200px]">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo/logo-black.svg" alt="Logo" width={27} height={27} />
        <span className="font-bold inline-block text-4xl">Deforge</span>
      </Link>
      <TeamList />
    </div>
  );
}
