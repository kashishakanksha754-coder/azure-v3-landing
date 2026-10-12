import { SUCCESS_STORIES } from "@/config/stories";
import { STORIES_LIVE } from "@/config/site";
import ImagePanel from "@/components/ui/ImagePanel";
import Tag from "@/components/ui/Tag";

const confirmedStories = SUCCESS_STORIES.filter((s) => s.confirmed);

export default function SuccessStories() {
  if (!STORIES_LIVE && confirmedStories.length === 0) return null;

  return (
    <section id="success-stories" data-section="success-stories" data-surface="grey" style={{ background: "var(--section-bg)" }}>
      <div className="container" style={{ paddingBlock: "var(--section-gap)" }}>
        <div style={{ marginBottom: "clamp(40px, 5vw, 72px)" }}>
          <div style={{ marginBottom: 20 }}>
            <Tag variant="outline">Success Stories</Tag>
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "18ch",
            }}
          >
            Results that speak for themselves.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {confirmedStories.map((story) => (
            <article key={story.id} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <ImagePanel
                src={story.imageSrc}
                alt={`${story.client} case study`}
                ratio="16/9"
                scrim="bottom"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
              >
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      opacity: 0.75,
                      marginBottom: 6,
                    }}
                  >
                    {story.industry}
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(18px, 2vw, 24px)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.25,
                    }}
                  >
                    {story.client}
                  </p>
                </div>
              </ImagePanel>

              <div>
                <h3
                  style={{
                    fontSize: "clamp(18px, 1.8vw, 22px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                    marginBottom: 12,
                  }}
                >
                  {story.headline}
                </h3>
                <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {story.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
