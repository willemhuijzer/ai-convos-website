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

## Review decision

Preferred direction: **Variant A**. It is closest to the current AI Convos visual language and can support an animated transition from selecting an edition into registration.

Keep: the date/title header, compact schedule, and native-feeling registration panel.

Remove: the descriptive subheader and public seat count.

Current CTA: **Continue to payment**. A personal Tikkie cannot automatically confirm the website registrant, so the working flow includes a manual payment-matching state before the confirmation email.

Still unresolved: the attendance-deposit amount and policy, capacity handling, payment identity mismatches, and whether the questionnaire can start before payment is manually confirmed.
