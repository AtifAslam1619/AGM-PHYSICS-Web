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

  const updateQuestion = (idx, field, val) 
