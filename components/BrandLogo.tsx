import Image from "next/image";

export function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo-256.png"
        alt="Kalyan Aim Arcade logo"
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="text-sm font-semibold tracking-wide">
        Kalyan Aim Arcade
      </span>
    </div>
  );
}

