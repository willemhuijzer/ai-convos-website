# Event registration options for AI Convos

_Research checked 24 September 2026. Pricing and feature packaging are especially volatile; re-check the linked pricing page and the actual account checkout before committing._

## Executive recommendation

For AI Convos, start with a branded event-detail page on the existing site and let **Luma** own registration. The event card should navigate to the on-site detail/registration page; its primary call to action can either open Luma's registration overlay or send the visitor to the hosted Luma page. This preserves the site's story and visual identity while avoiding a custom attendee-management system.

Why Luma is the best default for this specific use case:

- It combines free RSVP registration, capacity, approval, waitlist, attendee emails, calendar invitations, reminders, CSV export, and check-in in one operationally light product. The free tier currently allows unlimited events and guests; paid events carry a 5% platform fee plus Stripe, while Luma Plus removes the platform fee and adds API access ([Luma pricing](https://lu.ma/pricing)).
- Its hosted page is ready immediately, and the overlay button or compact event-page embed takes only a generated snippet. The trigger button can be styled, though the registration overlay itself cannot ([Luma embed guide](https://help.lu.ma/p/embed-our-checkout-registration-button-on-your-website)).
- Registration sends a confirmation email with a calendar invitation; Luma also sends default reminders and updates invitations when core event information changes ([registration flow](https://help.lu.ma/p/event-registration-process), [event updates](https://help.lu.ma/p/updating-event-information)).
- Capacity and an over-capacity waitlist are native, including pending payment authorization for paid tickets and manual approval when a place opens ([Luma waitlist](https://help.luma.com/p/waitlist)).

Prototype three interaction variations before choosing the final presentation:

1. **Branded on-site page → hosted Luma page.** Lowest implementation and operational risk. Best mobile/payment compatibility. The handoff to `luma.com` is visible.
2. **Branded on-site page → Luma modal overlay.** Keeps the visitor visually on AI Convos and is still very easy to integrate. The overlay is Luma-styled and some payment methods, including Apple Pay in some embedded contexts, may not be available; Luma recommends a direct link for full payment-method support ([payment methods](https://help.lu.ma/p/payment-methods)).
3. **Branded on-site page → inline native-looking registration.** Prototype this with Tito or pretix, not with a custom backend. Tito is the simpler, more styleable widget; pretix is the stronger choice if approval and EU-centric data handling are hard requirements.

Use **Tally** only as the intentionally lean alternative for a free, simple RSVP or an interest form. It is excellent for testing an on-brand form, but it is not an event-operations product: confirmation emails require Pro, and approval, a real waitlist, calendar invitations, ticketing, and check-in would all need separate automation or manual work.

## Comparison at a glance

| Tool | Best fit | Static-site integration | Approval / waitlist | Email + calendar | Current cost signal | Overall fit |
|---|---|---|---|---|---|---|
| **Luma** | Community events and meetups | Hosted page, popup button, compact event-page/calendar embed | Native approval, capacity, and waitlist | Confirmation, calendar invite, reminders, updates | Free events; 5% + Stripe for paid on Free; Plus shown as US$59/mo billed annually | **Best default** |
| **Tito** | Brand-led free or paid ticketing | Hosted page; inline or popup widget with custom CSS | Ticket-level waitlists; no documented general application-approval flow in Classic | Confirmation emails and ICS calendar file | Free events free; 3% per paid ticket + payment gateway | **Best styleable embed** if approval is not needed |
| **pretix** | Approval-heavy, complex, or EU-first ticketing | Hosted/custom-domain shop; deeply styleable widget or button | Native per-order approval and automated/manual waitlist | Customizable transactional email; tickets/calendar files can be attached | Hosted 2.5% of net ticket price, max €15; first 500 free tickets/year free | **Best powerful/EU option**, but heavier |
| **Eventbrite** | Public discovery and mainstream ticket sales | Hosted marketplace page; inline/modal checkout | Native capacity/waitlist; no documented first-class application approval found | Confirmation and reminders; attendee can add ticket to calendar | Free tickets free; NL paid fees vary by legacy package/account | Good only if marketplace discovery matters |
| **Tally** | Simple RSVP or interest form | Hosted, inline, popup, or full-page embed | Submission cap/date close only; no real waitlist/approval | Respondent email is Pro; no native event calendar invite found | Most features free; Pro US$29 monthly or US$24/mo annual-equivalent; Stripe only, no Tally surcharge | **Best lean experiment**, not full event ops |

## Integration patterns worth prototyping

### A. Hosted registration, reached through an on-site event page

The existing event card links to an AI Convos route such as `/events/<slug>`. That page contains the event's complete narrative, speaker/venue details, expectations, privacy note, and a strong **Register** button. The button opens the provider's hosted page in the same tab or a new tab.

- **Advantages:** almost no third-party JavaScript; best accessibility/payment compatibility; provider changes do not break the site; clear fallback if scripts are blocked.
- **Trade-off:** the final registration step is visibly off-site.
- **Best provider:** Luma. Tito and pretix also provide hosted pages; Eventbrite adds marketplace context that can distract from the AI Convos brand.
- **Implementation effort:** very low once the event page exists—store one external registration URL per event.

### B. Provider-owned overlay from a first-party button

The on-site event page retains its design. Clicking **Register** launches the provider checkout in a modal/overlay.

- **Advantages:** low code, high continuity, no backend or secrets.
- **Trade-off:** third-party UI and scripts are now part of the page; consent/CSP/performance/accessibility need testing; mobile providers may fall back to a new tab.
- **Best provider:** Luma for the operational feature set; Tito when fine-grained widget styling matters. Eventbrite supports modal checkout and a completion callback; pretix can open its shop dynamically.
- **Implementation effort:** low—typically a script include, event identifier/URL, and a noscript/direct-link fallback.

### C. Inline registration block

The provider's tickets or form are rendered inside the page, below the event summary.

- **Advantages:** registration feels like part of the product; useful for comparing ticket types without another click.
- **Trade-off:** larger visual and technical footprint, more mobile QA, CSP/cookie-consent work, and possible third-party layout shifts. It also makes the provider harder to swap.
- **Best provider:** Tito for a compact, CSS-styleable ticket widget; pretix when complex ticket, approval, or waiting-list rules are needed. Tally is easiest for a simple free RSVP form.
- **Implementation effort:** low-to-medium. Tito is roughly two HTML lines; pretix adds CSS/JavaScript assets and more configuration; Tally supplies a generated responsive iframe/script embed.

### D. Fully custom registration backend

Do not prototype this yet. It would require validation, duplicate prevention, capacity locking, transactional email, calendar files, privacy workflows, exports, abuse controls, and possibly payments/refunds. The existing services already solve these operational edge cases. A custom UI using a provider API could be reconsidered only after repeated events expose a specific limitation worth maintaining code for.

## Detailed findings

### 1. Luma

**Hosted page and embedding.** Every event has a shareable hosted event URL and registration form ([registration flow](https://help.lu.ma/p/event-registration-process)). Luma supplies an embeddable button that opens registration in an overlay, a compact event-page embed, and a calendar embed. The button is styleable with site CSS, but the overlay and embedded event page are not visually customizable ([embed guide](https://help.lu.ma/p/embed-our-checkout-registration-button-on-your-website)). This is compatible with a static site because there is no secret or server-side code.

**Branding.** Hosted pages support cover imagery, curated themes, fonts, effects, and some theme color control ([themes and customization](https://help.lu.ma/p/event-themes-and-customization)). Luma Plus can provide a custom `lu.ma/<slug>` URL, but Luma explicitly does not support white-label URLs on a host's own domain ([event URL documentation](https://help.lu.ma/p/updating-event-information)). Embedding is therefore the better choice when `ai-convos.nl` must remain visible.

**Capacity, approval, and waitlist.** The free plan lists required approval and unlimited guests. Hosts can set event and ticket capacity, require approval, and activate an event-wide over-capacity waitlist. Waitlisted guests can be approved or declined individually or in bulk. Paid waitlist registrations authorize payment and are charged only upon approval ([pricing](https://lu.ma/pricing), [waitlist behavior](https://help.luma.com/p/waitlist), [guest management](https://help.luma.com/p/managing-your-guest-list)).

**Email and calendar.** Successful registration sends an automatic confirmation with calendar invitation; default in-person reminders go out one day and one hour before the event. Changes to the event name, time, duration, or location trigger an email and updated calendar invite ([registration flow](https://help.lu.ma/p/event-registration-process), [event updates](https://help.lu.ma/p/updating-event-information)).

**Payments and fees.** Luma uses a connected Stripe account. The free tier currently charges a 5% Luma platform fee on paid events, on top of Stripe's fee; Luma Plus advertises 0% Luma platform fee. The official pricing page gives a typical Stripe reference of 2.9% + US$0.30, but the actual Stripe fee is country/payment-method dependent. Prices shown to guests include Luma's platform fee rather than adding it as a surprise checkout line ([paid events](https://help.lu.ma/p/helpart-Ae6GwCVdJKEOXiV/creating-a-paid-event), [pricing](https://lu.ma/pricing)). In embedded iframes, some payment methods such as Apple Pay may be unavailable, which favors direct hosted checkout for paid events ([payment methods](https://help.lu.ma/p/payment-methods)).

**Export, privacy, and GDPR.** Guest data can be exported by CSV. Luma publishes a DPA under which the host is the controller and Luma generally acts as processor for core event services, with EU standard contractual clauses for relevant transfers ([guest management](https://help.luma.com/p/managing-your-guest-list), [Luma DPA](https://lu.ma/dpa), [GDPR/security](https://help.lu.ma/p/helpart-AxqMaWNnKrpjuHv/gdpr-security)). Luma is a US company and can also act as an independent controller for a guest's broader interaction with Luma, so the privacy notice on the AI Convos registration page should link both the AI Convos notice and Luma's notice.

**API and webhooks.** Luma Plus is required for the JSON API. The API can manage events, guests, ticket types, invitations, messages, coupons, and calendars. It also exposes webhooks for event and guest/ticket changes ([API getting started](https://docs.luma.com/reference/getting-started-with-your-api), [API/webhook index](https://docs.luma.com/llms.txt)). This is future flexibility, not necessary for the first static-site integration.

**Likely effort.** Hosted link: hours. Overlay or event embed: less than a day including mobile, keyboard, CSP, and no-script testing. API-backed custom UI: multiple days plus ongoing maintenance.

### 2. Tito

**Hosted page and embedding.** Tito automatically provides `https://ti.to/<account>/<event>` as a hosted event page, with basic homepage customization ([event homepage](https://help.tito.io/en/articles/2006289-the-event-homepage)). Widget v2 can render ticket selection inline or open the checkout in an overlay, and the minimal integration is a script include plus `<tito-widget event="…">` ([widget guide](https://help.tito.io/en/articles/2003029-widget)). This is straightforward on a static site.

**Branding.** The hosted page accepts images, additional content, two layouts, and a background color ([event customization](https://help.tito.io/en/articles/2002388-customising-your-event)). The inline widget can be styled using the site's CSS or even loaded without Tito's widget CSS, giving it more first-party visual control than Luma ([widget v2 migration/customization](https://help.tito.io/en/articles/6995550-how-do-i-update-the-tito-widget-from-version-1-to-version-2)). Checkout still runs as Tito's registration flow.

**Capacity, approval, and waitlist.** Ticket quantities provide capacity. A waiting list can be enabled per sold-out ticket; organizers manually offer a one-use ticket link, optionally with an expiry, and guests receive join/offer emails ([waiting lists](https://help.tito.io/en/articles/2003015-waiting-lists)). In the Tito Classic sources reviewed, no general “request to attend, then approve or decline” workflow comparable to Luma or pretix was documented. Treat that as a product-validation question, not proof that no Tito product can support it: Tito's separate Pro product is described as invitation-only, while this comparison is of the public Tito Classic documentation.

**Email and calendar.** Tito automatically sends order/ticket confirmation messages and lets the organizer add a note; notifications can be disabled in favor of webhook-driven custom mail ([attendee emails](https://help.tito.io/en/articles/3673367-what-emails-are-sent-to-attendees), [notification webhooks](https://help.tito.io/en/articles/4684176-notification-emails-and-webhooks)). Tito generates an ICS file, links it from the hosted page, and includes it in the ticket email ([calendar support](https://help.tito.io/en/articles/9744485-how-can-attendees-add-the-event-to-their-calendar)).

**Payments and fees.** Free events are free. Paid events currently cost 3% per ticket (2.5% for accepted charity/community/non-profit events), capped at €25 per ticket, plus a connected Stripe or PayPal gateway's fees. There is no setup fee or monthly subscription, and funds go directly through the selected gateway ([Tito pricing](https://ti.to/pricing)). The page currently illustrates European Stripe card fees as 1.4% + €0.25 for European cards and 2.9% + €0.25 for non-European cards; verify actual Dutch Stripe/PayPal pricing before launch.

**Export, privacy, and GDPR.** Attendee and order data export to CSV or Excel, including custom exports ([exports](https://help.tito.io/en/articles/5411873-how-can-i-download-attendee-and-order-data)). Tito is an Irish company, states that attendee processing on an organizer's behalf is as processor, stores/processes personal data on servers in the EEA, and says its AWS hosting is in Ireland ([privacy and security policy](https://ti.to/privacy), [Tito DPA guidance](https://help.tito.io/en/articles/2032680-does-tito-have-a-data-processing-agreement-dpa-for-gdpr-compliance)). This is an attractive privacy posture for an Amsterdam-based event, though AI Convos remains responsible for its own lawful basis, notices, retention, and downstream exports.

**API and webhooks.** Tito offers JSON webhooks and a read/write REST Admin API; the official integration guide calls webhooks the path of least resistance ([integrations](https://help.tito.io/en/articles/2006332-integrations)). Widget callbacks can also report checkout lifecycle events for analytics.

**Likely effort.** Hosted link: hours. Polished inline embed: one to two days, mostly styling and responsive/accessibility checks. Custom workflows through API/webhooks: multiple days.

### 3. pretix

**Hosted page and embedding.** pretix Hosted supplies a standalone ticket shop. Its widget can display tickets without leaving the site, and its button can open checkout; both are added with generated CSS/JavaScript and custom HTML snippets. There is a noscript direct-link fallback ([widget documentation](https://docs.pretix.eu/guides/widget/)). A self-hosted, open-source Community edition exists, but running and updating a Linux application is disproportionate for this site; Hosted is the meaningful comparison.

**Branding.** Hosted shops support logo, colors, style, multiple languages, static pages, and a custom domain with SSL. The widget exposes extensive CSS hooks ([shop features](https://pretix.eu/about/en/features/shop), [custom domains](https://docs.pretix.eu/guides/custom-domain/)). This offers the strongest white-label path in the comparison.

**Capacity, approval, and waitlist.** Quotas control availability. Products can require organizer approval before payment, and the customer receives an approval/denial email. pretix warns that paid customers must interact twice—application, then payment—while free approved orders avoid the second payment step ([restricted audience](https://docs.pretix.eu/guides/products/restricted-audience/)). Waiting lists can automatically offer a newly available ticket to the next person with a redemption window, or operate manually ([shop features](https://pretix.eu/about/en/features/shop)). This is the most capable fit if AI Convos curates attendees.

**Email and calendar.** Transactional content and sending infrastructure are configurable. pretix has templates for free, placed, and paid orders, plus approval/rejection and waiting-list events; manual and scheduled emails can attach tickets, calendar files, or other files ([email settings](https://docs.pretix.eu/guides/email/)). This is powerful, but the organizer has more setup decisions than with Luma's opinionated automatic flow.

**Payments and fees.** pretix Hosted currently charges 2.5% of the ticket price excluding tax, capped at €15 per paid ticket, plus the chosen payment provider. There is no monthly fee. The first 500 free tickets each calendar year are free; every paid ticket expands that free quota by one; additional free tickets are €0.50 each. Prices exclude VAT ([pretix pricing](https://pretix.eu/about/en/pricing)). Payment can go directly to an organizer-owned account at providers such as Stripe, PayPal, or Dutch provider Mollie ([payment features](https://pretix.eu/about/en/features/payment)).

**Export, privacy, and GDPR.** pretix exports PDF, Excel, and CSV and has a broad REST API ([administration features](https://pretix.eu/about/en/features/admin)). pretix GmbH is German, states it does not share organizer customer data, offers a DPA generated from the organizer settings, and describes Hosted customers as controllers and pretix as processor ([privacy](https://pretix.eu/about/en/privacy), [GDPR guidance](https://docs.pretix.eu/trust/privacy/gdpr/), [DPA](https://pretix.eu/about/en/dpa)).

**API and webhooks.** The REST API covers events, products, quotas, orders, waiting-list entries, check-in, exporters, and more ([API reference](https://docs.pretix.eu/dev/api/index.html)). Webhooks cover order placement/approval/denial, payments, cancellations, waiting-list changes, and check-ins ([webhook documentation](https://docs.pretix.eu/dev/api/webhooks.html)).

**Likely effort.** Hosted link: half a day after learning the richer configuration. Branded widget: one to three days. The widget documentation currently calls for pretix origins in the site's Content Security Policy and includes `script-src 'unsafe-eval'`, which deserves an explicit security review ([widget CSP notes](https://docs.pretix.eu/guides/widget/)). The operational configuration surface is much larger than Luma or Tito; use it only when that control is valuable.

### 4. Eventbrite

**Hosted page and embedding.** Eventbrite supplies a public hosted listing/checkout and an embedded checkout widget that can be modal or inline. The official widget takes an event ID and callback; it allows brand, font, and background colors but not layout changes ([embedded checkout docs](https://www.eventbrite.com/platform/docs/embedded-checkout)). A static page can load it directly over HTTPS.

**Branding and discovery.** Hosted pages support images and event content, and custom links remain on `*.eventbrite.com`, not the organizer's domain ([custom links](https://www.eventbrite.com/help/en-us/articles/560293/)). Eventbrite's differentiator is its marketplace and recommendations; if AI Convos wants discovery from people already browsing events, that can outweigh the extra Eventbrite visual context ([event discovery](https://www.eventbrite.com/features/event-discovery/)). The current Netherlands package page associates selling on one's own site and customizable checkout forms with Professional, so confirm the account's widget entitlement before designing around it ([Netherlands packages](https://www.eventbrite.nl/organizer/packages/)).

**Capacity, approval, and waitlist.** Ticket type quantities control capacity. Eventbrite has a native waitlist that can automatically offer an available ticket to the next person for a limited period ([waitlist feature](https://www.eventbrite.com/features/waitlist/)). In the official registration/help material reviewed, no first-class attendee application approval flow comparable to Luma or pretix was found; custom questions, private/unlisted events, manual guest lists, or waitlisting are not the same capability. Validate this directly if approval is required.

**Email and calendar.** Orders produce confirmation emails/tickets, and published events get automatic reminder email(s) that organizers can edit or delete ([confirmation emails](https://www.eventbrite.com/help/en-us/articles/583361/), [automatic reminders](https://www.eventbrite.com/help/en-us/articles/222665/)). Attendees can add a ticket to Calendar from the Eventbrite app ([app ticket management](https://www.eventbrite.com/help/en-us/articles/783059/)). This is less explicitly calendar-first than Luma's automatically delivered calendar invitation.

**Payments and fees.** Free tickets have no ticketing fees. Paid-ticket fees vary by payout country, currency, and plan; the buyer pays by default, though the organizer can absorb them ([fees](https://www.eventbrite.com/help/en-us/articles/755615/)). The official Dutch help page currently lists legacy Netherlands Essentials fees of €0.49 per ticket below €10.01 or 2% + €0.49 above €10.01, and Professional at €0.99 below €10.01 or 4% + €0.99 above €10.01; this table expressly applies to countries/accounts with legacy package arrangements, so the in-account quote is authoritative ([Dutch fee table](https://www.eventbrite.com/help/nl-nl/articles/755615/wat-kost-het-gebruik-van-eventbrite-voor-organisatoren/)). Pricing complexity is a drawback for early prototyping.

**Export, privacy, and GDPR.** Attendee reports export to CSV or Excel ([attendee report](https://www.eventbrite.com/help/en-us/articles/496608/)). Eventbrite's organizer DPA makes the organizer controller and Eventbrite processor for core event services, but Eventbrite can be an independent controller for broader consumer interactions and product/recommendation analytics; EU transfers use standard contractual clauses ([organizer DPA](https://www.eventbrite.com/help/da/articles/429030/data-processing-addendum-for-organizers/)). That marketplace relationship should be reflected in AI Convos' privacy communication.

**API and webhooks.** Eventbrite has an OAuth/API platform covering events, attendees, orders, ticket classes, and organization webhooks ([API reference](https://www.eventbrite.com/platform/new/api), [OAuth flow](https://www.eventbrite.com/platform/docs/app-oauth-flow)). None is needed for a first hosted/widget implementation.

**Likely effort.** Hosted link: hours. Embedded checkout: about a day, subject to package eligibility. Eventbrite is only the preferred option if discovery, a familiar consumer brand, or its broader organizer tooling is strategically important.

### 5. Tally as a lightweight form alternative

**Hosted page and embedding.** Tally supplies hosted forms plus standard, popup, and full-page embeds. Embedding is free and can use dynamic height, a transparent background, hidden titles, and forwarded query parameters ([embed guide](https://tally.so/help/embed-your-form)). It is the fastest way to prototype a registration form that visually belongs to the site.

**Branding.** Themes, colors, fonts, logos, cover images, and layouts are configurable. Removing Tally branding, custom-domain hosting, and custom code/CSS require Pro ([pricing](https://tally.so/pricing), [custom domains](https://tally.so/help/custom-domains)).

**Capacity, approval, and waitlist.** A form can close on a scheduled date or automatically after a submission limit ([form settings](https://tally.so/help/form-settings)). That is useful for a simple cap, but it is not an event inventory/waitlist system: there is no official native queue, place-release flow, attendee application approval state, ticket, or check-in. An organizer could redirect overflow to a second waitlist form or automate statuses in a sheet/database, but that recreates operations the event tools already provide.

**Email and calendar.** Owner notification is available, but automatic respondent confirmation is a Pro feature ([respondent email](https://tally.so/help/respondent-email-notifications)). No native event calendar invitation workflow was found in Tally's official event/form documentation reviewed. A confirmation can link to a public `.ics` file, or a webhook/Zapier/Make workflow could send one; either adds another system to own and test.

**Payments and fees.** Tally's free tier currently includes its Stripe payment block and does not add a platform fee beyond Stripe ([payment forms](https://tally.so/help/payment-forms)). It is still a form payment, not event ticketing: refunds, ticket transfer, per-ticket capacity, waitlist payment authorization, tax/invoice needs, and check-in are not a coherent built-in flow.

**Export, privacy, and GDPR.** Submissions export to CSV and can sync to Google Sheets ([Tally FAQ](https://tally.so/help/faq), [Google Sheets integration](https://tally.so/help/google-sheets-integration)). Tally is Belgian, says form data is stored in Europe and encrypted in transit/at rest, and provides a DPA that identifies the customer as controller and Tally as processor ([GDPR overview](https://tally.so/help/gdpr), [DPA](https://tally.so/help/data-processing-agreement)). Business adds automated retention controls.

**API and webhooks.** Submission webhooks and the API are free. The API can create/manage forms and access/delete submissions; webhooks send JSON on submission ([webhooks](https://tally.so/help/webhooks), [API](https://tally.so/help/api)).

**Pricing.** Tally advertises unlimited forms and submissions under fair-use limits on Free. Current pricing is US$29/month for Pro or US$24/month when billed annually, and US$89/month for Business or US$74/month when billed annually. Pro removes branding and adds custom domain and respondent mail; Business adds configurable retention and email verification ([plans and pricing](https://tally.so/help/plans-and-pricing), [pricing](https://tally.so/pricing)).

**Likely effort.** Attractive embedded form: hours. Adding reliable confirmation/calendar/waitlist logic: one to several days plus an automation account and ongoing operational ownership. That second phase erodes the initial simplicity.

## Suggested decision rule

Choose based on the hardest operational requirement, not the prettiest form:

- Choose **Luma** if AI Convos wants approval, capacity/waitlist, reminders, calendar invitations, and low organizer effort. This is the recommended first live implementation.
- Choose **Tito** if the event is first-come-first-served and keeping registration visually native is more important than application approval.
- Choose **pretix Hosted** if attendee approval, EU-first vendor posture, white-label/custom-domain presentation, or more complex paid ticket rules are firm requirements.
- Choose **Eventbrite** if marketplace discovery and a widely recognized ticketing account/ecosystem are more valuable than a quiet, branded community experience.
- Choose **Tally** only if the experiment intentionally asks, “Can a capped RSVP form be enough?” and the team accepts manual or separately automated attendee operations.

## Practical prototype evaluation checklist

Run the same event content through each of the three design variations and test:

1. Mobile registration completion, including returning from a password manager or payment sheet.
2. Keyboard-only and screen-reader flow; focus return after closing an overlay.
3. JavaScript-disabled/direct-link fallback.
4. Whether the provider script is permitted by the site's Content Security Policy.
5. Cookie/analytics behavior and whether consent configuration is required before loading the embed.
6. Sold-out, pending-approval, approved, declined, canceled, and waitlisted states—not only the happy path.
7. Confirmation sender identity, spam placement, calendar behavior in Google/Apple/Outlook, and event-update handling.
8. Data export contents, deletion workflow, and the registration-page privacy wording.
9. How an organizer handles a cancellation ten minutes before the event and promotes the next waitlisted person.
10. Provider outage fallback: the event page should retain a plain registration URL and organizer contact even if an embed fails.

## Recommended scope for the first implementation after prototyping

Keep the site's integration deliberately thin:

- Add a local event-detail/registration route and point the upcoming-event card to it.
- Store provider URL and registration mode (`link` or `overlay`) as event data rather than hard-coding provider markup throughout the page.
- Give the page a prominent register CTA, a secondary direct-link fallback, capacity/status copy, and a short privacy notice.
- Load third-party registration JavaScript only on the event page and preferably only after the visitor acts, rather than on the homepage.
- Do not add API credentials to a static client bundle. CSV export and the provider dashboard are enough for the first events.
- Use the provider as the source of truth for registration status; the website should not promise “spots remaining” unless that value is supplied reliably.

That scope makes the provider replaceable, allows the hosted-link and overlay prototypes to share one page design, and postpones API/webhook work until there is a demonstrated operational need.

## Addendum: using a personal Tikkie as the attendance deposit

_Checked 25 September 2026 against Tikkie and ABN AMRO's official consumer, business, and developer material._

### Decision

A personal Tikkie can work for a deliberately manual first edition, but it cannot be the registration system or automatically prove that a named website registrant has a place. Treat it as **evidence that money arrived**, then let the organizer reconcile and confirm the attendee. Do not show “your spot is confirmed” merely because the visitor returned from Tikkie.

For the prototype, the form button should therefore say **Continue to payment** rather than **Reserve my seat**. After payment, the site can invite the guest back, but the state is “payment awaiting confirmation” until AI Convos has matched it. The questionnaire should be offered from the confirmation email (and optionally from the pending screen), with a durable personal link so it can be completed later.

### What a personal Tikkie does and does not establish

- The sender sees whether a request was paid and receives a push notification. ABN AMRO also says the recipient sees the payer's **name and account number** in the payment description, plus the request subject ([Tikkie FAQ](https://tikkie.me/vraag-en-antwoord/nl), [ABN AMRO consumer Tikkie page](https://www.abnamro.nl/nl/prive/internet-en-mobiel/apps/tikkie/)). That is useful payment evidence.
- It is not reliable attendee identity. Someone else can pay, a joint-account name can differ, and the payment contains no registration email or questionnaire state. Tikkie explicitly says it does not know who the sender shared a request with. A reusable link can also be forwarded. The Tikkie payment list is therefore a **paid-transactions list, not a guest list**.
- The official consumer material documents no custom return URL, webhook, callback, or API for personal requests. The payer gets Tikkie's own post-payment experience; the website cannot securely infer payment from a browser return or an “I paid” click. The published [Tikkie API](https://developer.abnamro.com/api-products/tikkie/reference-documentation) is explicitly for **Tikkie business customers**.
- Personal requests are valid for two weeks and can be deleted early. One request can be sent to a group, and one request can receive at most €2,500 in total; a personal Tikkie amount cannot exceed €950, and a receiver can receive at most €2,500 through Tikkie in 24 hours ([Tikkie FAQ](https://tikkie.me/vraag-en-antwoord/nl)). Tikkie also exposes an official “maximum number of payments reached” state without publishing that count, so a shared link should not be used as the event's capacity control ([limit page](https://tikkie.me/max-betalingen)).
- Most supported instant payments arrive within seconds, but the FAQ allows up to one working day when the receiving bank does not support Instant Payments. A daily/request limit, expired/deleted link, bank limit, outage, abandoned bank flow, or a sold-out event between form submission and payment can all interrupt the happy path.
- A personal refund is manual. Tikkie warns not to send money back to its clearing account: the organizer needs the payer's own account number or can ask the payer to send a new Tikkie ([Tikkie FAQ](https://tikkie.me/vraag-en-antwoord/nl)). By contrast, the business API models payment requests, payments, and refunds as separate resources ([ABN AMRO's Tikkie API announcement](https://developer.abnamro.com/index.php/news/announcement-tikkie-api)).

### Recommended manual v1 flow

1. The guest submits name and email. Ask only one matching question: **“Will the payment come from another person's or joint account? If so, whose name will we see?”** Create a pending registration.
2. Show the fixed fee, refund/cancellation rule, two-week link deadline, and **Pay with Tikkie**. Open Tikkie in a new tab so the pending page survives. Keep a plain copyable link/QR fallback.
3. The returning page says **“Paid? We will match it and email your confirmation.”** An “I paid” button may help the organizer prioritize reconciliation, but must not grant a place.
4. The organizer matches amount and payer/account name to the pending form, then marks it confirmed and sends one confirmation email. Paid-and-matched registrations—not form submissions—are the capacity source of truth.
5. That email links to **Start the questionnaire** and **Do it later**. The same personal link should remain usable until the event; at check-in, staff can open the outstanding questionnaire on a shared device if needed.
6. Disable/delete the Tikkie and switch the page to sold-out/waitlist before releasing the final place. Keep an exception queue for unmatched payments, duplicate payments, payment without a form, and refunds.

This remains a human-operated workflow. For a small room it may be an acceptable experiment, provided the page promises confirmation only after matching and somebody owns reconciliation. It is a poor fit if immediate confirmation, exact real-time capacity, automatic reminders, or low organizer effort is required.

### Product boundary, privacy, and automation alternative

Tikkie describes the consumer app as repaying friends, and says its consumer limits exist partly to prevent commercial use. Tikkie separately positions **Tikkie Business** for accepting customer payments ([consumer FAQ](https://tikkie.me/vraag-en-antwoord/nl), [Tikkie Business](https://www.abnamro.nl/nl/zakelijk/producten/betalen/tikkie-zakelijk/index.html)). A recurring publicly advertised event fee is close enough to that boundary that AI Convos should ask Tikkie whether personal use is acceptable before publishing the link; “informal” or “not for profit” does not by itself answer the product-eligibility question.

If AI Convos later has an eligible registered organization, Tikkie Business currently provides a portal/app with payer-name, reference, status, custom validity, and a separately requested API; ABN AMRO's developer material adds programmatic payment requests, payment records, refunds, and automated reconciliation. The business service currently starts at €7.50/month including 20 paid Tikkies, then per-paid-request charges ([business product and pricing](https://www.abnamro.nl/nl/zakelijk/producten/betalen/tikkie-zakelijk/index.html)). ABN AMRO states that its business products require a KVK-registered organization, so eligibility must be checked rather than assumed ([business account guidance](https://www.abnamro.nl/nl/zakelijk/producten/zakelijke-rekening/opzeggen.html)). If that organizational overhead is not wanted, use a paid event provider such as Luma or pretix instead of building confirmation around a personal Tikkie.

The registration privacy note should say that AI Convos will use the submitted contact details and the account-holder name visible with the Tikkie payment to reconcile attendance, identify Tikkie/ABN AMRO as the payment provider, and state retention/deletion and the questionnaire purpose. Do not copy full IBANs into the guest-list tool merely for matching; collect and retain the minimum data necessary, restrict organizer access, and keep questionnaire answers separate from raw payment records where practical. ABN AMRO publishes its current general [privacy statement](https://www.abnamro.com/en/home/information/privacy-statement), while Tikkie provides service-specific privacy information through its site/app.
