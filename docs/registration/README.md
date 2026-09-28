# Registration page

The homepage's upcoming-edition card and “join” link lead to `registration.html`. It shares the homepage's CSS, brand styles, and public edition configuration. Supported browsers animate the edition title between documents; ordinary links still work without that enhancement, and reduced-motion users get normal navigation.

## Current setup

The organizer has not supplied a contribution amount, Tikkie link, questionnaire link, or registration storage destination. **The checked-in page therefore shows “registration opens soon” and disables submission.** It cannot accept real registrations until a storage endpoint is connected. The full configured flow is tested with browser-only fixtures; no attendee data is sent to a real service during tests.

The production homepage and page use TBA for the date, time, and venue because `events/04-ai-convos.md` still marks them unconfirmed. Historical contradictions are preserved there.

## Files

- `registration.html`: accessible registration, payment, questionnaire-link, and return-later sections.
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

## Payment and questionnaire

Set `paymentUrl` to this edition's Tikkie and `contribution` to the agreed amount. Set `questionnaireUrl` to the external survey (Google Forms, Mentimeter, or another provider). Links open in a separate tab without passing names, emails, or other personal fields in the URL. No survey iframe, payment callback, payment verification, questionnaire answers, or completion tracking exists on this site.

Guests can proceed to questions without clicking or verifying payment. Payment matching is informal organizer work. The page does not claim a paid/confirmed spot. Missing payment or survey links show clear fallback copy rather than broken links. Only HTTPS outbound URLs are enabled.

Guests may bookmark `registration.html#questionnaire` and open it on another device without registering again. Browser back/forward and refreshing preserve the visible stage; same-tab session storage holds only a receipt flag and random request ID, never name/email/notes or payment/questionnaire status. If storage is blocked, the current-page flow still works. Starting another registration resets that tab's receipt, not previously submitted data.

Survey save/resume belongs to the chosen provider. For example, [Google Forms saves drafts for 30 days when the respondent is signed into a Google account](https://support.google.com/docs/answer/10952360?hl=en); the form owner can disable that feature. Test those settings before promising resume behavior. We currently make no provider-specific saving promise on the page.

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

Tests use an isolated headless browser and a temporary local HTTP server. They cover the homepage link, configuration missing/invalid, validation, failure/retry, acknowledgment, duplicate clicks, data minimization, external questionnaire navigation, browser history, refresh, registering a second attendee, and mobile overflow. Screenshots use a mocked submission endpoint and example.com outbound links; no real accounts, payments, emails, or questionnaire responses are involved.

## Review screenshots

The configured screenshots show synthetic attendee details; the dates and contribution remain TBA. The not-open screenshot is the actual checked-in configuration.

| Stage | Desktop | Mobile |
| --- | --- | --- |
| Details | [Screenshot](screenshots/desktop-01-details.png) | [Screenshot](screenshots/mobile-01-details.png) |
| Tikkie | [Screenshot](screenshots/desktop-02-payment.png) | [Screenshot](screenshots/mobile-02-payment.png) |
| External questionnaire | [Screenshot](screenshots/desktop-03-questionnaire.png) | [Screenshot](screenshots/mobile-03-questionnaire.png) |
| Later | [Screenshot](screenshots/desktop-04-later.png) | [Screenshot](screenshots/mobile-04-later.png) |

[Registration not open](screenshots/registration-not-open.png) · [Submission error](screenshots/submission-error.png) · [Questionnaire not ready at 320px](screenshots/questionnaire-not-ready-mobile.png)
