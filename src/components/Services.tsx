import ImagePanel from "@/components/ui/ImagePanel";
import Tag from "@/components/ui/Tag";
import Pill from "@/components/ui/Pill";
import { SERVICES_DATA } from "@/config/services";

function ServiceRow({ svc, index }: { svc: typeof SERVICES_DATA[0]; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <div className="svc-row">
      {/* Image column */}
      <div
        className="svc-img"
        style={{
          order: reversed ? 2 : 1,
          position: "relative",
          overflow: "hidden",
          minHeight: "clamp(320px, 38vw, 560px)",
        }}
      >
        <ImagePanel
          src={svc.img}
          alt={svc.alt}
          scrim="bottom"
          style={{ position: "absolute", inset: 0, borderRadius: 0 }}
          sizes="(max-width: 1023px) 100vw, 50vw"
        />
      </div>

      {/* Text column */}
      <div
        className="svc-text"
        style={{
          order: reversed ? 1 : 2,
          padding: "clamp(48px, 6vw, 96px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: index % 2 === 0 ? "var(--pink-50)" : "#fff",
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--pink-500)",
            marginBottom: 20,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          {svc.title}
        </h3>
        <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 12 }}>
          {svc.line1}
        </p>
        <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 36 }}>
          {svc.line2}
        </p>
        <div>
          <Pill size="sm" href={svc.pillHref}>{svc.pill}</Pill>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" data-section="services" style={{ background: "#fff" }}>
      <style>{`
        .svc-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 1023px) {
          .svc-row {
            grid-template-columns: 1fr;
          }
          .svc-img { order: 1 !important; }
          .svc-text { order: 2 !important; }
        }
      `}</style>

      {/* Section header */}
      <div className="container section" style={{ paddingBottom: "clamp(48px, 6vw, 80px)" }}>
        <span style={{ display: "inline-block", marginBottom: 20 }}>
          <Tag variant="outline">Services</Tag>
        </span>
        <h2 style={{ maxWidth: "18ch", marginBottom: 16 }}>
          End-to-end device services for your organisation.
        </h2>
        <p
          style={{
            fontSize: "clamp(16px, 1.5vw, 18px)",
            color: "var(--text-muted)",
            maxWidth: "56ch",
            lineHeight: 1.6,
          }}
        >
          From procurement to retirement — we handle every stage of your device lifecycle.
        </p>
      </div>

      {/* Alternating rows */}
      <div>
        {SERVICES_DATA.map((svc, i) => (
          <ServiceRow key={svc.id} svc={svc} index={i} />
        ))}
      </div>
    </section>
  );
}
