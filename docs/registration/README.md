# Registration page

The homepage's upcoming-edition card and “join” link lead to `registration.html`. It shares the homepage's CSS, brand styles, and public edition configuration. Supported browsers animate the edition title between documents; ordinary links still work without that enhancement, and reduced-motion users get normal navigation.

## Current setup

The organizer has not supplied a contribution amount, Tikkie link, or registration storage destination. **The checked-in page therefore shows “registration opens soon” and disables submission.** It cannot accept real registrations until a storage endpoint is connected. The full configured flow is tested with browser-only fixtures; no attendee data is sent to a real service during tests.

The production homepage and page use TBA for the date, time, and specific address because `events/04-ai-convos.md` still marks them unconfirmed. Amsterdam is confirmed. Historical contradictions are preserved there. The registration header aligns the month with the blue label and the day with the edition title; the address sits below the title. Set `date` (full date including year), `month`, and `day` together once confirmed.

## Files

- `registration.html`: accessible details, payment, and completion sections.
- `assets/site.css`: shared tokens, typography, header, homepage styles, and cross-document transition.
- `assets/registration.css`: registration-specific layout and responsive styles.
- `assets/edition.js`: public labels and connection URLs shared by both pages.
- `assets/edition-view.js`: fills edition labels from that configuration.
- `assets/navigation.js`: handles optional cross-document animation cancellation before the first render.
- `assets/registration.js`: submit/acknowledge details, show steps, and preserve non-personal state within the tab.

Small static header markup remains in each HTML file so navigation works before JavaScript loads. There is no client framework or runtime dependency. The only npm dependency is for development browser checks.

## Connect registration storage

Set `registrationEndpoint` in `assets/edition.js` to a same-origin path or public HTTPS form endpoint. It must accept a `POST` with `multipart/form-data` and return a JSON body of `{ "ok": true }` with a successful HTTP status **only after the data is durably stored**. Generic `{}` or a 200 HTML page is not acknowledgment.

Submitted fields:

| Field | Purpose |
| --- | --- |
| `edition` | Which edition this registration is for |
| `registration_id` | Random ID, unchanged across retries of this submission |
| `name` | Attendee name |
| `email` | Attendee email |
| `notes` | Optional payment/plus-one context |

The selected service must validate and limit these fields, handle spam/rate limits, and **deduplicate retries by edition + registration_id**. If using an existing hosted form service, verify its acknowledgment shape and duplicate handling or add a small adapter. A separate registration deliberately gets a fresh identifier. The current form is an integration boundary, not a backend implementation.

For a cross-origin endpoint, permit the site's actual origin in CORS. Requests omit cookies and credentials. Keep secret API keys on the service, never in `edition.js`. The page retains input on failure, blocks double-click submission, and shows payment only after acknowledgment; a timeout or failed response leaves success unclaimed.

No marketing opt-in or automated email workflow is configured. Contact details are requested for this edition only. Review the short data-use copy against the chosen storage provider before opening registration.

## Payment and completion

Set `paymentUrl` to this edition's Tikkie and `contribution` to the agreed amount. The link opens in a separate tab without passing names, emails, or other personal fields in the URL. No payment callback or payment verification exists on this site.

Guests can finish registration without clicking or verifying payment. Payment matching is informal organizer work. The completion page thanks the guest and invites ideas for the evening; it does not claim a paid/confirmed spot. Missing payment links show clear fallback copy rather than broken links. Only HTTPS payment URLs are enabled.

Browser back/forward and refreshing preserve the visible stage; same-tab session storage holds only a receipt flag and random request ID, never name/email/notes or payment status. Payment and completion require a saved-details receipt in the current tab. If storage is blocked, the current-page flow still works. Starting another registration resets that tab's receipt, not previously submitted data.

The questionnaire is deliberately excluded from this PR. Its provider, flow, and any external link will be handled in a separate future PR when decided. The historical prototype folder remains untouched.

## Local run and checks

```sh
python3 -m http.server 46874 --bind 127.0.0.1
```

Open `http://127.0.0.1:46874/registration.html`. Normal local mode reflects the missing production configuration.

```sh
npm ci
npx playwright install chromium
npm test
```

To use an installed Chrome and regenerate screenshots:

```sh
PLAYWRIGHT_CHANNEL=chrome CAPTURE_SCREENSHOTS=1 npm test
```

Tests use an isolated headless browser and a temporary local HTTP server. They cover the homepage link, configuration missing/invalid, validation, failure/retry, acknowledgment, duplicate clicks, data minimization, external payment navigation, browser history, refresh, registering a second attendee, header alignment, and mobile overflow. Screenshots use a mocked submission endpoint and example.com outbound links; no real accounts, payments, or emails are involved.

## Review screenshots

The configured screenshots show synthetic attendee details; the dates and contribution remain TBA. The not-open screenshot is the actual checked-in configuration.

| Stage | Desktop | Mobile |
| --- | --- | --- |
| Details | [Screenshot](screenshots/desktop-01-details.png) | [Screenshot](screenshots/mobile-01-details.png) |
| Tikkie | [Screenshot](screenshots/desktop-02-payment.png) | [Screenshot](screenshots/mobile-02-payment.png) |
| Completion | [Screenshot](screenshots/desktop-03-completion.png) | [Screenshot](screenshots/mobile-03-completion.png) |

[Registration not open](screenshots/registration-not-open.png) · [Submission error](screenshots/submission-error.png) · [Payment not ready at 320px](screenshots/payment-not-ready-mobile.png) · [Synthetic date layout check](screenshots/date-layout-fixture-mobile.png)
