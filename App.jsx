import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TEACHER_WHATSAPP = "919933566106";
const TEACHER_NAME = "Algama Masud";
const INSTITUTE_NAME = "AGM Physics";

// ─── Utility helpers ──────────────────────────────────────────────────────────
const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const randomId = () => Math.random().toString(36).slice(2, 9);

// ─── Sample seed data ─────────────────────────────────────────────────────────
const SEED_EXAMS = [
  {
    id: "exam1",
    title: "Electrostatics – Chapter 1",
    class: "Class 12",
    duration: 30,
    createdAt: Date.now() - 3600000,
    status: "active",
    perQMarks: 4,
    negativeMarking: true,
    negativePenalty: 1,
    questions: [
      {
        id: "q1", text: "Electric field lines originate from?",
        options: ["Negative charge", "Positive charge", "Neutral body", "All of the above"],
        correct: 1
      },
      {
        id: "q2", text: "SI unit of electric potential is?",
        options: ["Joule", "Newton", "Volt", "Coulomb"],
        correct: 2
      },
      {
        id: "q3", text: "Coulomb's law gives force between:",
        options: ["Moving charges only", "Point charges", "Large conductors", "Magnetic poles"],
        correct: 1
      },
      {
        id: "q4", text: "Dielectric constant of vacuum is:",
        options: ["0", "∞", "1", "8.85 × 10⁻¹²"],
        correct: 2
      },
    ]
  }
];

const ANNOUNCEMENTS = [
  { id: "a1", text: "📌 Unit Test on Magnetism scheduled for next Saturday.", date: "May 18, 2026" },
  { id: "a2", text: "📚 Chapter 2 notes uploaded in Resources section.", date: "May 15, 2026" },
  { id: "a3", text: "🏆 Congratulations to top scorers of April batch!", date: "May 10, 2026" },
];

const SCHEDULE = [
  { day: "Monday", time: "5:00 PM – 6:30 PM", topic: "Class 11 – Mechanics" },
  { day: "Wednesday", time: "5:00 PM – 6:30 PM", topic: "Class 12 – Electrostatics" },
  { day: "Friday", time: "4:00 PM – 6:00 PM", topic: "Doubt Clearing Session" },
  { day: "Saturday", time: "10:00 AM – 12:00 PM", topic: "Weekly Test (All Batches)" },
];

const RESOURCES = [
  { id: "r1", title: "Electrostatics – Complete Notes", class: "Class 12", type: "PDF", date: "May 15" },
  { id: "r2", title: "Mechanics – Formula Sheet", class: "Class 11", type: "PDF", date: "May 8" },
  { id: "r3", title: "Previous Year Questions – 2025", class: "Class 12", type: "PDF", date: "Apr 30" },
  { id: "r4", title: "Wave Optics – Mind Map", class: "Class 12", type: "Image", date: "Apr 22" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0c10;
  --surface: #111318;
  --surface2: #181c24;
  --border: #232736;
  --accent: #f5c518;
  --accent2: #3b82f6;
  --accent3: #10b981;
  --danger: #ef4444;
  --text: #e8eaf0;
  --muted: #6b7280;
  --card-glow: 0 0 0 1px #232736, 0 4px 24px rgba(0,0,0,.5);
}

body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

/* NAV */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,12,16,.92); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 60px;
}
.nav-brand { font-family: 'Bebas Neue'; font-size: 1.6rem; letter-spacing: 2px; color: var(--accent); cursor: pointer; }
.nav-tabs { display: flex; gap: 4px; }
.nav-tab {
  padding: 6px 14px; border-radius: 6px; font-size: .82rem; font-weight: 500;
  cursor: pointer; border: none; background: transparent; color: var(--muted);
  transition: all .2s;
}
.nav-tab:hover { color: var(--text); background: var(--surface2); }
.nav-tab.active { color: var(--accent); background: rgba(245,197,24,.1); }

