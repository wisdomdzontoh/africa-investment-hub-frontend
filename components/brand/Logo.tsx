import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Logo height in pixels. Omit to use responsive header sizing. */
  height?: number;
};

const SRC_W = 1536;
const SRC_H = 1024;

export function Logo({ className, height }: LogoProps) {
  return (
    <Image
      src="/logo/aih-logo.png"
      alt="African Investment Hub"
      width={SRC_W}
      height={SRC_H}
      priority
      sizes="(max-width: 640px) 160px, 240px"
      className={cn("logo-image w-auto object-contain", className)}
      style={height !== undefined ? { height } : undefined}
    />
  );
}
