import Link from "next/link";

function CpuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const features = [
  {
    icon: <CpuIcon />,
    title: "AI Models",
    desc: "Pick GPT-4o, Claude or any supported model. Each agent compiles to a typed agent.ts with the correct SDK call and dependency.",
  },
  {
    icon: <WrenchIcon />,
    title: "Tools & Functions",
    desc: "Select pre-built tools — Slack notifications, SQL queries, weather — or extend with your own. All exported as ready-to-run .ts files.",
  },
  {
    icon: <PlugIcon />,
    title: "Channels & MCP",
    desc: "Wire Slack, Telegram channels and MCP connections with one checkbox. Credentials and config are scaffolded automatically.",
  },
];

const steps = [
  {
    step: "01",
    title: "Pick a template",
    desc: "Start from blank or choose a pre-configured template — Slack notifier, data analyst, ops agent and more.",
  },
  {
    step: "02",
    title: "Configure",
    desc: "Name your agent, write its system instructions, select a model, and attach tools, channels and MCP connections.",
  },
  {
    step: "03",
    title: "Download & deploy",
    desc: "Generate a .tar.gz scaffold with all files in place. Run bun dev inside and your agent is live.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">


      {/* Hero */}
      <section className="pt-40 pb-28 px-6 text-center">
       
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Build AI agents<br />
          <span className="text-green-400">in minutes.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An interactive wizard to scaffold, configure and download production-ready AI agents — complete with models, tools, channels and MCP connections.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/build"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-black font-semibold text-base px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Open Wizard
            <ArrowRightIcon />
          </Link>
          <a
            href="https://eve.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-neutral-400 hover:text-white text-base font-medium transition-colors duration-200 cursor-pointer"
          >
            Eve docs →
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-mono text-neutral-600 uppercase tracking-widest mb-12">
            Everything you need to ship
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-neutral-700 transition-colors duration-200"
              >
                <div className="size-10 flex items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-16">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <span className="font-mono text-5xl font-extrabold text-neutral-800 leading-none">{s.step}</span>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 border-t border-white/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold">Ready to ship your agent?</h2>
          <p className="mt-4 text-neutral-400 text-lg">No account required. Runs fully locally.</p>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 mt-8 bg-white hover:bg-neutral-100 text-black font-semibold text-base px-8 py-4 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Open Wizard
            <ArrowRightIcon />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-neutral-700 font-mono">
        eve.wizard — built with Next.js + Bun
      </footer>
    </div>
  );
}
