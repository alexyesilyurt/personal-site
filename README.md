# personal-site

Static personal website for Alexander Yesilyurt — [alexyesilyurt.dev](https://alexyesilyurt.dev).

The site is a Tetris well. Seven sections sit stacked in the board, one per
tetromino; choosing a row drops a piece into it, clears the line, and opens that
section. A plain-document view is one click away for anyone who just wants to read.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole document. The plain view is the real markup; the arcade is layered on top of it. |
| `styles.css` | Tokens, boot sequence, board, panel, plain document, game, responsive. |
| `script.js` | Boot sequence, board navigation, pixel-art sprites, and the playable Tetris. |
| `favicon.svg` | Four minos. |
| `CNAME` | Custom domain for GitHub Pages. |

No build step, no dependencies, no framework.

## How it degrades

`index.html` contains every section, role, program, and project as plain semantic
markup. The arcade only appears once JavaScript adds a `js` class to `<body>`, so:

- **No JavaScript** → the full readable document, which is also what crawlers index.
- **`prefers-reduced-motion`** → intro skipped, all transitions neutralised.
- **Narrow screens** → the board becomes the navigation (tap a row); the game gets thumb controls.

Because of this, content belongs in `index.html`, never in a JavaScript array —
anything rendered by script is invisible to crawlers and to no-JS visitors.

## Local preview

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Cache busting

`index.html` links `styles.css`, `script.js`, and `favicon.svg` with a `?v=<hash>`
query string, where the hash is the first 8 characters of the file's SHA-256.
**Recompute these whenever you edit those files**, otherwise returning visitors get
a cached asset against fresh HTML — which breaks the page rather than just looking stale.

```bash
for f in styles.css script.js favicon.svg; do
  printf '%s %s\n' "$f" "$(shasum -a 256 "$f" | cut -c1-8)"
done
```

## Hosting

GitHub Pages from `main`, with `CNAME` pointing at `alexyesilyurt.dev`. Pushing to
`main` deploys. `.dev` requires HTTPS, which Pages provides once the custom domain
is verified.
