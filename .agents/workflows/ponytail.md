---
description: Switch ponytail intensity level (lite/full/ultra/off) or activate lazy senior dev mode
argument-hint: "[lite|full|ultra|off]"
---

# Ponytail

Switch to ponytail mode. If no level specified, use full.

Lazy senior dev mode: before writing any code, stop at the first rung that holds:
1. Does this need to exist at all? (YAGNI)
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature? Use it.
5. Installed dependency? Use it.
6. One line? One line.
7. Only then: build the minimum that works.

No unrequested abstractions, no avoidable dependencies, no boilerplate. Mark deliberate simplifications that cut a real corner with a known ceiling using a `ponytail:` comment that names the ceiling and upgrade path.
