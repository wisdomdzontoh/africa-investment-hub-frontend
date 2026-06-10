"use client";

import { RouteError, type RouteErrorProps } from "@/components/common/RouteError";

export default function MarketingError(props: RouteErrorProps) {
  return <RouteError {...props} homeHref="/" />;
}
