# Registration page prototype

> **Throwaway prototype.** Delete this route after choosing an approach and rebuild the winner as production code.

Question: how should clicking the upcoming event lead into registration, and how visible should the external registration tool be?

The provider and integration research is in [`docs/event-registration-research.md`](../../docs/event-registration-research.md).

The three structurally different options live on one route and are switched by `?variant=`:

- `A` — a focused, native-feeling form. Best continuity with the ai convos site; designed around a flexible Tito or pretix inline widget.
- `B` — an editorial split layout that launches a provider-owned overlay. Best balance of brand storytelling and low-code registration; the modal itself is intentionally not presented as fully styleable.
- `C` — a minimal handoff to a hosted Luma registration page. Lowest implementation and privacy risk; adds one clear extra click.

Run from the repository root:

```sh
python3 -m http.server 46873
```

Then open:

- <http://localhost:46873/prototype/registration/?variant=A>
- <http://localhost:46873/prototype/registration/?variant=B>
- <http://localhost:46873/prototype/registration/?variant=C>

Use the floating arrows or keyboard left/right arrows to switch. Form submission and the hosted-page handoff are intentionally stubbed; no data leaves the browser.

## Decision placeholder

Chosen approach: _pending review_

What to keep from the winning variant: _pending review_

Registration provider: _pending research and review_
