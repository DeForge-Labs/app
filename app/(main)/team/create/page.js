import Link from "next/link";
import Image from "next/image";
import TeamForm from "@/components/layout/team/TeamForm";

export default function page() {
  return (
    <div className="flex flex-col w-[350px]">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo/logo-black.svg" alt="Logo" width={27} height={27} />
        <span className="font-bold inline-block text-4xl">Deforge</span>
      </Link>
      <TeamForm />
    </div>
  );
}
