# VARK — Portfolio & Shop

Windows 98 "Classic"–styled site for **VARK** (Desi Hip Hop / Rap): music player, original paintings, CDs.
Built with Vite + React + [98.css](https://jdan.github.io/98.css/). Hosted on Netlify.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173  (add ?boot to replay the boot screen)
npm run build      # outputs to dist/
```

## Adding content (no component changes needed)

| What        | Data file               | Assets go in                    |
| ----------- | ----------------------- | ------------------------------- |
| Paintings   | `src/data/paintings.js` | `public/paintings/`             |
| CDs         | `src/data/cds.js`       | `public/cds/`                   |
| Tracks      | `src/data/tracks.js`    | `public/audio/`, `public/covers/` |
| Email, socials, shipping region, boot timing | `src/config.js` | — |

Each data file has a commented example entry. To mark a painting as sold, set `sold: true` —
it stays visible with a SOLD stamp and can't be added to the cart.

## Sections

- **Welcome** — hero, modelled on the Win98 Welcome screen
- **Music** — player (layout from client's "Spotify 98" reference — final styling TBD by client) + playlist
- **Paintings** — MS Paint window; palette is interactive (left-click = text colour, right-click = canvas colour)
- **CDs** — Explorer window (`D:\VARK Discography`)
- **Contact** — Outlook Express–style form via **Netlify Forms** (works once deployed; form `contact`)
- **Taskbar** — Start menu, section buttons, cart, clock. Start → Shut Down for the easter egg.

## Cursors

`public/cursors/` — generated from the client's reference art (1x + 2x for HiDPI):
`arrow` (default), `hand` (links/buttons), `hand-click` (while pressed).

## Not done yet / open items

- [ ] **Payments — CCAvenue.** Cart + checkout UI exist; checkout shows a "coming soon" notice while
      `shop.payments.enabled` is `false`. Integration plan: Netlify Function that encrypts the order with the
      merchant working key and redirects to CCAvenue, plus a response-handler function that verifies payment
      and marks items sold. Needs merchant ID, access code, working key.
- [ ] Painting photos, CD covers/titles/prices, audio files
- [ ] Music player final styling (client to supply)
- [ ] Mobile layout pass
- [ ] Domain
