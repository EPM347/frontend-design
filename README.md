# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Rounds

### [`01-marketing-cream/`](./01-marketing-cream/)

Marketing-only cream + neo-brutalist theme. Wraps `/`, `/pricing`, `/faq`, `/privacy`, `/terms` in a `.theme-cream` scope. Logged-in app and dashboard stay untouched.

- 5 files changed (2 patches + 3 full files + 1 new file)
- ~half-day of work
- Zero per-component edits — semantic tokens auto-flip via CSS variable overrides

See [`01-marketing-cream/README.md`](./01-marketing-cream/README.md) for migration notes and validation checklist.
