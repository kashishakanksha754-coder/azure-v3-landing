import React from "react";

type TagSize = "default" | "sm" | "chip";
type TagVariant = "default" | "outline" | "on-dark" | "white";

interface TagProps {
  size?: TagSize;
  variant?: TagVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  icon?: React.ReactNode;
}

export default function Tag({
  size = "default",
  variant = "default",
  children,
  style,
  className = "",
  icon,
}: TagProps) {
  const cls = [
    "tag",
    variant === "outline" ? "tag-outline" : "",
    variant === "on-dark" ? "tag-on-dark" : "",
    variant === "white" ? "tag-white" : "",
    size === "sm" ? "tag--sm" : "",
    size === "chip" ? "tag--chip" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls} style={{ gap: icon ? 7 : undefined, ...style }}>
      {icon && <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
