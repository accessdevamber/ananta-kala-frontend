# Kala & Prana — Frontend v2

This is a standalone React + Vite + TypeScript frontend prototype. It does not require Spring Boot or PostgreSQL.

## Run locally on macOS

```bash
cd kala-prana-v2
npm install
npm run dev
```

Open the Local URL shown in Terminal (usually http://localhost:5173/).

## What's new

- Artwork catalog with the four original devotional images supplied in the conversation.
- Click an artwork to open a dedicated Etsy-inspired product details page.
- Large room mockup, gallery thumbnails, next/previous, expand-to-view.
- Five room examples, four frame finishes, four print sizes, digital vs physical selection.
- Add to cart, view cart, and copy an order enquiry.
- Upload your own JPEG, PNG, or WebP images for temporary browser-session previews.

## Important limitations

- The room backgrounds are **illustrative concept-image crops**, not calibrated architectural photography. Bedroom, pooja, hallway and office crops are low resolution; they are temporary design placeholders and should be replaced with licensed high-resolution room photos before launch.
- Wall frames use CSS overlays and approximate coordinates, not physical measurement or perspective mapping. Print sizes affect pricing in this demo, **not accurately scaled mockup dimensions**.
- Product prices are sample values, not merchant quotes.
- No backend, checkout, payment gateway, persistent uploads, secure digital downloads or real order submission yet.
- Uploaded images use browser object URLs and disappear when the page is reloaded.
- Before accepting orders, configure the owner's actual business contact, backend order persistence, image storage, payment verification and admin authentication.
