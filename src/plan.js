// Clinical content for the Achilles Insertional Tendonosis Care app.
//
// Everything a clinician would want to adjust — daily tasks, medication
// tiers, the care guide, red flags — lives in this one file, separate from
// the UI components in App.jsx. Edit the words here and the app updates
// everywhere.
//
// Framework: Dr. John Lord's three-part approach —
//   1. Protect the injured tissues from further damage
//   2. Reduce the swelling manually (elevation, massage, gentle stretch)
//   3. Control the amount of inflammation being made (medication tiers)
// Content is taken from his published Achilles insertional tendonosis guide
// and recovery-timeline post on practicalpodiatrist.com. Education only.
// No oral NSAID or steroid mg doses are printed anywhere in this app.

export const PROTOCOLS = [
  {
    id: 'topical',
    label: 'Tier 1 · Topical Gel',
    blurb:
      'For mild flare-ups: rub an over-the-counter NSAID gel (diclofenac, such as Voltaren) directly over the back of the heel 3 to 4 times a day. It treats the tissue locally, without the stomach upset of a pill.',
  },
  {
    id: 'nsaid',
    label: 'Tier 2 · Oral NSAID',
    blurb:
      'For moderate pain, when gel alone is not cutting it: an oral anti-inflammatory, as prescribed by your doctor, with food. The schedule sets the framework — pain decides each dose: at every dose time, take it if your heel hurts; if there is no pain, skip that dose. If your prescription sets a different schedule, follow your prescription.',
  },
  {
    id: 'steroid',
    label: 'Tier 3 · Steroid Taper',
    blurb:
      'For severe inflammation when NSAIDs have failed: a short course of oral steroids, with the dose and taper set by your physician. Take it exactly as prescribed — the day’s dose first thing in the morning. Never accept a cortisone injection into or around the Achilles tendon: it can weaken the tendon and cause a rupture.',
  },
  {
    id: 'none',
    label: 'No Medication',
    blurb:
      'No anti-inflammatory right now — the plan still works: protect the tendon, work the swelling out by hand, and elevate. If pain is not settling, talk with your clinician about whether a medication tier is right for you.',
  },
];

const PAIN_GATE_DETAIL =
  'Take it if your heel hurts at this dose time; if there is no pain, skip this dose. Follow your prescription if its schedule differs.';

const MED_TASKS = {
  topical: [
    { id: 'gel_1', slot: 'morning', title: 'Topical NSAID Gel (1 of 4) — back of the heel', detail: 'Rub diclofenac gel over the back of the heel. 3 to 4 times a day in total.', time: '7:30 AM', icon: 'pill' },
    { id: 'gel_2', slot: 'midday', title: 'Topical NSAID Gel (2 of 4)', time: '12:30 PM', icon: 'pill' },
    { id: 'gel_3', slot: 'afternoon', title: 'Topical NSAID Gel (3 of 4)', time: '4:30 PM', icon: 'pill' },
    { id: 'gel_4', slot: 'evening', title: 'Topical NSAID Gel (4 of 4) — optional if you did 3 today', time: '8:30 PM', icon: 'pill' },
  ],
  nsaid: [
    { id: 'nsaid_1', slot: 'morning', title: 'Oral NSAID (1 of 2) — with food, as prescribed', detail: PAIN_GATE_DETAIL, time: '7:30 AM', icon: 'pill' },
    { id: 'nsaid_2', slot: 'evening', title: 'Oral NSAID (2 of 2) — with food, as prescribed', detail: PAIN_GATE_DETAIL, time: '7:30 PM', icon: 'pill' },
  ],
  steroid: [
    {
      id: 'steroid_dose',
      slot: 'waking',
      title: 'Steroid taper — today’s dose, exactly as prescribed',
      detail: 'Your physician set the dose and the step-down. Do not stop or change it on your own.',
      time: '6:30 AM (Upon Waking)',
      icon: 'pill',
    },
  ],
  none: [],
};

const STRETCH_DETAIL =
  'While elevated: strap around the ball of your foot, knee mostly straight, pull gently until you feel a mild pull in your calf — never a sharp pain or pressure at the back of the heel. Hold 30 seconds, rest 15, repeat 3 to 5 times. Use the stretch timer in the plan.';
const MASSAGE_DETAIL =
  'Gentle upward strokes along both sides of the heel bone, flanking the tendon — broad finger pads or flat palms, a dab of lotion to glide. Never grind directly over the bony bump in the center.';

