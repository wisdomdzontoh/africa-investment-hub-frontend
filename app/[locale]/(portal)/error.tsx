"use client";

import { RouteError, type RouteErrorProps } from "@/components/common/RouteError";

export default function PortalError(props: RouteErrorProps) {
  return <RouteError {...props} homeHref="/" />;
}
