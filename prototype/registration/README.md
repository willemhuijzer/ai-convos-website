# Registration page prototype

> **Throwaway prototype.** Delete this route after choosing an approach and rebuild the winner as production code.

Question: how should clicking the upcoming event lead into registration, and how visible should the external registration tool be?

The provider and integration research is in [`docs/event-registration-research.md`](../../docs/event-registration-research.md).

The three structurally different options live on one route and are switched by `?variant=`:

- `A` — the preferred native-feeling flow: details, Tikkie handoff, then a questionnaire placeholder. Payment matching never blocks the questionnaire.
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

## Agreed flow — 28 September 2026

1. Enter name, email, and optional notes (including who else a payment covers).
2. Continue to payment. The contribution covers costs and discourages no-shows; its amount is still unknown. Call it a contribution, not a deposit implying routine repayment.
3. Open Tikkie and return to the website. The prototype simulates opening the link and makes no payment or network request.
4. Continue straight to the first questionnaire question. Payment verification and confirmation emails are not prerequisites. There is no “I paid” claim or “payment verified” success state.
5. Answer now or choose to do it later. The first question is illustrative, not approved questionnaire content; subsequent questions, saving, and resume links are deliberately unimplemented.

Payment matching is informal organizer admin, whenever convenient. The paid list is useful for estimating attendance; capacity is not enforced. One person may pay for multiple people; optional notes and separate registrations are sufficient for now. Refund requests are handled personally, with no automated refund flow.

Everyone is expected to complete the questionnaire before the edition or on arrival. Organizers ask people to do it; no mechanical admission gate is needed.

Open design decision: how guests return later (personal email link or a community link plus a way to recognize the respondent). Separate attendee responses still matter when one payer covers multiple people.

The floating switcher still offers B and C for comparison; their older free-ticket content does not describe the chosen contribution flow. Existing date/venue/schedule content is provisional reference material from the original mockup; see the main checkout's `events/04-ai-convos.md` before publishing any edition facts. The event-to-registration animation is a future prototype pass; this pass adds only short transitions between form steps.
