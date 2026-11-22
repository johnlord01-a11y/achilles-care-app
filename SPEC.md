# Achilles Insertional Tendonosis Care App — Frozen Spec (Nov 22, 2026)

Authorized by John overnight Nov 21-22, 2026: build an app like the plantar
fasciitis care app, for Achilles insertional tendonosis, improving looks and
function, as the Hermes Coder pilot on the HP Pavilion. No further approvals
needed until human review of the finished app. Do NOT merge/publish beyond a
GitHub Pages live preview in the same pattern as the plantar app; John reviews
in the morning.

## Sources (verified live Nov 22, 2026 — use ONLY these for clinical content)
1. Condition guide: https://practicalpodiatrist.com/condition/achilles-insertional-tendonosis/
   - 3-step roadmap: PROTECT / REDUCE swelling manually / CONTROL inflammation made.
   - Protect: bilateral heel lifts firm 1/4–1/2 inch in BOTH shoes; supportive
     high-drop shoes (structured athletic shoe, drop 10mm or higher); avoid
     barefoot, flat sneakers, zero-drop until pain improves; soft heel counter
     or open back (wedge mule/slide); padding on each side of heel bone with a
     gap in the center over the painful prominence; walking boot for severe
     sharp ripping pain with every step (+ heel lift in boot, EvenUp on other
     shoe, crutches/knee scooter if boot too uncomfortable).
   - Reduce: elevation on pillows above heart level; targeted compression
     massage — gentle upward strokes along BOTH sides of the heel bone
     flanking the tendon, broad finger pads or flat palms, no digging thumbs,
     lotion to glide; soft roller/pool noodle for the calf, always upward;
     CAUTION: no aggressive direct pressure/grinding over the central back of
     the heel, the bony bump, or the insertion. Static strap stretch: strap
     around ball of foot (never toes), knee mostly straight, mild comfortable
     pull in the CALF not the heel, ease off if burning/pressure at back of
     heel; hold 30s, release 15s, 3–5 reps per session, 2–4 sessions/day while
     elevating, daily until resting heel pain completely resolves. Best time:
     after resting, right before standing — before the first steps.
   - Control tiers: Tier 1 topical NSAID gel (diclofenac/Voltaren) over back
     of heel 3–4x/day. Tier 2 oral NSAIDs — clinician determines dose;
     Partial Response Rule (helps but not enough → switching within the class
     can help); Zero Response Rule (zero relief → another NSAID will almost
     certainly fail too; different class or mechanical cause). Tier 3 oral
     steroids — 6-day dose pack pitfall (too short for calcaneal bone marrow
     edema; relief starts day 5–6 then rebound); custom symptom-guided taper,
     dose set by physician. ABSOLUTE INJECTION RULE: no cortisone injections
     into or around the Achilles tendon — tendon weakening / rupture risk.
     Tier 4 in-office: ESWT, PRP.
   - Surgery considered after 6–12 months of failed structured conservative care.
2. Recovery timeline post: https://practicalpodiatrist.com/insertional-achilles-tendon-pain-recovery-timeline/
   - Phases: Weeks 0–2 acute offloading; Weeks 2–6 flat-ground consolidation;
     Weeks 6+ rehab and loading (hills gradually, 1–2 recovery days after a
     hill walk, PT once a week for six weeks, slow loading on flat ground,
     lowering only to the floor — NOT heel drops below floor level, which
     compress the insertion).
   - Two-week checkpoint: some improvement, even mild, expected by ~2 weeks;
     meaningful settling usually 4–6 weeks. No improvement at all by 2 weeks
     or pain getting worse → check back sooner, do not wait for 6 weeks.
   - Compression sleeve worn regularly; night splint ONLY if morning
     symptoms and it does not worsen first-step pain.
   - Urgent: sudden pop/snap at back of heel, or cannot push off / rise on
     toes → urgent care, possible rupture.
   - Gentle motion: towel/band pull-back to no further than level with shin,
     point foot down slowly 3–5 seconds each direction, 1–2 minutes,
     2–3 times a day, finish with massage. (Use as the motion note; the
     guide's static stretch protocol above is the app's scheduled stretch.)

## Hard rules
- No printed mg doses for oral NSAIDs or steroids. The only frequency numbers
  allowed are those in the sources above (gel 3–4x/day; stretch holds/reps;
  heel lift sizes; shoe drop). Steroid = exactly as prescribed, morning.
- Oral NSAID doses are pain-gated like the plantar app: take it if the heel
  hurts at that dose time; if there is no pain, skip that dose. Follow the
  prescribed schedule if it differs.
- Education only. Disclaimer in the app. NEVER associate with EmergeOrtho.
- Framework wording = his three parts, Achilles wording: protect the injured
  tissues / reduce the swelling manually / control inflammation being made.

## App design (improvements over plantar v1)
- Same skeleton: Today's Plan / Progress / Care Guide tabs, pain scores
  (first-step AM, tonight PM), daily checklist persisted in localStorage,
  14-day history. Keys prefixed achilles_.
- Tier selector (Tier 1 gel / Tier 2 oral NSAID / Tier 3 steroid taper /
  No medication) instead of drug-name picker.
- Boot mode toggle: changes the day's plan (boot + EvenUp tasks replace
  shoes task; gel/massage caution notes stay).
- Stretch timer: interactive 30s hold / 15s rest, 4 reps, with session
  complete button that checks off the current stretch session task.
- Progress tab: phase tracker by day number (0–2 / 2–6 / 6+ weeks) +
  two-week checkpoint + 4–6 week settling note.
- Looks: distinct warm palette (stone/amber/orange) vs plantar teal;
  3-step roadmap chips at the top of Today's Plan (Protect / Reduce /
  Control); cleaner cards, progress ring percentage in header.
