# Aldie's Garage

**Mechanic by heart. IT by destiny.**

A responsive vanilla HTML/CSS/JavaScript portfolio for Aldie G. Cajanding. The interface combines a motorcycle workshop, technical blueprint graphics, and a developer workstation to tell a personal story without inventing work experience or qualifications.

## Files

- `index.html` — semantic page structure and content
- `style.css` — responsive design system, industrial cards, animations, and layout
- `script.js` — navigation, scroll reveals, particles, RPM meter, terminal, lightbox, and sound control
- `assets/profile.jpg` — replaceable profile image
- `favicon.svg` — site icon

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
npx serve .
```

No build step or dependency installation is required.

## Deploy to GitHub Pages or Vercel

1. Push the folder to a GitHub repository.
2. For Vercel, import the repository and use the default settings. The project is static, so no build command is needed and the output directory is `.`.
3. For GitHub Pages, enable Pages from the repository settings and select the branch containing `index.html`.

## Personalizing the site

- Replace `assets/profile.jpg` with a new portrait using the same filename, or update the image path in `index.html`.
- Replace the three `.bike-card` entries in `index.html` with real motorcycle images and descriptions. The gallery cards already open an accessible detail view.
- Update the project links and descriptions in the `#work` section when real school projects are ready.
- Add achievements to the cards in the `#recognition` section only when they are earned.
- Update the contact email and social links before publishing.

The optional sound control is off by default and only produces small interface feedback after the visitor opts in.