export function buildTasks(protocolId, bootMode = false) {
  const medTasks = MED_TASKS[protocolId] || [];
  const tasks = [];
  const bySlot = (slot) => medTasks.filter((t) => t.slot === slot);

  tasks.push(...bySlot('waking'));

  tasks.push({
    id: 'session_1',
    title: 'Massage & Stretch — before your first steps',
    detail: `The most important session of the day: swelling pooled while you rested. First the massage, then the stretch, before your full weight hits the floor. ${MASSAGE_DETAIL} Then: ${STRETCH_DETAIL}`,
    time: '6:35 AM',
    icon: 'foot',
    stretch: true,
  });
  tasks.push({
    id: 'sleeve_morning',
    title: 'Put On Compression Sleeve',
    detail: 'Worn during the day, it keeps swelling from pooling around the back of the heel.',
    time: '7:00 AM',
    icon: 'activity',
  });
  if (bootMode) {
    tasks.push({
      id: 'boot_morning',
      title: 'Walking Boot On — heel lift inside the boot, EvenUp on the other shoe',
      detail: 'For severe, sharp, ripping pain with every step: immobilize, and balance the height difference so your back and hips stay level. Crutches or a knee scooter if the boot is too uncomfortable.',
      time: '7:15 AM',
      icon: 'shield',
    });
  } else {
    tasks.push({
      id: 'shoes_morning',
      title: 'Heel Lifts In Both Shoes + High-Drop Shoes On',
      detail: 'A firm 1/4-inch to 1/2-inch lift inside BOTH shoes, in a structured athletic shoe with a drop of 10mm or higher. No barefoot, no flat sneakers, no zero-drop shoes until pain improves. Soft heel counter or open back if the shoe rubs the bump.',
      time: '7:15 AM',
      icon: 'foot',
    });
  }

  tasks.push(...bySlot('morning'));

  tasks.push({
    id: 'session_2',
    title: 'Elevate, Massage & Stretch (2 of 3)',
    detail: `Foot up on pillows, above heart level — let gravity help drain the heel. ${MASSAGE_DETAIL} Then: ${STRETCH_DETAIL}`,
    time: '12:00 PM',
    icon: 'foot',
    stretch: true,
  });
  tasks.push(...bySlot('midday'));
  tasks.push({
    id: 'session_3',
    title: 'Elevate, Massage & Stretch (3 of 3)',
    detail: `Same routine: elevate first, massage the fluid up and out, then the gentle strap stretch. A soft foam roller or a cut pool noodle works well for sweeping fluid up through the calf. ${STRETCH_DETAIL}`,
    time: '4:00 PM',
    icon: 'foot',
    stretch: true,
  });
  tasks.push(...bySlot('afternoon'));
  tasks.push(...bySlot('evening'));
  tasks.push({
    id: 'night_routine',
    title: 'Elevate in Bed — night splint only if it helps your mornings',
    detail: 'Prop the foot up on a pillow. A night splint holds the ankle bent up and can load the very insertion you are trying to unload — use one only if morning stiffness is high and it does not make first-step pain worse. The compression sleeve is the gentler overnight option.',
    time: '9:30 PM',
    icon: 'activity',
  });

  return tasks;
}

export const PHASES = [
  {
    id: 'acute',
    label: 'Weeks 0–2 · Acute Offloading',
    days: 'Days 1–14',
    text: 'Take tension off the tendon: heel lifts in every shoe, high-drop shoes, swelling drainage and massage, gentle strap motion, compression sleeve. The two-week checkpoint lives here: some improvement — even mild — should show by about day 14.',
  },
  {
    id: 'consolidation',
    label: 'Weeks 2–6 · Flat-Ground Consolidation',
    days: 'Days 15–42',
    text: 'Keep walking on flat ground with the heel lifts in place. Meaningful settling usually takes four to six weeks. Better is not finished — calmer inflammation means the fire is out, not that the tendon has rebuilt.',
  },
  {
    id: 'rehab',
    label: 'Weeks 6+ · Rehab & Loading',
    days: 'Day 43 onward',
    text: 'Rebuild load gradually: hills once a week to start, with one to two recovery days after a hill walk. Structured physical therapy once a week for six weeks, slow loading on flat ground — lowering only to the floor, never heel drops below floor level, which compress the insertion. Drop any exercise that flares you.',
  },
];

export function phaseForDay(dayNumber) {
  if (dayNumber <= 14) return 0;
  if (dayNumber <= 42) return 1;
  return 2;
}

export const RED_FLAGS = [
  'A sudden pop or snap at the back of the heel, or you cannot push off or rise on your toes — get urgent care; that can be a tendon rupture',
  'No improvement at all after two weeks on the plan, or pain that is getting worse — check back in; do not wait for the six-week mark',
  'Pain that started with a fall, twist, or other injury — or you cannot bear weight',
  'Redness, warmth, or fever along with the heel pain',
  'Numbness, tingling, or burning that is new or getting worse',
  'Swelling that keeps increasing instead of settling down',
  'Diabetes or poor circulation — get checked before treating a sore foot on your own',
];

export const MED_RULES = [
  {
    title: 'The Partial Response Rule',
    text: 'If an NSAID helps, but does not relieve enough pain, switching to a different member of the same class (for example from ibuprofen to naproxen, or to a prescription alternative like meloxicam) can give significantly better relief — people metabolize these drugs differently.',
  },
  {
    title: 'The Zero Response Rule',
    text: 'If one NSAID gives you zero relief, switching to another NSAID will almost certainly fail as well. That signals the need for a different anti-inflammatory class — or that the pain is driven mainly by mechanical tension, not chemical inflammation.',
  },
  {
    title: 'The 6-Day Dose Pack Pitfall',
    text: 'A standard 6-day pre-packaged steroid taper is frequently too short for stubborn heel-bone (calcaneal) marrow edema. People often begin to feel real relief around day 5 or 6 — exactly when the pack runs out — and rebound. Deep bony inflammation needs a dose high enough to quiet the cycle before stepping down, set by your physician.',
  },
];

export const INJECTION_RULE =
  'Cortisone injections directly into or around the Achilles tendon are strictly avoided. They carry a severe risk of tendon weakening and catastrophic rupture. If an injection is suggested for pain at the back of the heel, ask exactly where it would go — and get a second opinion if the answer is in or around the tendon.';

export const MED_SAFETY =
  'Anti-inflammatory medicines (NSAIDs like ibuprofen and naproxen) can irritate the stomach and stress the kidneys. Take them with food, do not combine two NSAIDs at once, and check with your doctor or pharmacist first if you take blood thinners, have kidney disease or stomach ulcers, are pregnant, or take blood-pressure medication. Topical gel treats the tissue locally and is gentler on the stomach. Oral steroids are prescription-only, short-course, and supervised — follow your physician’s taper exactly.';

export const DISCLAIMER =
  'Education only. This app reflects how Dr. John Lord, DPM approaches Achilles insertional tendonosis care in his practice. It is not medical advice for you personally, and it does not replace your own clinician — talk with them about what is right for you.';
