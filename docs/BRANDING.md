# Monita Branding

Monita is the current product name. Historical release material may retain the former project name where preserving release history or compatibility context is necessary.

## Authoritative artwork

The canonical branding source is the exact SVG artwork supplied on **2026-10-01**:

- `assets/source/Monita_Full-01.svg` — full Monita logo
- `assets/source/Monita_IconOnly-01.svg` — Monita icon/app icon

The active aliases in `assets/` and `ui/public/static/` use those same vector masters directly.

No alternate palette, reconstructed mark, traced copy, flattened substitute, or regenerated logo is authoritative. Do not change proportions, colors, typography, spacing, gradients, clipping, or any other visual detail in the supplied files.

## Naming

Use **Monita** for current product-facing text.

Do not use the former product name for current UI, runtime identity, configuration examples, filenames, or new documentation. Historical release notes and explicit compatibility references are the exceptions.

Gotify may still appear only where it is technically or legally required: protocol/client compatibility, legacy upgrade aliases, persisted migration paths, the upstream plugin ABI/dependencies, the external build image, release history, or license attribution.

The authoritative file-level inventory is `.github/legacy-identity-allowlist.txt`. CI performs an exhaustive case-insensitive repository scan and fails if a Gotify reference appears in any file that has not been explicitly reviewed and placed on that allowlist. The narrower branding checks still reject current-product naming such as **Gotify MU**, former internal server module imports, legacy-named active source files, and unexpected Web UI references.
