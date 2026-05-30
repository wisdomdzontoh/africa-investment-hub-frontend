import Image from "next/image";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/format";

export function Flag({
  code,
  lg,
  className,
}: {
  code: string;
  lg?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={flagUrl(code)}
      alt=""
      width={lg ? 28 : 20}
      height={lg ? 21 : 15}
      className={cn("flag", lg && "flag-lg", className)}
      unoptimized
    />
  );
}
