import React, { useState, useEffect, useRef } from "react";
import {
  Home, PenTool, BookOpen, FileText, Calendar, BarChart3, Trophy,
  User, Settings, Search, Bell, Upload, CheckCircle2, XCircle,
  Flame, Star, Moon, Sun, ChevronRight, ArrowLeft, Sparkles,
  Clock, Target, TrendingUp, Loader2, ChevronLeft, Filter, Zap
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from "recharts";

/* ---------------------------------------------------------
   Design tokens
   Palette: ink (near-black indigo) / violet-blue gradient system
   Signature: the "marking ribbon" — a vertical graded stripe that
   runs down solution steps, coloring each step correct/wrong/partial,
   echoing how a real exam script gets annotated in the margin.
--------------------------------------------------------- */
const palette = {
  bgLight: "#F6F5FB",
  bgDark: "#0E0B1A",
  cardLight: "#FFFFFF",
  cardDark: "#17132A",
  borderLight: "#E7E4F3",
  borderDark: "#2A2444",
  textLight: "#1B1730",
  textDark: "#F1EFFB",
  subLight: "#726D8C",
  subDark: "#9A93BE",
  violet: "#6E56CF",
  indigo: "#4F5FE8",
  blue: "#3B82F6",
  green: "#16A34A",
  red: "#E23F3F",
  amber: "#E8A23B",
};

const grad = "bg-gradient-to-br from-[#6E56CF] via-[#5A5FE0] to-[#3B82F6]";

function useTheme() {
  const [dark, setDark] = useState(false);
  return { dark, setDark };
}

function cx(...a) {
  return a.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------
   Mock data
--------------------------------------------------------- */
const NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "marker", label: "AI Marker", icon: PenTool },
  { id: "practice", label: "Practice", icon: BookOpen },
  { id: "papers", label: "Past Papers", icon: FileText },
  { id: "planner", label: "Study Planner", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

const radarData = [
  { topic: "Algebra", You: 78, Average: 60 },
  { topic: "Calculus", You: 72, Average: 55 },
  { topic: "Trigonometry", You: 45, Average: 58 },
  { topic: "Sequences", You: 60, Average: 50 },
  { topic: "Vectors", You: 38, Average: 52 },
  { topic: "Statistics", You: 65, Average: 57 },
];

const topicPerf = [
  { topic: "Algebra", score: 78, color: palette.green },
  { topic: "Calculus", score: 72, color: palette.green },
  { topic: "Trigonometry", score: 45, color: palette.amber },
  { topic: "Vectors", score: 38, color: palette.red },
  { topic: "Statistics", score: 65, color: palette.green },
  { topic: "Sequences", score: 60, color: palette.amber },
];

const accuracyTrend = [
  { day: "Mon", acc: 58 }, { day: "Tue", acc: 63 }, { day: "Wed", acc: 60 },
  { day: "Thu", acc: 68 }, { day: "Fri", acc: 66 }, { day: "Sat", acc: 71 }, { day: "Sun", acc: 68 },
];

const weakest = [
  { topic: "Trigonometric Equations", pct: 32 },
  { topic: "Vectors", pct: 41 },
  { topic: "Differential Equations", pct: 45 },
];

const recentActivity = [
  { title: "AI Marked: 2021 P1 Q7", when: "2h ago", score: "8 / 15", ok: true },
  { title: "Completed: Differentiation Quiz", when: "5h ago", score: "12 / 15", ok: true },
  { title: "Practiced: Matrices (Mixed Set)", when: "Yesterday", score: "18 / 20", ok: true },
];

const plannerToday = [
  { id: 1, label: "Differentiation", time: "1.5h", done: false },
  { id: 2, label: "Binomial Theorem", time: "1h", done: true },
  { id: 3, label: "Past Paper: 2022 P1 Q5-10", time: "2h", done: false },
  { id: 4, label: "Trigonometric Equations", time: "1h", done: false },
];

const weekSchedule = {
  Mon: [{ t: "09:00", label: "Vectors", dur: "1h" }, { t: "16:00", label: "Practice Set", dur: "1.5h" }],
  Tue: [{ t: "09:00", label: "Differentiation", dur: "1.5h" }, { t: "10:30", label: "Binomial Theorem", dur: "1h" },
        { t: "12:00", label: "Break", dur: "30m", brk: true }, { t: "12:30", label: "Past Paper: 2022 P1 Q5-10", dur: "2h" },
        { t: "15:00", label: "Trigonometric Equations", dur: "1h" }],
  Wed: [{ t: "09:00", label: "Statistics", dur: "1h" }],
  Thu: [{ t: "09:00", label: "Calculus Review", dur: "1.5h" }],
  Fri: [{ t: "09:00", label: "Sequences & Series", dur: "1h" }],
  Sat: [{ t: "10:00", label: "Mock Exam", dur: "3h" }],
  Sun: [{ t: "—", label: "Rest day", dur: "", brk: true }],
};

const practiceQuestions = [
  { id: 1, topic: "Differentiation", difficulty: "Easy", q: "Differentiate f(x) = 4x³ − 2x + 9" },
  { id: 2, topic: "Binomial Theorem", difficulty: "Medium", q: "Find the coefficient of x⁵ in (2x − 1)⁸" },
  { id: 3, topic: "Trigonometry", difficulty: "Hard", q: "Solve 2sin²θ − 3cosθ = 0 for 0 ≤ θ ≤ 2π" },
  { id: 4, topic: "Vectors", difficulty: "Medium", q: "Find the angle between a = (2,1,-2) and b = (1,3,4)" },
  { id: 5, topic: "Sequences", difficulty: "Easy", q: "Find the sum of the first 20 terms of 3, 7, 11, 15…" },
  { id: 6, topic: "Calculus", difficulty: "Challenge", q: "Evaluate ∫ x²eˣ dx using integration by parts" },
];

const diffColor = {
  Easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Hard: "text-orange-600 bg-orange-50 border-orange-200",
  Challenge: "text-red-600 bg-red-50 border-red-200",
};

/* the canned "AI marked" result, matching the worked example in the brief */
const markedSteps = [
  { n: 1, verdict: "correct", text: "Differentiated 3x² correctly to 6x." },
  { n: 2, verdict: "wrong", text: "Derivative of 5x should be 5, not 7.", correction: "d/dx(5x) = 5" },
  { n: 3, verdict: "correct", text: "Derivative of the constant −7 is 0. Well done." },
];

/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */
function Card({ dark, className, children, style }) {
  return (
    <div
      className={cx(
        "rounded-2xl border shadow-sm",
        dark ? "bg-[#17132A] border-[#2A2444]" : "bg-white border-[#E7E4F3]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function SectionTitle({ dark, children, sub }) {
  return (
    <div className="mb-3">
      <h3 className={cx("text-[15px] font-semibold", dark ? "text-[#F1EFFB]" : "text-[#1B1730]")}>{children}</h3>
      {sub && <p className={cx("text-xs mt-0.5", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>{sub}</p>}
    </div>
  );
}

function VerdictIcon({ verdict, size = 16 }) {
  if (verdict === "correct") return <CheckCircle2 size={size} className="text-emerald-500 shrink-0" />;
  if (verdict === "wrong") return <XCircle size={size} className="text-red-500 shrink-0" />;
  return <CheckCircle2 size={size} className="text-amber-500 shrink-0" />;
}

/* ---------------------------------------------------------
   Sidebar
--------------------------------------------------------- */
function Sidebar({ dark, setDark, view, setView, collapsed, setCollapsed }) {
  return (
    <div
      className={cx(
        "h-full flex flex-col border-r shrink-0 transition-all duration-200",
        dark ? "bg-[#120E22] border-[#241F3D]" : "bg-[#150F2E] border-[#241F3D]",
        collapsed ? "w-[76px]" : "w-[248px]"
      )}
    >
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className={cx("w-8 h-8 rounded-xl grid place-items-center shrink-0", grad)}>
          <Sparkles size={16} className="text-white" />
        </div>
        {!collapsed && <span className="text-white font-semibold text-[15px] tracking-tight">MathMind AI</span>}
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = view === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors",
                active ? cx("text-white", grad) : "text-[#B3ADD1] hover:bg-white/5 hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[#241F3D] space-y-1">
        <button
          onClick={() => setView("profile")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-[#B3ADD1] hover:bg-white/5 hover:text-white"
        >
          <User size={17} className="shrink-0" />
          {!collapsed && <span>Profile</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-[#B3ADD1] hover:bg-white/5 hover:text-white">
          <Settings size={17} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        <div className={cx("flex items-center gap-2 px-3 pt-2", collapsed && "justify-center")}>
          {!collapsed && <span className="text-[12px] text-[#8B84AD] flex items-center gap-1.5"><Moon size={13} /> Dark mode</span>}
          <button
            onClick={() => setDark(!dark)}
            className={cx(
              "ml-auto w-9 h-5 rounded-full relative transition-colors shrink-0",
              dark ? "bg-[#6E56CF]" : "bg-[#38314F]"
            )}
          >
            <span
              className={cx(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                dark ? "left-[18px]" : "left-0.5"
              )}
            />
          </button>
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center h-8 mx-3 mb-3 rounded-lg text-[#8B84AD] hover:bg-white/5 hover:text-white"
      >
        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   Top bar
--------------------------------------------------------- */
function TopBar({ dark, title, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className={cx("text-[22px] font-bold tracking-tight", dark ? "text-white" : "text-[#1B1730]")}>{title}</h1>
        {subtitle && <p className={cx("text-[13px] mt-0.5", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className={cx("hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border w-64",
          dark ? "bg-[#17132A] border-[#2A2444]" : "bg-white border-[#E7E4F3]")}>
          <Search size={15} className={dark ? "text-[#9A93BE]" : "text-[#A6A1C2]"} />
          <input
            placeholder="Search topics, questions..."
            className={cx("bg-transparent outline-none text-[13px] w-full", dark ? "text-white placeholder:text-[#6D6690]" : "text-[#1B1730] placeholder:text-[#A6A1C2]")}
          />
        </div>
        <button className={cx("w-9 h-9 rounded-full border grid place-items-center relative",
          dark ? "bg-[#17132A] border-[#2A2444] text-[#C9C4E3]" : "bg-white border-[#E7E4F3] text-[#4E4A6B]")}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E23F3F]" />
        </button>
        <div className={cx("w-9 h-9 rounded-full grid place-items-center text-white text-sm font-semibold", grad)}>T</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Stat pill
--------------------------------------------------------- */
function StatCard({ dark, icon, label, value, sub, accent }) {
  return (
    <Card dark={dark} className="p-4 flex-1 min-w-[150px]">
      <div className="flex items-center gap-2 mb-2">
        <div className={cx("w-7 h-7 rounded-lg grid place-items-center", accent)}>{icon}</div>
        <span className={cx("text-[12.5px] font-medium", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>{label}</span>
      </div>
      <div className={cx("text-[22px] font-bold", dark ? "text-white" : "text-[#1B1730]")}>{value}</div>
      {sub && <div className="text-[11.5px] text-emerald-500 font-medium mt-0.5">{sub}</div>}
    </Card>
  );
}

/* ---------------------------------------------------------
   HOME VIEW
--------------------------------------------------------- */
function HomeView({ dark, setView, plan, togglePlan }) {
  const doneCount = plan.filter((p) => p.done).length;
  return (
    <div>
      <TopBar dark={dark} title="Welcome back, Thilini 👋" subtitle="Learn smarter. Practice better. Score higher." />

      <div className="flex gap-4 flex-wrap mb-5">
        <StatCard dark={dark} icon={<Flame size={14} className="text-white" />} accent="bg-orange-400"
          label="Study Streak" value="12 days" sub="Keep it up!" />
        <StatCard dark={dark} icon={<Star size={14} className="text-white" />} accent="bg-violet-500"
          label="XP Points" value="2,450" sub="+120 today" />
        <StatCard dark={dark} icon={<TrendingUp size={14} className="text-white" />} accent="bg-blue-500"
          label="Overall Progress" value="68%" />
        <StatCard dark={dark} icon={<Target size={14} className="text-white" />} accent="bg-emerald-500"
          label="Predicted A/L Score" value="A" sub="73% confidence" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* AI Marker card */}
        <Card dark={dark} className="p-5 flex flex-col">
          <SectionTitle dark={dark} sub="Upload your handwritten solution and get AI-powered marking and feedback.">
            AI Mark Your Solution
          </SectionTitle>
          <div className={cx("rounded-xl border-2 border-dashed flex-1 grid place-items-center py-6 mb-4",
            dark ? "border-[#2A2444] bg-[#0E0B1A]/40" : "border-[#E7E4F3] bg-[#FAFAFD]")}>
            <div className="text-center px-4">
              <div className={cx("mx-auto w-10 h-10 rounded-full grid place-items-center mb-2", grad)}>
                <PenTool size={16} className="text-white" />
              </div>
              <p className={cx("text-[12.5px]", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>Handwritten step-by-step preview</p>
            </div>
          </div>
          <button onClick={() => setView("marker")}
            className={cx("w-full py-2.5 rounded-xl text-white text-[13.5px] font-semibold flex items-center justify-center gap-2", grad)}>
            <Upload size={15} /> Upload Solution
          </button>
          <p className={cx("text-center text-[11.5px] mt-2", dark ? "text-[#6D6690]" : "text-[#A6A1C2]")}>or drag and drop image / PDF</p>
        </Card>

        {/* Study planner */}
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark} sub="Your personalized plan for today">Study Planner</SectionTitle>
          <div className="space-y-2 mb-4">
            {plan.map((item) => (
              <button key={item.id} onClick={() => togglePlan(item.id)}
                className={cx("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left",
                  dark ? "border-[#2A2444] hover:bg-white/5" : "border-[#F0EEF9] hover:bg-[#FAFAFD]")}>
                <span className={cx("w-4.5 h-4.5 rounded-md border grid place-items-center shrink-0",
                  item.done ? "bg-[#6E56CF] border-[#6E56CF]" : dark ? "border-[#3A3460]" : "border-[#D6D2EC]")}
                  style={{ width: 18, height: 18 }}>
                  {item.done && <CheckCircle2 size={13} className="text-white" />}
                </span>
                <span className={cx("text-[13px] flex-1", item.done && "line-through opacity-60", dark ? "text-[#EDEBF9]" : "text-[#1B1730]")}>
                  {item.label}
                </span>
                <span className={cx("text-[11.5px]", dark ? "text-[#9A93BE]" : "text-[#A6A1C2]")}>{item.time}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setView("planner")}
            className={cx("w-full py-2.5 rounded-xl border text-[13px] font-semibold",
              dark ? "border-[#2A2444] text-[#C9C4E3] hover:bg-white/5" : "border-[#E7E4F3] text-[#4E4A6B] hover:bg-[#FAFAFD]")}>
            View Full Plan
          </button>
        </Card>

        {/* Topic mastery radar */}
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark}>Topic Mastery</SectionTitle>
          <div className="h-[210px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke={dark ? "#2A2444" : "#E7E4F3"} />
                <PolarAngleAxis dataKey="topic" tick={{ fill: dark ? "#9A93BE" : "#726D8C", fontSize: 10.5 }} />
                <Radar dataKey="Average" stroke={dark ? "#463F6E" : "#D6D2EC"} fill={dark ? "#463F6E" : "#D6D2EC"} fillOpacity={0.35} />
                <Radar dataKey="You" stroke="#6E56CF" fill="#6E56CF" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[11.5px] mt-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6E56CF]" /> <span className={dark ? "text-[#C9C4E3]" : "text-[#4E4A6B]"}>You</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D6D2EC]" /> <span className={dark ? "text-[#C9C4E3]" : "text-[#4E4A6B]"}>Average</span></span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent activity */}
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark}>Recent Activity</SectionTitle>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={cx("text-[13px] font-medium truncate", dark ? "text-[#EDEBF9]" : "text-[#1B1730]")}>{a.title}</p>
                  <p className={cx("text-[11.5px]", dark ? "text-[#9A93BE]" : "text-[#A6A1C2]")}>{a.when}</p>
                </div>
                <span className={cx("text-[11.5px] font-semibold whitespace-nowrap", dark ? "text-[#C9C4E3]" : "text-[#4E4A6B]")}>{a.score}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weakest topics */}
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark}>Weakest Topics</SectionTitle>
          <div className="space-y-3.5">
            {weakest.map((w, i) => (
              <div key={i}>
                <div className="flex justify-between text-[12.5px] mb-1">
                  <span className={dark ? "text-[#EDEBF9]" : "text-[#1B1730]"}>{w.topic}</span>
                  <span className="text-red-500 font-semibold">{w.pct}%</span>
                </div>
                <div className={cx("h-1.5 rounded-full overflow-hidden", dark ? "bg-[#2A2444]" : "bg-[#F0EEF9]")}>
                  <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400" style={{ width: `${w.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setView("analytics")}
            className={cx("w-full py-2.5 rounded-xl border text-[13px] font-semibold mt-4",
              dark ? "border-[#2A2444] text-[#C9C4E3] hover:bg-white/5" : "border-[#E7E4F3] text-[#4E4A6B] hover:bg-[#FAFAFD]")}>
            View Analytics
          </button>
        </Card>

        {/* Recommended */}
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark}>Recommended For You</SectionTitle>
          <div className="space-y-1.5">
            {[
              { icon: <Target size={14} />, label: "Practice: Binomial Theorem (Mixed)" },
              { icon: <FileText size={14} />, label: "Past Paper: 2019 P2 Q3-6" },
              { icon: <Zap size={14} />, label: "Quick Revision: Integration Rules" },
            ].map((r, i) => (
              <button key={i} onClick={() => setView("practice")}
                className={cx("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left",
                  dark ? "hover:bg-white/5" : "hover:bg-[#FAFAFD]")}>
                <span className="text-violet-500 shrink-0">{r.icon}</span>
                <span className={cx("text-[13px] flex-1", dark ? "text-[#EDEBF9]" : "text-[#1B1730]")}>{r.label}</span>
                <ChevronRight size={14} className={dark ? "text-[#6D6690]" : "text-[#C9C4E3]"} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   AI MARKER VIEW
--------------------------------------------------------- */
function MarkerView({ dark }) {
  const [stage, setStage] = useState("upload"); // upload -> loading -> result
  const fileRef = useRef(null);

  const runMock = () => {
    setStage("loading");
    setTimeout(() => setStage("result"), 1600);
  };

  return (
    <div>
      <TopBar dark={dark} title="AI Marker" subtitle="Upload a solution and get instant, exam-style marking." />

      {stage === "upload" && (
        <Card dark={dark} className="p-8 max-w-2xl mx-auto text-center">
          <div className={cx("mx-auto w-14 h-14 rounded-2xl grid place-items-center mb-4", grad)}>
            <Upload size={22} className="text-white" />
          </div>
          <h3 className={cx("text-lg font-semibold mb-1", dark ? "text-white" : "text-[#1B1730]")}>Upload your handwritten solution</h3>
          <p className={cx("text-[13px] mb-6", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>
            Photo, PDF, or image — or draw on the whiteboard. We'll use the sample question below for this demo.
          </p>
          <div
            onClick={() => fileRef.current?.click()}
            className={cx("rounded-xl border-2 border-dashed py-10 mb-5 cursor-pointer transition-colors",
              dark ? "border-[#2A2444] hover:border-[#6E56CF]" : "border-[#E7E4F3] hover:border-[#6E56CF]")}
          >
            <p className={cx("text-[13px]", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>Click to browse or drag & drop image / PDF here</p>
            <input ref={fileRef} type="file" className="hidden" onChange={runMock} />
          </div>
          <button onClick={runMock} className={cx("px-6 py-2.5 rounded-xl text-white text-[13.5px] font-semibold", grad)}>
            Use Sample Solution
          </button>
        </Card>
      )}

      {stage === "loading" && (
        <Card dark={dark} className="p-10 max-w-2xl mx-auto text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-violet-500" size={30} />
          <p className={cx("text-[14px] font-medium", dark ? "text-white" : "text-[#1B1730]")}>Reading your steps…</p>
          <p className={cx("text-[12.5px] mt-1", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>Matching against the marking scheme</p>
        </Card>
      )}

      {stage === "result" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card dark={dark} className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle dark={dark}>Differentiate: f(x) = 3x² + 5x − 7</SectionTitle>
              <button onClick={() => setStage("upload")} className={cx("text-[12px] flex items-center gap-1", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>
                <ArrowLeft size={13} /> New upload
              </button>
            </div>
            <div className={cx("rounded-xl p-5 font-serif text-[15px] space-y-3", dark ? "bg-[#0E0B1A]" : "bg-[#FAFAFD]")}>
              {[
                { text: "dy/dx = 9x² + 10x − 7", verdict: "wrong" },
                { text: "dy/dx = 9x² + 10x − 7", verdict: "correct" },
                { text: "dy/dx = 18x + 10", verdict: "wrong" },
                { text: "dy/dx = 18", verdict: "correct" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 pl-3 relative">
                  <span
                    className={cx("absolute left-0 top-0 bottom-0 w-1 rounded-full",
                      row.verdict === "correct" ? "bg-emerald-400" : "bg-red-400")}
                  />
                  <span className={dark ? "text-[#EDEBF9]" : "text-[#1B1730]"}>{row.text}</span>
                  <VerdictIcon verdict={row.verdict} />
                </div>
              ))}
            </div>
            <button className={cx("w-full mt-4 py-2.5 rounded-xl text-[13px] font-semibold border",
              dark ? "border-[#2A2444] text-[#C9C4E3] hover:bg-white/5" : "border-[#E7E4F3] text-[#4E4A6B] hover:bg-[#FAFAFD]")}>
              View Detailed Feedback →
            </button>
          </Card>

          <Card dark={dark} className="p-5">
            <SectionTitle dark={dark}>Score</SectionTitle>
            <div className={cx("text-[34px] font-bold leading-none", dark ? "text-white" : "text-[#1B1730]")}>
              4<span className={cx("text-lg font-medium", dark ? "text-[#9A93BE]" : "text-[#A6A1C2]")}> / 5</span>
            </div>
            <p className="text-emerald-500 text-[12.5px] font-medium mb-4">Good attempt!</p>
            <div className="space-y-2.5">
              {markedSteps.map((s) => (
                <div key={s.n} className="flex items-start gap-2.5">
                  <VerdictIcon verdict={s.verdict} />
                  <div className="min-w-0">
                    <p className={cx("text-[12.5px] font-medium", dark ? "text-[#EDEBF9]" : "text-[#1B1730]")}>Step {s.n}</p>
                    <p className={cx("text-[11.5px]", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>{s.text}</p>
                    {s.correction && (
                      <p className="text-[11.5px] text-emerald-500 font-mono mt-0.5">{s.correction}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   PRACTICE VIEW
--------------------------------------------------------- */
function PracticeView({ dark }) {
  const [filter, setFilter] = useState("All");
  const diffs = ["All", "Easy", "Medium", "Hard", "Challenge"];
  const list = filter === "All" ? practiceQuestions : practiceQuestions.filter((q) => q.difficulty === filter);

  return (
    <div>
      <TopBar dark={dark} title="Practice" subtitle="AI-generated questions tuned to your weak topics." />
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={14} className={dark ? "text-[#9A93BE]" : "text-[#726D8C]"} />
        {diffs.map((d) => (
          <button key={d} onClick={() => setFilter(d)}
            className={cx("px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border",
              filter === d ? cx("text-white border-transparent", grad) : dark ? "border-[#2A2444] text-[#C9C4E3]" : "border-[#E7E4F3] text-[#4E4A6B]")}>
            {d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((q) => (
          <Card key={q.id} dark={dark} className="p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className={cx("text-[11px] font-semibold", dark ? "text-[#9A93BE]" : "text-[#A6A1C2]")}>{q.topic}</span>
              <span className={cx("text-[10.5px] font-semibold px-2 py-0.5 rounded-full border", diffColor[q.difficulty])}>{q.difficulty}</span>
            </div>
            <p className={cx("text-[14px] font-medium mb-3.5 font-serif", dark ? "text-[#EDEBF9]" : "text-[#1B1730]")}>{q.q}</p>
            <div className="flex gap-2">
              <button className={cx("flex-1 py-2 rounded-lg text-[12.5px] font-semibold text-white", grad)}>Solve</button>
              <button className={cx("px-3 py-2 rounded-lg text-[12.5px] font-medium border", dark ? "border-[#2A2444] text-[#C9C4E3]" : "border-[#E7E4F3] text-[#4E4A6B]")}>Hint</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PLANNER VIEW
--------------------------------------------------------- */
function PlannerView({ dark }) {
  const days = Object.keys(weekSchedule);
  const [active, setActive] = useState("Tue");
  return (
    <div>
      <TopBar dark={dark} title="Study Planner" subtitle="Adapts automatically after every completed quiz." />
      <Card dark={dark} className="p-5">
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {days.map((d) => (
            <button key={d} onClick={() => setActive(d)}
              className={cx("px-4 py-2 rounded-xl text-[13px] font-semibold shrink-0",
                active === d ? cx("text-white", grad) : dark ? "text-[#C9C4E3] hover:bg-white/5" : "text-[#4E4A6B] hover:bg-[#FAFAFD]")}>
              {d}
            </button>
          ))}
        </div>
        <div className="space-y-2.5">
          {weekSchedule[active].map((item, i) => (
            <div key={i} className={cx("flex items-center gap-3 px-4 py-3 rounded-xl border",
              item.brk ? (dark ? "border-[#2A2444] bg-[#0E0B1A]/40" : "border-[#F0EEF9] bg-[#FAFAFD]")
                       : (dark ? "border-[#2A2444]" : "border-[#F0EEF9]"))}>
              <span className={cx("text-[12px] font-semibold w-14 shrink-0", dark ? "text-[#9A93BE]" : "text-[#A6A1C2]")}>{item.t}</span>
              <span className={cx("flex-1 text-[13.5px] font-medium", item.brk ? (dark ? "text-[#8B84AD]" : "text-[#A6A1C2]") : (dark ? "text-[#EDEBF9]" : "text-[#1B1730]"))}>
                {item.label}
              </span>
              {item.dur && <span className={cx("text-[11.5px] flex items-center gap-1", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}><Clock size={11} />{item.dur}</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
   ANALYTICS VIEW
--------------------------------------------------------- */
function AnalyticsView({ dark }) {
  return (
    <div>
      <TopBar dark={dark} title="Analytics" subtitle="Your learning patterns over the last 30 days." />
      <div className="flex gap-4 flex-wrap mb-5">
        <StatCard dark={dark} icon={<Target size={14} className="text-white" />} accent="bg-violet-500" label="Questions Solved" value="245" />
        <StatCard dark={dark} icon={<CheckCircle2 size={14} className="text-white" />} accent="bg-emerald-500" label="Accuracy" value="68%" />
        <StatCard dark={dark} icon={<Star size={14} className="text-white" />} accent="bg-blue-500" label="Avg. Score" value="12.6 / 20" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark}>Accuracy Trend</SectionTitle>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrend}>
                <CartesianGrid stroke={dark ? "#2A2444" : "#F0EEF9"} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: dark ? "#9A93BE" : "#726D8C", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: dark ? "#9A93BE" : "#726D8C", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "none" }} />
                <Line type="monotone" dataKey="acc" stroke="#6E56CF" strokeWidth={2.5} dot={{ r: 3, fill: "#6E56CF" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card dark={dark} className="p-5">
          <SectionTitle dark={dark}>Topic Performance</SectionTitle>
          <div className="space-y-3 mt-1">
            {topicPerf.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-[12.5px] mb-1">
                  <span className={dark ? "text-[#EDEBF9]" : "text-[#1B1730]"}>{t.topic}</span>
                  <span style={{ color: t.color }} className="font-semibold">{t.score}%</span>
                </div>
                <div className={cx("h-1.5 rounded-full overflow-hidden", dark ? "bg-[#2A2444]" : "bg-[#F0EEF9]")}>
                  <div className="h-full rounded-full" style={{ width: `${t.score}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Simple stub views
--------------------------------------------------------- */
function StubView({ dark, title, sub, icon: Icon }) {
  return (
    <div>
      <TopBar dark={dark} title={title} subtitle={sub} />
      <Card dark={dark} className="p-16 text-center">
        <Icon size={28} className={cx("mx-auto mb-3", dark ? "text-[#6D6690]" : "text-[#C9C4E3]")} />
        <p className={cx("text-[13.5px]", dark ? "text-[#9A93BE]" : "text-[#726D8C]")}>This section is coming together — check back soon.</p>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
   APP
--------------------------------------------------------- */
export default function App() {
  const { dark, setDark } = useTheme();
  const [view, setView] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [plan, setPlan] = useState(plannerToday);

  const togglePlan = (id) => setPlan((p) => p.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));

  const bg = dark ? palette.bgDark : palette.bgLight;

  return (
    <div className="w-full h-[760px] flex overflow-hidden rounded-2xl" style={{ background: bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <Sidebar dark={dark} setDark={setDark} view={view} setView={setView} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 overflow-y-auto p-6">
        {view === "home" && <HomeView dark={dark} setView={setView} plan={plan} togglePlan={togglePlan} />}
        {view === "marker" && <MarkerView dark={dark} />}
        {view === "practice" && <PracticeView dark={dark} />}
        {view === "planner" && <PlannerView dark={dark} />}
        {view === "analytics" && <AnalyticsView dark={dark} />}
        {view === "papers" && <StubView dark={dark} title="Past Papers" sub="Browse thousands of questions by topic and year." icon={FileText} />}
        {view === "achievements" && <StubView dark={dark} title="Achievements" sub="Badges, streaks, and leaderboards." icon={Trophy} />}
        {view === "profile" && <StubView dark={dark} title="Profile" sub="Your account details." icon={User} />}
      </div>
    </div>
  );
}
