# R1 Creations

Self-hosted web creations for Rabbit R1, deployed via GitHub Pages.

## Live Site

**https://ghostfacesama.github.io/r1-creations/**

## What's This?

R1 Creations are small web apps optimized for the Rabbit R1's 240x282px screen. They respond to the R1's hardware controls:
- **Scroll Up/Down** - Custom wheel events
- **Side Button Click** - PTT button press

## Structure

```
r1-creations/
├── index.html              # Gallery/landing page
├── qr/                     # QR code generator
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── templates/              # Base templates for new creations
│   └── basic/
│       ├── index.html
│       ├── css/styles.css
│       └── js/app.js
└── creations/              # Individual creations
    └── timer/
        ├── index.html
        ├── css/styles.css
        └── js/app.js
```

## Available Creations

| Name | Description | URL |
|------|-------------|-----|
| Timer | Countdown timer with scroll wheel adjustment | [Preview](https://ghostfacesama.github.io/r1-creations/creations/timer/) |

## Creating a New Creation

1. Copy `templates/basic/` to `creations/your-creation-name/`
2. Edit the files to build your creation
3. Push to GitHub - it auto-deploys to Pages
4. Use the QR generator to create an install code

## Hardware Events

Creations can listen for these custom events:

```javascript
// Scroll wheel
window.addEventListener('scrollUp', () => { /* ... */ });
window.addEventListener('scrollDown', () => { /* ... */ });

// Side button (PTT)
window.addEventListener('sideClick', () => { /* ... */ });
```

## Screen Specs

- **Width:** 240px
- **Height:** 282px
- **Safe area:** Account for 3px border

## License

MIT
