# Current-code TODO: message controls, retention and images

Replaces historical PR [#100](https://github.com/gigabytegrove/monita/pull/100). This is an outstanding task list, **not** a completed feature claim.

- [ ] Compare current models, APIs, UI and storage against PR #100.
- [ ] Make Assign, Resolve/Reopen and Attach controls opt-in per message and enforce them server-side.
- [ ] Validate capability metadata and realtime message payloads.
- [ ] Ensure notification retention is exactly 24 hours where required; test migrations and retention boundaries.
- [ ] Ensure image lifecycle and cleanup prevent orphaned files/records.
- [ ] Add regression tests and run release verification against current code.

Issues are disabled on this repo. Repository rules require changes through a PR; this is a fresh tracking PR based on current master, not an old implementation PR.
