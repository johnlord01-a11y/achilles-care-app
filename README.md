# Achilles Insertional Tendonosis Care — Daily Recovery Plan

A small web app that walks a patient through a daily Achilles insertional
tendonosis treatment plan and tracks whether they are actually getting better.
Modeled on the Plantar Fasciitis Care app, with a stretch timer, a medication
tier selector, a walking-boot mode, and a recovery-phase tracker.

Built around Dr. John Lord's three-part approach, as published in his
Achilles insertional tendonosis guide on practicalpodiatrist.com:

1. **Protect the injured tissues** — bilateral heel lifts (firm 1/4–1/2 inch,
   both shoes), supportive high-drop shoes (10mm+), soft heel counter or open
   back, walking boot for severe ripping pain
2. **Reduce the swelling manually** — elevation above heart level, targeted
   compression massage flanking the tendon (never grinding over the central
   bump), static strap stretches (hold 30s / rest 15s, 3–5 reps, 2–4x/day),
   timed before the first steps and while elevating
3. **Control the inflammation being made** — Tier 1 topical NSAID gel,
   Tier 2 oral NSAIDs (pain-gated, clinician-set dose), Tier 3 prescription
   oral steroid taper (exactly as prescribed), Tier 4 in-office ESWT / PRP.
   No cortisone injections into or around the Achilles tendon — ever.

Recovery phases (from his recovery-timeline post): Weeks 0–2 acute
offloading, Weeks 2–6 flat-ground consolidation, Weeks 6+ rehab and loading.
Two-week checkpoint: some improvement, even mild, expected by ~day 14;
meaningful settling usually takes 4–6 weeks.

Clinical content lives in `src/plan.js`; UI in `src/App.jsx`. Education only —
not medical advice for any individual. No oral NSAID or steroid mg doses are
printed in the app.

## Develop

```
npm install
npm run dev
npm run build   # production build in dist/
npm run lint
```

Patient data (daily check-offs, pain scores) is stored only in the browser's
localStorage, per device. Nothing is sent anywhere.