/* HERO */
.hero {
  background: linear-gradient(135deg, #0d1117 0%, #0a0e1a 50%, #0d1117 100%);
  padding: 72px 24px 56px;
  text-align: center;
  position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,197,24,.08) 0%, transparent 70%);
  pointer-events: none;
}
.hero-badge {
  display: inline-block; padding: 4px 14px; border-radius: 999px;
  background: rgba(245,197,24,.12); border: 1px solid rgba(245,197,24,.3);
  color: var(--accent); font-size: .78rem; font-weight: 600; letter-spacing: 1.5px;
  text-transform: uppercase; margin-bottom: 20px;
}
.hero h1 {
  font-family: 'Bebas Neue'; font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: 4px; line-height: 1;
  background: linear-gradient(90deg, #fff 0%, var(--accent) 60%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}
.hero-sub { color: var(--muted); font-size: 1.05rem; margin-bottom: 32px; }
.hero-stats { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; }
.stat { text-align: center; }
.stat-num { font-family: 'Bebas Neue'; font-size: 2.2rem; color: var(--accent); letter-spacing: 2px; }
.stat-label { font-size: .75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

/* CARDS */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px;
  box-shadow: var(--card-glow);
  transition: border-color .2s, transform .2s;
}
.card:hover { border-color: #2d3348; transform: translateY(-2px); }

/* GRID */
.grid2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.grid3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }

/* PAGE */
.page { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
.section-header { margin-bottom: 24px; }
.section-title { font-family: 'Bebas Neue'; font-size: 2rem; letter-spacing: 2px; color: var(--text); }
.section-sub { color: var(--muted); font-size: .88rem; margin-top: 4px; }

/* BUTTONS */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 8px; font-weight: 600;
  font-size: .88rem; cursor: pointer; border: none; transition: all .2s;
  font-family: 'DM Sans';
}
.btn-primary { background: var(--accent); color: #000; }
.btn-primary:hover { background: #e6b800; box-shadow: 0 0 16px rgba(245,197,24,.3); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: #dc2626; }
.btn-green { background: var(--accent3); color: #fff; }
.btn-green:hover { background: #059669; }
.btn-whatsapp { background: #25d366; color: #fff; }
.btn-whatsapp:hover { background: #1ebe5d; box-shadow: 0 0 16px rgba(37,211,102,.4); }
.btn-sm { padding: 6px 14px; font-size: .8rem; }
.btn:disabled { opacity: .5; cursor: not-allowed; }

/* TAGS */
.tag {
  display: inline-block; padding: 2px 10px; border-radius: 999px;
  font-size: .72rem; font-weight: 600; letter-spacing: .5px;
}
.tag-green { background: rgba(16,185,129,.15); color: var(--accent3); border: 1px solid rgba(16,185,129,.3); }
.tag-yellow { background: rgba(245,197,24,.12); color: var(--accent); border: 1px solid rgba(245,197,24,.3); }
.tag-blue { background: rgba(59,130,246,.15); color: var(--accent2); border: 1px solid rgba(59,130,246,.3); }
.tag-red { background: rgba(239,68,68,.15); color: var(--danger); border: 1px solid rgba(239,68,68,.3); }

/* EXAM CARD */
.exam-card { cursor: pointer; }
.exam-card-title { font-size: 1.05rem; font-weight: 600; margin-bottom: 8px; }
.exam-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 12px; }
.exam-meta span { font-size: .8rem; color: var(--muted); }

/* FORM */
.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: .82rem; font-weight: 600; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .8px; }
.form-input, .form-select, .form-textarea {
  width: 100%; background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; padding: 10px 14px; color: var(--text);
  font-family: 'DM Sans'; font-size: .9rem; transition: border-color .2s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none; border-color: var(--accent);
}
.form-textarea { resize: vertical; min-height: 80px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

/* UPLOAD BOX */
.upload-box {
  border: 2px dashed var(--border); border-radius: 12px;
  padding: 32px; text-align: center; cursor: pointer;
  transition: all .2s; position: relative;
}
.upload-box:hover { border-color: var(--accent); background: rgba(245,197,24,.04); }
.upload-icon { font-size: 2.5rem; margin-bottom: 8px; }
.upload-text { color: var(--muted); font-size: .88rem; }

/* TIMER */
.timer-ring { font-family: 'JetBrains Mono'; font-size: 1.8rem; font-weight: 600; color: var(--accent); }
.timer-danger { color: var(--danger); animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }

/* MCQ */
.mcq-option {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; transition: all .2s; margin-bottom: 8px;
  font-size: .92rem;
}
.mcq-option:hover { border-color: var(--accent2); }
.mcq-option.selected { border-color: var(--accent2); background: rgba(59,130,246,.12); }
.mcq-option.correct { border-color: var(--accent3); background: rgba(16,185,129,.12); }
.mcq-option.wrong { border-color: var(--danger); background: rgba(239,68,68,.1); }
.mcq-letter {
  width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: .78rem; font-weight: 700; font-family: 'JetBrains Mono'; flex-shrink: 0;
}
.mcq-option.selected .mcq-letter { background: var(--accent2); border-color: var(--accent2); color: #fff; }
.mcq-option.correct .mcq-letter { background: var(--accent3); border-color: var(--accent3); color: #fff; }
.mcq-option.wrong .mcq-letter { background: var(--danger); border-color: var(--danger); color: #fff; }

/* PROGRESS BAR */
.progress-bar { height: 6px; background: var(--surface2); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent2), var(--accent)); border-radius: 999px; transition: width .3s; }

/* ANALYSIS */
.analysis-score-big {
  font-family: 'Bebas Neue'; font-size: 5rem; letter-spacing: 4px;
  background: linear-gradient(90deg, var(--accent), #fff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  line-height: 1;
}
.analysis-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin: 20px 0; }
.analysis-stat { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; text-align: center; }
.analysis-stat-num { font-family: 'Bebas Neue'; font-size: 2rem; }
.analysis-stat-label { font-size: .72rem; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }

/* QUESTION NAV */
.q-nav { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.q-nav-btn {
  width: 34px; height: 34px; border-radius: 6px; border: 1px solid var(--border);
  font-size: .8rem; font-weight: 600; cursor: pointer; transition: all .15s;
  background: var(--surface2); color: var(--muted); font-family: 'JetBrains Mono';
}
.q-nav-btn.answered { background: rgba(59,130,246,.2); border-color: var(--accent2); color: var(--accent2); }
.q-nav-btn.current { border-color: var(--accent); color: var(--accent); }

/* SCHEDULE TABLE */
.schedule-table { width: 100%; border-collapse: collapse; }
.schedule-table th, .schedule-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: .88rem; }
.schedule-table th { color: var(--muted); font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; }
.schedule-table tr:hover td { background: var(--surface2); }

/* LEADERBOARD */
.lb-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; margin-bottom: 6px; background: var(--surface2); border: 1px solid var(--border); }
.lb-rank { font-family: 'Bebas Neue'; font-size: 1.4rem; width: 36px; text-align: center; color: var(--muted); }
.lb-rank.gold { color: #f5c518; }
.lb-rank.silver { color: #9ca3af; }
.lb-rank.bronze { color: #b45309; }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.8); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 16px;
}
.modal {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 28px; width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto;
}
.modal-title { font-family: 'Bebas Neue'; font-size: 1.8rem; letter-spacing: 2px; margin-bottom: 20px; }

/* AI LOADING */
.ai-loading {
  display: flex; align-items: center; gap: 10px; padding: 16px;
  background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.2);
  border-radius: 10px; color: var(--accent2); font-size: .88rem;
}
.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(59,130,246,.3);
  border-top-color: var(--accent2); border-radius: 50%;
  animation: spin .7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* STUDENT REGISTER */
.register-card { max-width: 400px; margin: 80px auto; }

/* DIVIDER */
.divider { height: 1px; background: var(--border); margin: 24px 0; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--surface); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ALERT */
.alert { padding: 12px 16px; border-radius: 8px; font-size: .88rem; margin-bottom: 16px; }
.alert-info { background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.25); color: #93c5fd; }
.alert-success { background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.25); color: #6ee7b7; }
.alert-warn { background: rgba(245,197,24,.1); border: 1px solid rgba(245,197,24,.25); color: var(--accent); }

/* RESPONSIVE */
@media (max-width: 600px) {
  .form-row, .form-row-3 { grid-template-columns: 1fr; }
  .nav-tabs { display: none; }
  .hero h1 { font-size: 3rem; }
}
`;

// ─── Components ───────────────────────────────────────────────────────────────

function Nav({ tab, setTab, role }) {
  const tabs = role === "teacher"
    ? [
        { id: "home", label: "Home" },
        { id: "create-exam", label: "Create Test" },
        { id: "resources", label: "Resources" },
        { id: "schedule", label: "Schedule" },
        { id: "announcements", label: "Announcements" },
        { id: "leaderboard", label: "Leaderboard" },
      ]
    : [
        { id: "home", label: "Home" },
        { id: "exams", label: "Active Tests" },
        { id: "resources", label: "Resources" },
        { id: "schedule", label: "Schedule" },
        { id: "announcements", label: "Announcements" },
        { id: "leaderboard", label: "Leaderboard" },
      ];

  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setTab("home")}>AGM PHYSICS</div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Hero({ setTab, role }) {
  return (
    <div className="hero">
      <div className="hero-badge">Physics Excellence Since 2015</div>
      <h1>{INSTITUTE_NAME}</h1>
      <p className="hero-sub">
        Master Physics with <strong style={{ color: "var(--text)" }}>{TEACHER_NAME} Sir</strong> — Concepts, Tests & Results
      </p>
      <div className="hero-stats">
        <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Students</div></div>
        <div className="stat"><div className="stat-num">12</div><div className="stat-label">Years Teaching</div></div>
        <div className="stat"><div className="stat-num">98%</div><div className="stat-label">Success Rate</div></div>
        <div className="stat"><div className="stat-num">200+</div><div className="stat-label">Tests Conducted</div></div>
      </div>
      <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {role === "student" && (
          <button className="btn btn-primary" onClick={() => setTab("exams")}>📝 View Active Tests</button>
        )}
        <button className="btn btn-secondary" onClick={() => setTab("schedule")}>📅 Class Schedule</button>
        <a className="btn btn-whatsapp" href={`https://wa.me/${TEACHER_WHATSAPP}`} target="_blank" rel="noreferrer">
          💬 WhatsApp Sir
        </a>
      </div>
    </div>
  );
}

// ─── Teacher: Create Exam ────────────────────────────────────────────────────
function CreateExam({ exams, setExams }) {
  const [step, setStep] = useState(1); // 1=settings, 2=questions, 3=done
  const [settings, setSettings] = useState({
    title: "", class: "Class 11", duration: 30,
    perQMarks: 4, negativeMarking: false, negativePenalty: 1
  });
  const [questions, setQuestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [createdExam, setCreatedExam] = useState(null);
  const fileRef = useRef();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setImagePreview(ev.target.result);
      setAiLoading(true);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: file.type || "image/jpeg", data: base64 } },
                { type: "text", text: `Extract all MCQ questions from this image. Return ONLY a JSON array like:
[{"text":"Question text","options":["A","B","C","D"],"correct":0}]
where correct is the 0-based index of the correct option. If you cannot determine the correct answer, put 0. Return ONLY the JSON array, nothing else.` }
              ]
            }]
          })
        });
        const data = await res.json();
        const raw = data.content?.map(c => c.text || "").join("").trim();
        const clean = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        const withIds = parsed.map(q => ({ ...q, id: randomId() }));
        setQuestions(prev => [...prev, ...withIds]);
      } catch {
        // fallback: add a blank question
        setQuestions(prev => [...prev, { id: randomId(), text: "Question extracted (edit me)", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0 }]);
      }
      setAiLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const updateQuestion = (idx, field, val) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: val } : q));
  };
  const updateOption = (qIdx, oIdx, val) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...q.options]; opts[oIdx] = val;
      return { ...q, options: opts };
    }));
  };
  const addBlankQ = () => setQuestions(prev => [...prev, { id: randomId(), text: "", options: ["", "", "", ""], correct: 0 }]);
  const removeQ = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx));

  const publish = () => {
    const exam = {
      id: randomId(), ...settings, questions,
      createdAt: Date.now(), status: "active"
    };
    setExams(prev => [exam, ...prev]);
    setCreatedExam(exam);
    setStep(3);
  };

  if (step === 3) return (
    <div className="page">
      <div className="card" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
        <div style={{ fontFamily: "Bebas Neue", fontSize: "2rem", color: "var(--accent3)", letterSpacing: 2 }}>TEST PUBLISHED!</div>
        <p style={{ color: "var(--muted)", margin: "12px 0 24px" }}>
          "{createdExam.title}" is now live for {createdExam.class} students.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => { setStep(1); setSettings({ title: "", class: "Class 11", duration: 30, perQMarks: 4, negativeMarking: false, negativePenalty: 1 }); setQuestions([]); setImagePreview(null); }}>
            + Create Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">CREATE MCQ TEST</div>
        <div className="section-sub">Upload question images — AI extracts questions automatically</div>
      </div>

      {/* STEP INDICATOR */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28 }}>
        {[1, 2].map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: step >= s ? "var(--accent)" : "var(--surface2)",
              color: step >= s ? "#000" : "var(--muted)", fontSize: ".8rem", fontWeight: 700
            }}>{s}</div>
            <span style={{ fontSize: ".82rem", color: step === s ? "var(--text)" : "var(--muted)" }}>
              {s === 1 ? "Test Settings" : "Questions"}
            </span>
            {s < 2 && <span style={{ color: "var(--border)", margin: "0 4px" }}>›</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card" style={{ maxWidth: 620 }}>
          <div className="form-group">
            <label className="form-label">Test Title</label>
            <input className="form-input" placeholder="e.g. Electrostatics – Unit Test 1" value={settings.title}
              onChange={e => setSettings(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">For Class</label>
              <select className="form-select" value={settings.class} onChange={e => setSettings(p => ({ ...p, class: e.target.value }))}>
                {["Class 9", "Class 10", "Class 11", "Class 12", "JEE Mains", "NEET", "All Classes"].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input className="form-input" type="number" min={5} max={180} value={settings.duration}
                onChange={e => setSettings(p => ({ ...p, duration: +e.target.value }))} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Marks / Question</label>
              <input className="form-input" type="number" min={1} value={settings.perQMarks}
                onChange={e => setSettings(p => ({ ...p, perQMarks: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Negative Marking</label>
              <select className="form-select" value={settings.negativeMarking ? "yes" : "no"}
                onChange={e => setSettings(p => ({ ...p, negativeMarking: e.target.value === "yes" }))}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Marks Deducted</label>
              <input className="form-input" type="number" min={0} step={0.25}
                value={settings.negativePenalty} disabled={!settings.negativeMarking}
                onChange={e => setSettings(p => ({ ...p, negativePenalty: +e.target.value }))} />
            </div>
          </div>
          <div className="alert alert-info" style={{ marginTop: 4 }}>
            Full Marks = {settings.perQMarks} per question | {settings.negativeMarking ? `-${settings.negativePenalty} for wrong` : "No negative marking"}
          </div>
          <button className="btn btn-primary" disabled={!settings.title} onClick={() => setStep(2)}>
            Next: Add Questions →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left: Upload & AI */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: ".9rem" }}>📸 Upload Question Image</div>
              <div className="upload-box" onClick={() => fileRef.current.click()}>
                {imagePreview
                  ? <img src={imagePreview} alt="uploaded" style={{ width: "100%", borderRadius: 8, maxHeight: 220, objectFit: "contain" }} />
                  : <>
                    <div className="upload-icon">📄</div>
                    <div className="upload-text">Click to upload image of question paper<br /><small>AI will extract MCQs automatically</small></div>
                  </>}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              </div>
              {aiLoading && <div className="ai-loading" style={{ marginTop: 12 }}><div className="spinner" />AI is reading your question paper…</div>}
              {!aiLoading && questions.length > 0 && (
                <div className="alert alert-success" style={{ marginTop: 10 }}>✓ {questions.length} question(s) loaded</div>
              )}
            </div>
            <button className="btn btn-secondary" style={{ width: "100%" }} onClick={addBlankQ}>+ Add Question Manually</button>
          </div>

          {/* Right: Questions */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontWeight: 600 }}>{questions.length} Question(s)</span>
              {questions.length > 0 && (
                <button className="btn btn-primary btn-sm" onClick={publish}>Publish Test 🚀</button>
              )}
            </div>
            <div style={{ maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
              {questions.map((q, qi) => (
                <div key={q.id} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: ".75rem", color: "var(--accent)" }}>Q{qi + 1}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => removeQ(qi)}>✕</button>
                  </div>
                  <textarea className="form-textarea" style={{ marginBottom: 8, minHeight: 56, fontSize: ".85rem" }}
                    placeholder="Question text…" value={q.text}
                    onChange={e => updateQuestion(qi, "text", e.target.value)} />
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
                      <input type="radio" name={`correct-${qi}`} checked={q.correct === oi} onChange={() => updateQuestion(qi, "correct", oi)} />
                      <input className="form-input" style={{ padding: "6px 10px", fontSize: ".82rem" }}
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt}
                        onChange={e => updateOption(qi, oi, e.target.value)} />
                    </div>
                  ))}
                  <div style={{ fontSize: ".72rem", color: "var(--accent3)", marginTop: 4 }}>
                    ● Correct: Option {String.fromCharCode(65 + q.correct)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Student: Exam Board ─────────────────────────────────────────────────────
function ExamBoard({ exams, student, onStartExam }) {
  const active = exams.filter(e => e.status === "active");
  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">ACTIVE TESTS</div>
        <div className="section-sub">Hello {student.name} ({student.class}) — Click a test to begin</div>
      </div>
      {active.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📭</div>
          <div style={{ color: "var(--muted)" }}>No active tests right now. Check back soon!</div>
        </div>
      )}
      <div className="grid2">
        {active.map(exam => {
          const total = exam.questions.length * exam.perQMarks;
          return (
            <div key={exam.id} className="card exam-card" onClick={() => onStartExam(exam)}>
              <div style={{ display: "flex", justify: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <div className="exam-card-title">{exam.title}</div>
                <span className="tag tag-green">LIVE</span>
              </div>
              <div className="exam-meta">
                <span>🎓 {exam.class}</span>
                <span>⏱ {exam.duration} min</span>
                <span>❓ {exam.questions.length} Qs</span>
                <span>📊 {total} marks</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {exam.negativeMarking && <span className="tag tag-red">−{exam.negativePenalty} Negative</span>}
                <span className="tag tag-yellow">+{exam.perQMarks} per Q</span>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 16, width: "100%" }}>
                Start Test →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Student: Take Exam ──────────────────────────────────────────────────────
function TakeExam({ exam, student, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(t); handleSubmit(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    // compute score
    let correct = 0, wrong = 0, skipped = 0;
    exam.questions.forEach(q => {
      const a = answers[q.id];
      if (a === undefined) skipped++;
      else if (a === q.correct) correct++;
      else wrong++;
    });
    const score = correct * exam.perQMarks - (exam.negativeMarking ? wrong * exam.negativePenalty : 0);
    const total = exam.questions.length * exam.perQMarks;
    onComplete({ score, correct, wrong, skipped, total, answers, exam, student });
  }, [answers, submitted]);

  const q = exam.questions[current];
  const answered = Object.keys(answers).length;
  const timerDanger = timeLeft <= 60;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: "1.4rem", letterSpacing: 2 }}>{exam.title}</div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{exam.class} • {exam.questions.length} Questions • {exam.perQMarks} marks each</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className={`timer-ring ${timerDanger ? "timer-danger" : ""}`}>{formatTime(timeLeft)}</div>
          <button className="btn btn-danger btn-sm" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", color: "var(--muted)", marginBottom: 6 }}>
          <span>Answered {answered}/{exam.questions.length}</span>
          <span>Q{current + 1} of {exam.questions.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(answered / exam.questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Q Nav */}
      <div className="q-nav">
        {exam.questions.map((q, i) => (
          <button key={q.id}
            className={`q-nav-btn ${answers[q.id] !== undefined ? "answered" : ""} ${i === current ? "current" : ""}`}
            onClick={() => setCurrent(i)}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="card">
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
          <span style={{ fontFamily: "JetBrains Mono", color: "var(--accent)", fontWeight: 700, fontSize: ".9rem", whiteSpace: "nowrap" }}>Q{current + 1}.</span>
          <div style={{ fontSize: "1rem", lineHeight: 1.6 }}>{q.text || <span style={{ color: "var(--muted)" }}>[No question text]</span>}</div>
        </div>
        {q.options.map((opt, oi) => (
          <div key={oi}
            className={`mcq-option ${answers[q.id] === oi ? "selected" : ""}`}
            onClick={() => setAnswers(p => ({ ...p, [q.id]: oi }))}>
            <div className="mcq-letter">{String.fromCharCode(65 + oi)}</div>
            <span>{opt || `Option ${String.fromCharCode(65 + oi)}`}</span>
          </div>
        ))}
        {exam.negativeMarking && <div style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 10 }}>⚠ Negative marking: −{exam.negativePenalty} for wrong answer</div>}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button className="btn btn-secondary" disabled={current === 0} onClick={() => setCurrent(p => p - 1)}>← Prev</button>
        {current < exam.questions.length - 1
          ? <button className="btn btn-primary" onClick={() => setCurrent(p => p + 1)}>Next →</button>
          : <button className="btn btn-green" onClick={handleSubmit}>Submit Test ✓</button>}
      </div>
    </div>
  );
}

// ─── Analysis ────────────────────────────────────────────────────────────────
function Analysis({ result, onBack }) {
  const { score, correct, wrong, skipped, total, answers, exam, student } = result;
  const pct = Math.max(0, Math.round((score / total) * 100));

  const grade = pct >= 90 ? "A+" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 45 ? "C" : "D";
  const gradeColor = pct >= 75 ? "var(--accent3)" : pct >= 45 ? "var(--accent)" : "var(--danger)";

  const shareOnWhatsapp = () => {
    const msg = `📊 *AGM Physics – Test Result*\n\n👤 Name: ${student.name}\n🎓 Class: ${student.class}\n📝 Test: ${exam.title}\n\n✅ Correct: ${correct}\n❌ Wrong: ${wrong}\n⭕ Skipped: ${skipped}\n\n🏆 Score: ${score}/${total} (${pct}%)\n🎯 Grade: ${grade}\n\n_Sent from AGM Physics Portal_`;
    window.open(`https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="page">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Score Header */}
        <div className="card" style={{ textAlign: "center", marginBottom: 20, padding: 36 }}>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Your Score</div>
          <div className="analysis-score-big">{score}<span style={{ fontSize: "2.5rem", opacity: .5 }}>/{total}</span></div>
          <div style={{ fontSize: "3rem", fontFamily: "Bebas Neue", color: gradeColor, letterSpacing: 3, marginTop: 4 }}>Grade {grade}</div>
          <div className="progress-bar" style={{ height: 10, margin: "16px 0" }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: gradeColor }} />
          </div>
          <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>{pct}% | {exam.title}</div>
        </div>

        {/* Stats */}
        <div className="analysis-grid" style={{ marginBottom: 20 }}>
          <div className="analysis-stat">
            <div className="analysis-stat-num" style={{ color: "var(--accent3)" }}>{correct}</div>
            <div className="analysis-stat-label">Correct</div>
          </div>
          <div className="analysis-stat">
            <div className="analysis-stat-num" style={{ color: "var(--danger)" }}>{wrong}</div>
            <div className="analysis-stat-label">Wrong</div>
          </div>
          <div className="analysis-stat">
            <div className="analysis-stat-num" style={{ color: "var(--muted)" }}>{skipped}</div>
            <div className="analysis-stat-label">Skipped</div>
          </div>
          <div className="analysis-stat">
            <div className="analysis-stat-num" style={{ color: "var(--accent)" }}>+{correct * exam.perQMarks}</div>
            <div className="analysis-stat-label">Marks Earned</div>
          </div>
          {exam.negativeMarking && (
            <div className="analysis-stat">
              <div className="analysis-stat-num" style={{ color: "var(--danger)" }}>−{wrong * exam.negativePenalty}</div>
              <div className="analysis-stat-label">Deducted</div>
            </div>
          )}
          <div className="analysis-stat">
            <div className="analysis-stat-num" style={{ color: "var(--accent2)" }}>{exam.questions.length}</div>
            <div className="analysis-stat-label">Total Qs</div>
          </div>
        </div>

        {/* Question Review */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: "1.2rem", letterSpacing: 2, marginBottom: 16 }}>DETAILED REVIEW</div>
          {exam.questions.map((q, qi) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correct;
            const isSkipped = selected === undefined;
            return (
              <div key={q.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: qi < exam.questions.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "JetBrains Mono", color: "var(--accent)", fontWeight: 700, fontSize: ".85rem", flexShrink: 0 }}>Q{qi + 1}.</span>
                  <div style={{ fontSize: ".9rem", flex: 1 }}>{q.text}</div>
                  <span className={`tag ${isSkipped ? "tag-blue" : isCorrect ? "tag-green" : "tag-red"}`}>
                    {isSkipped ? "Skipped" : isCorrect ? `+${exam.perQMarks}` : exam.negativeMarking ? `−${exam.negativePenalty}` : "Wrong"}
                  </span>
                </div>
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`mcq-option ${oi === q.correct ? "correct" : (oi === selected && !isCorrect) ? "wrong" : ""}`}
                    style={{ cursor: "default", fontSize: ".85rem", padding: "8px 12px" }}>
                    <div className="mcq-letter">{String.fromCharCode(65 + oi)}</div>
                    {opt}
                    {oi === q.correct && <span style={{ marginLeft: "auto", color: "var(--accent3)", fontSize: ".75rem" }}>✓ Correct</span>}
                    {oi === selected && !isCorrect && <span style={{ marginLeft: "auto", color: "var(--danger)", fontSize: ".75rem" }}>✗ Your answer</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="card" style={{ background: "rgba(37,211,102,.05)", border: "1px solid rgba(37,211,102,.2)", textAlign: "center", padding: 28 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: "1.3rem", letterSpacing: 2, marginBottom: 8 }}>📤 SHARE WITH TEACHER</div>
          <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: 20 }}>
            Click below to send your marks to <strong style={{ color: "var(--text)" }}>{TEACHER_NAME} Sir</strong> via WhatsApp
          </p>
          <button className="btn btn-whatsapp" style={{ fontSize: "1rem", padding: "14px 32px" }} onClick={shareOnWhatsapp}>
            💬 Send Marks to Sir on WhatsApp
          </button>
          <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: 8 }}>This will open WhatsApp with your result pre-filled</div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button className="btn btn-secondary" onClick={onBack}>← Back to Tests</button>
        </div>
      </div>
    </div>
  );
}

// ─── Resources ───────────────────────────────────────────────────────────────
function Resources({ role }) {
  const [resources, setResources] = useState(RESOURCES);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", class: "Class 12", type: "PDF", link: "#" });

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div className="section-header" style={{ margin: 0 }}>
          <div className="section-title">STUDY RESOURCES</div>
          <div className="section-sub">Notes, formulas, and past papers uploaded by {TEACHER_NAME} Sir</div>
        </div>
        {role === "teacher" && <button className="btn btn-primary" onClick={() => setAdding(true)}>+ Upload</button>}
      </div>

      <div className="grid3">
        {resources.map(r => (
          <div key={r.id} className="card">
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>{r.type === "PDF" ? "📄" : "🖼"}</div>
            <div style={{ fontWeight: 600, fontSize: ".95rem", marginBottom: 6 }}>{r.title}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span className="tag tag-blue">{r.class}</span>
              <span className="tag tag-yellow">{r.type}</span>
            </div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 12 }}>📅 {r.date}</div>
            <button className="btn btn-secondary btn-sm" style={{ width: "100%" }}>Download</button>
          </div>
        ))}
      </div>

      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">UPLOAD RESOURCE</div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Class</label>
                <select className="form-select" value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}>
                  {["Class 9", "Class 10", "Class 11", "Class 12", "JEE", "NEET"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option>PDF</option><option>Image</option><option>Video</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={() => {
                setResources(p => [{ ...form, id: randomId(), date: "Today" }, ...p]);
                setAdding(false); setForm({ title: "", class: "Class 12", type: "PDF", link: "#" });
              }}>Upload</button>
              <button className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
function Schedule({ role }) {
  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">CLASS SCHEDULE</div>
        <div className="section-sub">Weekly timetable for all batches</div>
      </div>
      <div className="card">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Topic / Batch</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map(s => (
              <tr key={s.day}>
                <td><span className="tag tag-yellow">{s.day}</span></td>
                <td style={{ fontFamily: "JetBrains Mono", fontSize: ".82rem", color: "var(--accent2)" }}>{s.time}</td>
                <td>{s.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="alert alert-warn" style={{ marginTop: 16 }}>
        📞 For any schedule change, contact {TEACHER_NAME} Sir at <a href={`https://wa.me/${TEACHER_WHATSAPP}`} style={{ color: "var(--accent)" }} target="_blank">+91 99335 66106</a>
      </div>
    </div>
  );
}

// ─── Announcements ────────────────────────────────────────────────────────────
function Announcements({ role }) {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div className="section-header" style={{ margin: 0 }}>
          <div className="section-title">ANNOUNCEMENTS</div>
          <div className="section-sub">Important updates from {TEACHER_NAME} Sir</div>
        </div>
        {role === "teacher" && <button className="btn btn-primary" onClick={() => setAdding(true)}>+ Post</button>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {announcements.map(a => (
          <div key={a.id} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>📢</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: ".95rem", marginBottom: 6 }}>{a.text}</div>
              <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{a.date}</div>
            </div>
          </div>
        ))}
      </div>
      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">POST ANNOUNCEMENT</div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Type your announcement…" />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={() => {
                setAnnouncements(p => [{ id: randomId(), text, date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }, ...p]);
                setAdding(false); setText("");
              }}>Post</button>
              <button className="btn btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
const SAMPLE_LB = [
  { name: "Rahul Sharma", class: "Class 12", score: 95, tests: 8 },
  { name: "Priya Singh", class: "Class 12", score: 91, tests: 7 },
  { name: "Amit Kumar", class: "Class 11", score: 88, tests: 9 },
  { name: "Sneha Das", class: "Class 12", score: 85, tests: 6 },
  { name: "Rohan Gupta", class: "Class 11", score: 80, tests: 8 },
];

function Leaderboard() {
  const medals = ["🥇", "🥈", "🥉"];
  const rankClass = ["gold", "silver", "bronze"];
  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">LEADERBOARD</div>
        <div className="section-sub">Top performers across all tests</div>
      </div>
      <div style={{ maxWidth: 600 }}>
        {SAMPLE_LB.map((s, i) => (
          <div key={s.name} className="lb-row">
            <div className={`lb-rank ${rankClass[i] || ""}`}>{medals[i] || i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{s.class} · {s.tests} tests</div>
            </div>
            <div style={{ fontFamily: "Bebas Neue", fontSize: "1.4rem", color: "var(--accent)", letterSpacing: 1 }}>{s.score}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Student Registration ─────────────────────────────────────────────────────
function StudentRegister({ onRegister }) {
  const [name, setName] = useState("");
  const [cls, setCls] = useState("Class 12");
  return (
    <div className="page">
      <div className="register-card card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎓</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: "1.8rem", letterSpacing: 2 }}>STUDENT LOGIN</div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 4 }}>Enter your details to access tests</div>
        </div>
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input className="form-input" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Your Class</label>
          <select className="form-select" value={cls} onChange={e => setCls(e.target.value)}>
            {["Class 9", "Class 10", "Class 11", "Class 12", "JEE Dropper", "NEET"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={!name.trim()} onClick={() => onRegister({ name: name.trim(), class: cls })}>
          Enter Portal →
        </button>
      </div>
    </div>
  );
}

// ─── Teacher PIN ──────────────────────────────────────────────────────────────
function TeacherLogin({ onLogin, onBack }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="page">
      <div className="register-card card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🔐</div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: "1.8rem", letterSpacing: 2 }}>TEACHER LOGIN</div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 4 }}>Enter teacher PIN</div>
        </div>
        <div className="form-group">
          <label className="form-label">PIN</label>
          <input className="form-input" type="password" placeholder="••••" value={pin} onChange={e => { setPin(e.target.value); setErr(false); }} />
          {err && <div style={{ color: "var(--danger)", fontSize: ".8rem", marginTop: 4 }}>Incorrect PIN. Try: 1234</div>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (pin === "1234") onLogin(); else setErr(true); }}>Login</button>
          <button className="btn btn-secondary" onClick={onBack}>Back</button>
        </div>
        <div style={{ fontSize: ".72rem", color: "var(--muted)", textAlign: "center", marginTop: 12 }}>Demo PIN: 1234</div>
      </div>
    </div>
  );
}

// ─── Role Selector ─────────────────────────────────────────────────────────────
function RoleSelector({ onSelect }) {
  return (
    <div className="page">
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: "1.5rem", letterSpacing: 2, color: "var(--muted)", marginBottom: 24 }}>WHO ARE YOU?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card" style={{ cursor: "pointer", padding: 32, textAlign: "center" }} onClick={() => onSelect("student")}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎓</div>
            <div style={{ fontFamily: "Bebas Neue", fontSize: "1.4rem", letterSpacing: 2 }}>I'm a Student</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 6 }}>Take tests, view results</div>
          </div>
          <div className="card" style={{ cursor: "pointer", padding: 32, textAlign: "center" }} onClick={() => onSelect("teacher")}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>👨‍🏫</div>
            <div style={{ fontFamily: "Bebas Neue", fontSize: "1.4rem", letterSpacing: 2 }}>I'm the Teacher</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 6 }}>Create tests, manage content</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null); // null | "student" | "teacher" | "teacher-login"
  const [student, setStudent] = useState(null);
  const [tab, setTab] = useState("home");
  const [exams, setExams] = useState(SEED_EXAMS);
  const [activeExam, setActiveExam] = useState(null);
  const [result, setResult] = useState(null);

  const handleComplete = (res) => { setResult(res); setActiveExam(null); };

  return (
    <>
      <style>{CSS}</style>
      {role && role !== "teacher-login" && (
        <Nav tab={tab} setTab={(t) => { setActiveExam(null); setResult(null); setTab(t); }} role={role} />
      )}

      {/* Role selection */}
      {!role && <><style>{CSS}</style><div><Nav tab="home" setTab={() => {}} role="guest" /><RoleSelector onSelect={r => { if (r === "teacher") setRole("teacher-login"); else setRole("pending-student"); }} /></div></>}
      {role === "teacher-login" && <><Nav tab="home" setTab={() => {}} role="guest" /><TeacherLogin onLogin={() => setRole("teacher")} onBack={() => setRole(null)} /></>}
      {role === "pending-student" && <><Nav tab="home" setTab={() => {}} role="guest" /><StudentRegister onRegister={s => { setStudent(s); setRole("student"); }} /></>}

      {/* Teacher views */}
      {role === "teacher" && (
        <>
          {tab === "home" && <><Hero setTab={setTab} role="teacher" /><div className="page"><div className="alert alert-success">👋 Welcome back, {TEACHER_NAME} Sir! You have {exams.filter(e=>e.status==="active").length} active test(s).</div></div></>}
          {tab === "create-exam" && <CreateExam exams={exams} setExams={setExams} />}
          {tab === "resources" && <Resources role="teacher" />}
          {tab === "schedule" && <Schedule role="teacher" />}
          {tab === "announcements" && <Announcements role="teacher" />}
          {tab === "leaderboard" && <Leaderboard />}
        </>
      )}

      {/* Student views */}
      {role === "student" && (
        <>
          {!activeExam && !result && tab === "home" && <><Hero setTab={setTab} role="student" /></>}
          {!activeExam && !result && tab === "exams" && <ExamBoard exams={exams} student={student} onStartExam={e => setActiveExam(e)} />}
          {!activeExam && !result && tab === "resources" && <Resources role="student" />}
          {!activeExam && !result && tab === "schedule" && <Schedule role="student" />}
          {!activeExam && !result && tab === "announcements" && <Announcements role="student" />}
          {!activeExam && !result && tab === "leaderboard" && <Leaderboard />}
          {activeExam && <TakeExam exam={activeExam} student={student} onComplete={handleComplete} />}
          {result && <Analysis result={result} onBack={() => { setResult(null); setTab("exams"); }} />}
        </>
      )}
    </>
  );
}
to
