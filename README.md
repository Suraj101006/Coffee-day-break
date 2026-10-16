# Daybreak Coffee Co.

A single-page website for coffee lovers. Plain HTML, CSS and JavaScript, no build step.

## Features
- Hero with a simple parallax background image
- Navigation bar that turns solid on scroll, hides on scroll down and shows on scroll up, with active-section underline and a mobile menu
- Origins, roastery story, and a working brew calculator (espresso, pour over, French press, cold brew)
- Shop with filters and a cart drawer that remembers your cart (localStorage)
- Newsletter form with email validation
- Light and dark mode, and respects reduced-motion settings

The shop checkout and newsletter form are demos: no payments are taken and no data is sent.

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Files
- `index.html` markup
- `style.css` styles
- `script.js` parallax, nav, brew calculator, cart
