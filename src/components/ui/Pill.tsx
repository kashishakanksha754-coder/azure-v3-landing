"use client";
import Link from "next/link";
import React from "react";

type Variant = "primary" | "outline" | "white" | "outline-white";
type Size = "default" | "md" | "sm";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  roll?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "href">;

type LinkProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

type PillProps = ButtonProps | LinkProps;

function classes(variant: Variant, size: Size, extra?: string) {
  return [
    "pill",
    `pill--${variant}`,
    size !== "default" ? `pill--${size}` : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Pill(props: PillProps) {
  const {
    variant = "primary",
    size = "default",
    roll = false,
    children,
    className,
    style,
    ...rest
  } = props;

  const cls = classes(variant, size, className);
  const content = roll ? (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  ) : (
    children
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, target, rel, "aria-label": ariaLabel } = rest as LinkProps;
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} className={cls} style={style} aria-label={ariaLabel}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} target={target} rel={rel} className={cls} style={style} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  const { type = "button", disabled, onClick, ...btnRest } =
    rest as ButtonProps;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cls}
      style={style}
      {...(btnRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
