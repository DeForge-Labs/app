import TeamForm from "@/components/layout/team/TeamForm";
import Link from "next/link";
import Image from "next/image";

export default function page() {
  return (
    <div className="flex flex-col w-[350px] min-h-[500px]">
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
      <TeamForm />
    </div>
  );
}
