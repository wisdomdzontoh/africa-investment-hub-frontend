import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Logo height in pixels. Omit to use responsive header sizing. */
  height?: number;
  priority?: boolean;
};

// Official horizontal lockup (red Africa mark + wordmark) on cream.
const SRC_W = 1408;
const SRC_H = 768;

export function Logo({ className, height, priority = true }: LogoProps) {
  return (
    <Image
      src="/logo/afric-investment-hub.png"
      alt="African Investment Hub"
      width={SRC_W}
      height={SRC_H}
      priority={priority}
      sizes="(max-width: 640px) 180px, 240px"
      className={cn("logo-image w-auto object-contain", className)}
      style={height !== undefined ? { height } : undefined}
    />
  );
}
