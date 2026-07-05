# personal-site

Static personal website for Alexander Yesilyurt.

## Local preview

Open `index.html` in a browser, or run a simple local server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Editing checklist

- Replace project placeholders in `index.html` with real repository links.
- Add screenshots, demos, or writeups for the strongest projects.
- Update social links if the current GitHub or LinkedIn URLs change.
- Buy a domain once the first version is ready. The cleanest target is usually `alexanderyesilyurt.com`.

## Hosting recommendation

This site is dependency-free static HTML, CSS, and JavaScript. That means the easiest first host is GitHub Pages.

Suggested path:

1. Keep the GitHub repo private while editing.
2. When ready, publish through GitHub Pages from the `main` branch.
3. Add a custom domain through your DNS provider.

Important caveat: GitHub Pages from a private repository requires GitHub Pro, Team, Enterprise Cloud, or Enterprise Server. If your GitHub account is on the free plan, the simplest option is to keep this repo private while drafting, then make it public when you are ready to publish through GitHub Pages. The published website itself is public.

## Create the private GitHub repo

The local repo is already initialized and committed. Re-authenticate GitHub CLI, then create and push the private remote:

```bash
cd ~/Desktop/projects/personal-site
gh auth login -h github.com
gh repo create personal-site --private --source=. --remote=origin --push
```

After that, the repo should exist at:

```text
https://github.com/alexyesilyurt/personal-site
```

Good alternatives:

- Vercel: good if you later convert this to Next.js or want preview deployments.
- Netlify: good if you want simple drag-and-drop deploys, forms, or branch previews.
