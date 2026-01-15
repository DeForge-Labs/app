import Image from "next/image";

export default function LogLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 opacity-50">
      <Image
        src="/loader/log.svg"
        alt="loader"
        width={64}
        height={64}
        className="dark:invert"
      />
    </div>
  );
}
