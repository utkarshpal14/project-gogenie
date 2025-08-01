import React from "react";
import { cn } from "@/lib/utils";

function Skeleton(props) {
  const className = props.className || "";
  const otherProps = { ...props };
  delete otherProps.className;

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...otherProps}
    />
  );
}

export { Skeleton };
