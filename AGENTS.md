# AI Convos project guidance

## Purpose

AI Convos is an Amsterdam meetup series for people who work deeply with AI. The talks create shared context; the conversation in the room is the main event. Keep the project grounded in specific experiences, candid lessons, and useful questions rather than hype or polished sales pitches.

`index.html` is the public website we are building to introduce AI Convos to potential new guests. It should make the community, upcoming edition, and history understandable and inviting without requiring visitors to know the organizers or previous editions.

## Where context lives

- Read [CONTEXT.md](./CONTEXT.md) for the project language.
- Read [EVENTS.md](./EVENTS.md) to find the context file for each edition.
- Read the relevant file under [`events/`](./events/) before writing or changing event content.
- Treat the edition files as the source of truth for event facts. Keep `index.html`, the public website, aligned with them.
- Put durable working principles here and edition-specific facts in that edition's context file. Do not make `AGENTS.md` or `EVENTS.md` a duplicate event database.

## Working with event information

- Model each gathering as an **edition** in one chronological series, even when its public name changed between AI Sessions, AI Connect, and AI Convos.
- Separate facts from format. Dates, venues, speakers, links, and prices belong to an edition; principles such as short talks, discussion, and time to connect belong to the series.
- Mark information as confirmed, provisional, unknown, or conflicting. `TBA` means unknown; never fill it from a nearby edition or a recurring pattern.
- Preserve disagreements between sources and surface them for resolution. Do not silently choose a date, venue, speaker, duration, or spelling when records conflict.
- Prefer direct organizer notes and final invitations over existing website copy. Use the current site only as supporting evidence when an edition file is incomplete.
- Use absolute dates including the year. Keep an event date distinct from the date on which it was announced.
- Distinguish the host organization from the physical venue. Credit both when known.
- Treat payment links and schedules as time-sensitive. Do not reuse them for another edition, and verify them before publishing.

## Updating the site

- Reconcile the affected edition file before changing event details in `index.html`.
- Keep editions in chronological order and preserve their historical public names.
- Check weekday/date combinations, organization and speaker spellings, address, start time, talk duration, and link freshness.
- When new evidence resolves a conflict, update the edition file and remove the obsolete conflict note in the same change.
