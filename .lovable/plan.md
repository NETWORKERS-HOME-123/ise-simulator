

# Favicon & SEO Update

## Changes

### 1. Generate SVG Favicon
Create `public/favicon.svg` — white "NH" text on a blue (#049fd9) rounded background. SVG favicons are supported by all modern browsers and look crisp at any size.

### 2. Update `index.html`
- Set title: `Cisco ISE Simulation by NETWORKERS HOME`
- Update all meta tags (description, author, og:title, og:description, twitter tags) to reference "NETWORKERS HOME" and "Cisco ISE Simulation"
- Add `<link rel="icon">` pointing to the SVG favicon
- Remove the old `public/favicon.ico` if present

### Files
| File | Action |
|------|--------|
| `public/favicon.svg` | Create — blue square with white "NH" text |
| `index.html` | Update title, meta, favicon link |

