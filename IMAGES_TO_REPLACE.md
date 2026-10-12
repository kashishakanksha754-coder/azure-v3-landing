# Images to Replace

All entries below are brand-gradient (`--grad-brand`) placeholders.
Replace each with a real photograph before launch.

| Component | Location | Description | Priority |
|-----------|----------|-------------|----------|
| `Industries` | Each accordion row | One photo per industry (Corporate, Healthcare, Education, Media & Retail) | High |
| `Hero` slide 2 | `src/components/Hero.tsx` | Enterprise/office environment | High |
| `Hero` slide 3 | `src/components/Hero.tsx` | Healthcare / clinical setting | High |
| `SuccessStories` | Each story card | Case study hero image per story | High |
| `ClosingCTA` | Background | Full-bleed contact section image | Medium |

## Duplicate images in Solutions grid

The **"AI"** solution card and the **"Switching from Windows to Mac"** card
currently use different filenames (`workspace.jpg` and `choose.jpg`) but may
resolve to the same or visually similar stock photo. Each solution needs a
distinct image before launch.

| Slug | Current image | Status |
|------|--------------|--------|
| `ai` | `/images/workspace.jpg` | Replace with AI/productivity-specific photo |
| `switching-from-windows-to-mac` | `/images/choose.jpg` | Replace with Windows→Mac transition photo |

---

## Notes
- Do NOT use `/iphone/iphone-back-34.png` for any iPhone photo slot
- Do NOT use `macbook-air-yellow.png` (MacBook Neo) in product collage
- Do NOT use AirPods Pro in product collage
- All new images should be at least 2× resolution for retina displays
- Preferred aspect ratio for ImagePanel components: 16:9 landscape or 4:3 landscape
