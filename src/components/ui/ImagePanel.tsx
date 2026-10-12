import Image from "next/image";

const IPSTYLE = `
  .ip { isolation: isolate; }
  .ip-img { transition: transform 700ms cubic-bezier(0.22,1,0.36,1); }
  .ip-deep {
    position: absolute; inset: 0; z-index: 2;
    background: rgba(26,23,25,.08);
    opacity: 0;
    transition: opacity 700ms cubic-bezier(0.22,1,0.36,1);
    pointer-events: none;
  }
  @media (hover: hover) {
    .ip:hover .ip-img { transform: scale(1.05); }
    .ip:hover .ip-deep { opacity: 1; }
  }
`;

export interface ImagePanelProps {
  src?: string;
  alt?: string;
  ratio?: string;
  scrim?: "left" | "bottom" | "brand";
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sizes?: string;
  objectPosition?: string;
}

export default function ImagePanel({
  src,
  alt = "",
  ratio,
  scrim = "bottom",
  priority = false,
  className,
  style,
  children,
  sizes = "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw",
  objectPosition,
}: ImagePanelProps) {
  const scrimGrad =
    scrim === "left"  ? "var(--scrim-left)"   :
    scrim === "brand" ? "var(--grad-brand)"   :
                        "var(--scrim-bottom)" ;

  const contentJustify    = scrim === "bottom" ? "flex-end" : "center";
  const contentAlignItems = scrim === "left"   ? "flex-start" : "center";

  return (
    <>
      <style>{IPSTYLE}</style>
      <div
        className={`ip${className ? ` ${className}` : ""}`}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-img)",
          ...(ratio ? { aspectRatio: ratio } : {}),
          ...style,
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="ip-img"
            sizes={sizes}
            style={{ objectFit: "cover", objectPosition: objectPosition ?? "center center" }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "var(--grad-brand)" }} />
        )}

        {/* Scrim overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: scrimGrad,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Brand wash — subtle tint on left/bottom scrims */}
        {scrim !== "brand" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--brand-wash)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Hover deepening layer */}
        <div className="ip-deep" />

        {/* Content layer — anchored to the dark zone via justify-content */}
        {children && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: contentJustify,
              alignItems: contentAlignItems,
              padding: "clamp(20px, 2.4vw, 32px)",
              color: "#fff",
              textShadow: "0 1px 12px rgba(38,16,28,.35)",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
}
