import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, Circle, Calendar, RotateCcw, Pill,
  Footprints, Activity, ChevronDown, ChevronUp, ShieldAlert,
  Sun, Moon, TrendingDown, Shield, Hand, Timer, Play, Pause
} from 'lucide-react';
import { PROTOCOLS, buildTasks, PHASES, phaseForDay, RED_FLAGS, MED_RULES, INJECTION_RULE, MED_SAFETY, DISCLAIMER } from './plan.js';

const ICONS = { pill: Pill, foot: Footprints, activity: Activity, shield: Shield };

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function PainPicker({ label, icon: Icon, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-orange-600" /> {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? null : n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold border transition ${
              value === n
                ? 'bg-orange-600 border-orange-600 text-white'
                : 'bg-white border-stone-200 text-stone-600 hover:border-orange-400'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// Guided stretch timer: hold 30s, rest 15s, 4 reps (guide range is 3–5).
function StretchTimer({ onDone }) {
  const REPS = 4;
  const [rep, setRep] = useState(1);
  const [phase, setPhase] = useState('hold'); // 'hold' | 'rest' | 'done'
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    timerRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => {
    if (!running || seconds > 0) return;
    if (phase === 'hold') {
      setPhase('rest');
      setSeconds(15);
    } else if (phase === 'rest') {
      if (rep >= REPS) {
        setPhase('done');
        setRunning(false);
        if (onDone) onDone();
      } else {
        setRep(rep + 1);
        setPhase('hold');
        setSeconds(30);
      }
    }
  }, [seconds, running, phase, rep, onDone]);

  const reset = () => {
    setRunning(false);
    setRep(1);
    setPhase('hold');
    setSeconds(30);
  };

  return (
    <div className="bg-gradient-to-br from-orange-600 to-amber-600 text-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
        <Timer className="w-4 h-4" /> Stretch Timer — strap stretch, elevated
      </p>
      <p className="text-[11px] text-orange-100 mt-1 leading-relaxed">
        Strap around the ball of your foot, knee mostly straight. Pull gently until you feel a mild
        pull in your calf — never sharp pain or pressure at the back of the heel. Ease off at once if you do.
      </p>
      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-3xl font-bold leading-none">
            {phase === 'done' ? 'Done' : `${seconds}s`}
          </p>
          <p className="text-xs text-orange-100 mt-1">
            {phase === 'done'
              ? `All ${REPS} reps complete — nice work.`
              : `${phase === 'hold' ? 'Hold the stretch' : 'Rest — release the strap'} · Rep ${rep} of ${REPS}`}
          </p>
        </div>
        <div className="flex gap-2">
          {phase !== 'done' && (
            <button
              type="button"
              onClick={() => setRunning(!running)}
              className="bg-white text-orange-700 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1"
            >
              {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {running ? 'Pause' : 'Start'}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="bg-orange-700/60 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
      <div className="flex gap-1 mt-3">
        {Array.from({ length: REPS }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < rep - 1 || phase === 'done' ? 'bg-white' : i === rep - 1 ? 'bg-white/70' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [expandedSection, setExpandedSection] = useState('protect');
  const [medProtocol, setMedProtocol] = useState(
    () => localStorage.getItem('achilles_med_protocol') || 'topical'
  );
  const [bootMode, setBootMode] = useState(() => localStorage.getItem('achilles_boot_mode') === '1');
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('achilles_tasks');
    const savedDate = localStorage.getItem('achilles_tasks_date');
    if (savedDate === new Date().toDateString() && saved) {
      return JSON.parse(saved);
    }
    return {};
  });
  const [history, setHistory] = useState(() => loadJSON('achilles_history', {}));

  const tasks = buildTasks(medProtocol, bootMode);
  const completedCount = tasks.filter((t) => completedTasks[t.id]).length;
  const todayEntry = history[dayKey()] || { am: null, pm: null, done: 0, total: tasks.length };

  useEffect(() => {
    localStorage.setItem('achilles_tasks', JSON.stringify(completedTasks));
    localStorage.setItem('achilles_tasks_date', new Date().toDateString());
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('achilles_med_protocol', medProtocol);
  }, [medProtocol]);

  useEffect(() => {
    localStorage.setItem('achilles_boot_mode', bootMode ? '1' : '0');
  }, [bootMode]);

  useEffect(() => {
    const key = dayKey();
    setHistory((prev) => {
      const prevEntry = prev[key] || { am: null, pm: null };
      const nextEntry = { ...prevEntry, done: completedCount, total: tasks.length };
      if (prevEntry.done === nextEntry.done && prevEntry.total === nextEntry.total && prevEntry.am !== undefined) {
        return prev;
      }
      const next = { ...prev, [key]: nextEntry };
      localStorage.setItem('achilles_history', JSON.stringify(next));
      if (!localStorage.getItem('achilles_start_date')) {
        localStorage.setItem('achilles_start_date', key);
      }
      return next;
    });
  }, [completedCount, tasks.length]);

  const setPain = (which, value) => {
    const key = dayKey();
    setHistory((prev) => {
      const entry = { ...(prev[key] || { am: null, pm: null, done: completedCount, total: tasks.length }) };
      entry[which] = value;
      const next = { ...prev, [key]: entry };
      localStorage.setItem('achilles_history', JSON.stringify(next));
      if (!localStorage.getItem('achilles_start_date')) {
        localStorage.setItem('achilles_start_date', key);
      }
      return next;
    });
  };

  const toggleTask = (id) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completeNextStretch = () => {
    const nextStretch = tasks.find((t) => t.stretch && !completedTasks[t.id]);
    if (nextStretch) {
      setCompletedTasks((prev) => ({ ...prev, [nextStretch.id]: true }));
    }
  };

  const resetDay = () => setCompletedTasks({});
  const activeProtocol = PROTOCOLS.find((p) => p.id === medProtocol) || PROTOCOLS[0];

  const startDate = localStorage.getItem('achilles_start_date');
  const dayNumber = startDate
    ? Math.max(1, Math.round((new Date(dayKey()) - new Date(startDate)) / 86400000) + 1)
    : 1;
  const recordedDays = Object.keys(history).filter(
    (k) => (history[k].done || 0) > 0 || history[k].am != null || history[k].pm != null
  ).length;
  const sortedKeys = Object.keys(history).sort();
  const amScores = sortedKeys.map((k) => history[k].am).filter((v) => v != null);
  let improvement = null;
  if (amScores.length >= 4) {
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const firstAvg = avg(amScores.slice(0, 3));
    const lastAvg = avg(amScores.slice(-3));
    if (firstAvg > 0) improvement = Math.round(((firstAvg - lastAvg) / firstAvg) * 100);
  }
  const recentKeys = [...sortedKeys].slice(-14).reverse();
  const currentPhase = phaseForDay(dayNumber);
  const pctDone = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const tabButton = (id, label) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-2 text-sm font-semibold rounded-lg transition ${
        activeTab === id ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'
      }`}
    >
      {label}
    </button>
  );

  const accordion = (id, title, icon, children) => (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
        className="w-full p-4 flex items-center justify-between bg-white text-left font-semibold text-stone-800 text-sm"
      >
        <span className="flex items-center gap-2">{icon} {title}</span>
        {expandedSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expandedSection === id && (
        <div className="p-4 border-t border-stone-100 text-xs text-stone-600 space-y-3 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-12">
      <header className="bg-white border-b border-stone-200 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 text-white p-2.5 rounded-xl shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 leading-tight">Achilles Care</h1>
              <p className="text-[11px] text-stone-500 font-semibold">Insertional Tendonosis — Daily Recovery Plan</p>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                <span className="text-orange-700 font-semibold">· Day {dayNumber}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="w-11 h-11 rounded-full border-4 border-orange-100 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-4 border-orange-600"
                  style={{ clipPath: `inset(${100 - pctDone}% 0 0 0)` }}
                />
                <span className="text-[11px] font-bold text-orange-700">{pctDone}%</span>
              </div>
              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">today</p>
            </div>
            <button
              onClick={resetDay}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition"
              title="Reset Daily Tasks"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
            <span>Today's Progress</span>
            <span className="text-orange-700">{completedCount} / {tasks.length} done</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-600 h-full transition-all duration-300"
              style={{ width: `${pctDone}%` }}
            />
          </div>
          <div className="grid grid-cols-3 p-1 bg-stone-100 rounded-xl gap-1">
            {tabButton('today', "Today's Plan")}
            {tabButton('progress', 'Progress')}
            {tabButton('guide', 'Care Guide')}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        {activeTab === 'today' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-stone-200 rounded-xl p-3 text-center shadow-sm">
                <Shield className="w-5 h-5 text-orange-600 mx-auto" />
                <p className="text-xs font-bold text-stone-800 mt-1">1 · Protect</p>
                <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Heel lifts, high-drop shoes, boot if severe</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-3 text-center shadow-sm">
                <Hand className="w-5 h-5 text-amber-600 mx-auto" />
                <p className="text-xs font-bold text-stone-800 mt-1">2 · Reduce</p>
                <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Elevate, massage, gentle stretch — by hand</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-3 text-center shadow-sm">
                <Pill className="w-5 h-5 text-rose-600 mx-auto" />
                <p className="text-xs font-bold text-stone-800 mt-1">3 · Control</p>
                <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Match the medication tier to the pain</p>
              </div>
            </div>

            <div className="bg-white border border-orange-200 rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">
                Your Inflammation Tier:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROTOCOLS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setMedProtocol(p.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition border ${
                      medProtocol === p.id
                        ? 'bg-orange-50 border-orange-500 text-orange-800'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-600 leading-relaxed">{activeProtocol.blurb}</p>
              <label className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bootMode}
                  onChange={(e) => setBootMode(e.target.checked)}
                  className="mt-0.5 accent-red-600"
                />
                <span className="text-xs text-red-900 leading-relaxed">
                  <strong>Boot mode:</strong> my pain is severe — sharp and ripping with every step — and I am
                  immobilizing in a walking boot. Turning this on rebuilds today's plan around the boot.
                </span>
              </label>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-4">
              <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">How does it feel today? (0 = none, 10 = worst)</p>
              <PainPicker label="First-step pain this morning" icon={Sun} value={todayEntry.am} onChange={(v) => setPain('am', v)} />
              <PainPicker label="Pain tonight" icon={Moon} value={todayEntry.pm} onChange={(v) => setPain('pm', v)} />
            </div>

            <StretchTimer onDone={completeNextStretch} />

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isDone = !!completedTasks[task.id];
                const IconComponent = ICONS[task.icon] || Footprints;
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer select-none ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-stone-400'
                        : 'bg-white border-stone-200 hover:border-orange-300 text-stone-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span>
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-6 h-6 text-stone-300" />
                        )}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${isDone ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {task.title}
                        </p>
                        {task.detail && !isDone && (
                          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{task.detail}</p>
                        )}
                        <p className="text-xs text-stone-500 mt-0.5">{task.time}</p>
                      </div>
                    </div>
                    <IconComponent className={`w-5 h-5 shrink-0 ${isDone ? 'text-stone-300' : 'text-orange-600'}`} />
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed px-1">{DISCLAIMER}</p>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="bg-orange-700 text-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2">
                <TrendingDown className="w-5 h-5" /> Are you getting better?
              </h2>
              <p className="text-xs text-orange-100 mt-2 leading-relaxed">
                You are on <strong>day {dayNumber}</strong> of the plan, with {recordedDays} day{recordedDays === 1 ? '' : 's'} recorded.
                Morning first-step pain is the number that matters most — swelling that pooled overnight gets forced
                through the tissue on that first step, so it is the clearest daily signal.
              </p>
              {improvement != null && (
                <p className="text-sm font-bold mt-3">Your morning pain is down {improvement}% from your first days.</p>
              )}
              <p className="text-xs text-orange-100 mt-2 leading-relaxed">
                <strong>The two-week checkpoint:</strong> you should notice some improvement within about two weeks,
                even if it is mild — first steps a little less sharp, less time to loosen up. Meaningful settling
                usually takes <strong>four to six weeks</strong>. If there is no improvement at all by two weeks, or
                the pain is getting worse, check back in sooner — do not wait for the six-week mark.
              </p>
            </div>

            <div className="space-y-2">
              {PHASES.map((phase, i) => (
                <div
                  key={phase.id}
                  className={`rounded-xl border p-4 shadow-sm ${
                    i === currentPhase
                      ? 'bg-orange-50 border-orange-400'
                      : i < currentPhase
                        ? 'bg-white border-stone-200 opacity-70'
                        : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-stone-800">{phase.label}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      i === currentPhase ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {i === currentPhase ? 'YOU ARE HERE' : phase.days}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{phase.text}</p>
                </div>
              ))}
            </div>

            {recentKeys.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-5 text-sm text-stone-600 shadow-sm">
                Nothing recorded yet. Check off tasks and score your pain on the Today's Plan tab and your
                history will build here, day by day.
              </div>
            ) : (
              <div className="space-y-2">
                {recentKeys.map((key) => {
                  const e = history[key];
                  const pct = e.total ? Math.round(((e.done || 0) / e.total) * 100) : 0;
                  const label = new Date(`${key}T12:00:00`).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  });
                  return (
                    <div key={key} className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{label}</p>
                        <p className="text-xs text-stone-500 mt-0.5">Plan done: {e.done || 0}/{e.total || 0} ({pct}%)</p>
                      </div>
                      <div className="flex gap-2 text-xs font-bold">
                        <span className={`px-2 py-1 rounded-lg ${e.am != null ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-stone-50 text-stone-300 border border-stone-100'}`}>
                          AM {e.am != null ? e.am : '–'}
                        </span>
                        <span className={`px-2 py-1 rounded-lg ${e.pm != null ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-stone-50 text-stone-300 border border-stone-100'}`}>
                          PM {e.pm != null ? e.pm : '–'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-[11px] text-stone-400 leading-relaxed px-1">{DISCLAIMER}</p>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4">
            <div className="bg-orange-700 text-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" /> Protect It. Drain It. Stop Feeding It.
              </h2>
              <p className="text-xs text-orange-100 mt-2 leading-relaxed">
                The tendon is pulling away from the heel bone in tiny micro-separations, and the bone answers
                with inflammation and swelling. There is very little room at the back of the heel, so even a
                small amount of swelling creates intense pressure. Every part of this plan does one of three
                jobs: protect the attachment, move the swelling out by hand, and keep your body from making more.
              </p>
            </div>

            <div className="space-y-3">
              {accordion('protect', '1. Protect the Injured Tissues', <Shield className="w-4 h-4 text-orange-600" />, (
                <>
                  <p><strong>Bilateral heel lifts:</strong> a firm 1/4-inch to 1/2-inch lift inside <strong>both</strong> shoes — choose the height that feels most comfortable. Raising the heel takes mechanical tension off the tendon where it meets the bone.</p>
                  <p><strong>High-drop shoes:</strong> a structured athletic shoe with a traditional drop of 10mm or higher. Until pain improves, avoid walking barefoot and wearing flat sneakers or zero-drop shoes.</p>
                  <p><strong>Kill the friction:</strong> choose a soft heel counter or an open back (a wedge mule or slide) so the shoe stops rubbing the inflamed bone and bursa. In closed-back shoes, put adhesive padding on <strong>each side</strong> of the heel bone inside the shoe, leaving a gap in the center over the painful bump, so the counter floats off the sore spot.</p>
                  <p><strong>Walking boot — for severe pain:</strong> if you have severe, sharp, ripping pain with every step, immobilize in a rigid walking boot, with the heel lift inside it and an EvenUp on the other shoe to stay level. Crutches or a knee scooter if the boot is too uncomfortable. Turn on Boot mode on the Today's Plan tab and the plan rebuilds around the boot.</p>
                  <p><strong>Compression sleeve:</strong> wear it during the day to keep swelling from pooling around the back of the heel.</p>
                </>
              ))}

              {accordion('reduce', '2. Reduce the Swelling — By Hand', <Hand className="w-4 h-4 text-amber-600" />, (
                <>
                  <p><strong>Timing is everything:</strong> the best time to massage and stretch is immediately after resting and right before you stand up — starting with the session before your first steps in the morning. Swelling settles while you are still; move it before your full weight hits the floor and you prevent the sudden traction shock that causes first-step pain.</p>
                  <p><strong>Elevation:</strong> whenever you sit or lie down, prop your foot on pillows above heart level and let gravity pull stagnant swelling away from the back of the heel.</p>
                  <p><strong>Massage — squeeze the sponge:</strong> swelling pools in the soft gutters along both sides of the heel bone. Use gentle upward strokes along <strong>both sides</strong> of the heel bone, flanking the tendon, with broad finger pads or flat palms — do not dig your thumbs in. A dab of lotion helps your hands glide. A soft foam roller or a pool noodle cut to a foot works for sweeping fluid up through the calf. Always stroke upward, toward the knee. Keep discomfort to a mild, tolerable bruise sensation at most.</p>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900">
                    <strong>Caution at the center:</strong> take special care over the central back of the heel. Avoid aggressive, direct pressure or grinding over the painful bony bump and the tendon insertion itself.
                  </div>
                  <p><strong>Static stretch:</strong> reclined, leg propped up, loop a non-elastic belt, yoga strap, or folded towel around the <strong>ball</strong> of your foot (never around the toes). Knee mostly straight, pull gently toward your chest until you feel a mild, comfortable pull in your <strong>calf</strong> — not in the heel. If you feel burning or pressure at the back of the heel bone, ease off at once. Hold 30 seconds, release 15, repeat 3 to 5 times per session, 2 to 4 sessions a day while elevating, daily until your resting heel pain completely resolves. The stretch timer on the Today's Plan tab walks you through it.</p>
                  <p><strong>Gentle motion:</strong> with the same strap, pull the foot back no further than level with your shin, then point it down slowly — 3 to 5 seconds each direction, for 1 to 2 minutes. No snapping, no forcing. Finish each session with massage.</p>
                </>
              ))}

              {accordion('control', '3. Control the Inflammation', <Pill className="w-4 h-4 text-rose-600" />, (
                <>
                  <p>Match the strength of the medicine to the severity of the inflammation. If a light treatment is not touching the pain, escalate up the ladder — with your clinician.</p>
                  {PROTOCOLS.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-3 bg-stone-50 rounded-lg">
                      <strong className="text-stone-800">{p.label}:</strong> {p.blurb}
                    </div>
                  ))}
                  {MED_RULES.map((rule) => (
                    <div key={rule.title} className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-950">
                      <strong>{rule.title}:</strong> {rule.text}
                    </div>
                  ))}
                  <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-900">
                    <strong>Absolute injection rule:</strong> {INJECTION_RULE}
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                    <strong>Medication safety:</strong> {MED_SAFETY}
                  </div>
                  <p><strong>Tier 4 — in-office procedures:</strong> if chronic damage refuses to heal with medication, procedures can restart repair: extracorporeal shock wave therapy (ESWT), which breaks down dense scar tissue and stimulates blood flow, and platelet-rich plasma (PRP) injections, using growth factors from your own blood. These are clinic decisions, not home treatments.</p>
                  <p><strong>Surgery:</strong> considered only when severe pain and functional limits persist after 6 to 12 months of structured conservative therapy — removing the bony prominence and inflamed bursa, cleaning up and re-anchoring the tendon, or related procedures your surgeon would discuss with you.</p>
                </>
              ))}

              {accordion('phases', 'The Recovery Timeline', <TrendingDown className="w-4 h-4 text-orange-600" />, (
                <>
                  {PHASES.map((phase) => (
                    <div key={phase.id} className="p-3 bg-stone-50 rounded-lg">
                      <strong className="text-stone-800">{phase.label} ({phase.days}):</strong> {phase.text}
                    </div>
                  ))}
                  <p><strong>The trap to avoid:</strong> feeling better is not the same as healed. Skipping straight from "the pain calmed down" back to full activity is the most common way this condition comes back. The tendon rebuilds on its own timeline, not on the timeline of your pain.</p>
                  <p><strong>House shoes count:</strong> flip-flops and bare feet at home load the tendon just like flat shoes outside. A wedge-style sandal or slide with the heel higher than the forefoot applies the same drop principle indoors.</p>
                </>
              ))}

              {accordion('redflags', 'When to Get Checked', <ShieldAlert className="w-4 h-4 text-red-600" />, (
                <>
                  <p>Insertional Achilles tendonosis is stubborn but usually heals with consistent care — get checked promptly if you have:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {RED_FLAGS.map((flag) => (
                      <li key={flag}>{flag}</li>
                    ))}
                  </ul>
                </>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed px-1">{DISCLAIMER}</p>
          </div>
        )}
      </main>
    </div>
  );
}
