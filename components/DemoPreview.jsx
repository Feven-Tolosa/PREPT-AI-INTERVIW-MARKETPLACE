import { SectionLabel, SectionHeading, GrayTitle, GoldTitle } from "@/components/reusables";
import { Play, MonitorSmartphone, Sparkles, MessageSquare } from "lucide-react";

const DEMO_FEATURES = [
  { icon: <MonitorSmartphone size={16} />, label: "HD Video with Screen Share" },
  { icon: <Sparkles size={16} />, label: "Live AI Question Generator" },
  { icon: <MessageSquare size={16} />, label: "Persistent Chat Thread" },
];

export default function DemoPreview() {
  return (
    <section className='relative z-10 py-28 max-w-5xl mx-auto px-6'>
      <div className='text-center mb-16'>
        <SectionLabel>See it in action</SectionLabel>
        <SectionHeading
          gray='A platform built for'
          gold='real interview prep'
        />
        <p className='text-stone-400 mt-4 text-sm max-w-lg mx-auto leading-relaxed'>
          Watch how Prept combines expert-led mock interviews with AI-powered
          tools to give you the edge in your next interview.
        </p>
      </div>

      {/* Video / Demo Frame */}
      <div className='relative group'>
        {/* Glow behind frame */}
        <div className='absolute -inset-4 bg-linear-to-b from-amber-400/10 via-amber-400/5 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700' />

        <div className='relative rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_-20px_rgba(251,191,36,0.1)]'>
          {/* Browser chrome */}
          <div className='flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/2'>
            <span className='w-2.5 h-2.5 rounded-full bg-[#ff5f57]' />
            <span className='w-2.5 h-2.5 rounded-full bg-[#ffbd2e]' />
            <span className='w-2.5 h-2.5 rounded-full bg-[#28c840]' />
            <div className='ml-4 flex-1 max-w-xs h-6 rounded-md bg-white/5 border border-white/10 flex items-center px-3'>
              <span className='text-[10px] text-stone-500 font-mono'>
                prept.app/interview/session
              </span>
            </div>
          </div>

          {/* Demo content area */}
          <div className='relative aspect-video flex items-center justify-center bg-linear-to-b from-[#0a0a0d] via-[#0f0f14] to-[#0a0a0d]'>
            {/* Decorative grid */}
            <div
              className='absolute inset-0 opacity-[0.03]'
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Center play button */}
            <div className='relative group/play cursor-pointer'>
              <div className='absolute inset-0 bg-amber-400/20 rounded-full blur-xl scale-150 opacity-0 group-hover/play:opacity-100 transition-opacity duration-500' />
              <div className='relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/play:scale-110 group-hover/play:border-amber-400/40 transition-all duration-300'>
                <Play
                  size={28}
                  className='text-amber-400 ml-1'
                  fill='currentColor'
                />
              </div>
            </div>

            {/* Floating UI mockups */}
            {/* Left panel - interviewer */}
            <div className='hidden lg:flex absolute left-8 top-8 w-48 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4 flex-col gap-3'>
              <div className='flex items-center gap-2.5'>
                <div className='w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xs text-amber-400 font-bold'>
                  JD
                </div>
                <div>
                  <p className='text-[11px] text-stone-200 font-medium'>
                    John Doe
                  </p>
                  <p className='text-[9px] text-stone-500'>
                    Senior SWE @ Google
                  </p>
                </div>
              </div>
              <div className='h-px bg-white/10' />
              <div className='space-y-1.5'>
                <div className='h-1.5 w-4/5 rounded-full bg-white/5' />
                <div className='h-1.5 w-3/5 rounded-full bg-white/5' />
              </div>
            </div>

            {/* Right panel - AI feedback */}
            <div className='hidden lg:flex absolute right-8 bottom-8 w-52 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4 flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <Sparkles size={14} className='text-amber-400' />
                <span className='text-[11px] text-stone-300 font-medium'>
                  AI Feedback
                </span>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden'>
                    <div className='h-full w-[85%] rounded-full bg-linear-to-b from-amber-400/60 to-amber-500/40' />
                  </div>
                  <span className='text-[9px] text-stone-500'>85%</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden'>
                    <div className='h-full w-[72%] rounded-full bg-linear-to-b from-emerald-400/60 to-emerald-500/40' />
                  </div>
                  <span className='text-[9px] text-stone-500'>72%</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden'>
                    <div className='h-full w-[91%] rounded-full bg-linear-to-b from-blue-400/60 to-blue-500/40' />
                  </div>
                  <span className='text-[9px] text-stone-500'>91%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature pills */}
      <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
        {DEMO_FEATURES.map((f, i) => (
          <div
            key={i}
            className='flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-stone-400 hover:border-amber-400/20 hover:text-stone-300 transition-all duration-300'
          >
            <span className='text-amber-400'>{f.icon}</span>
            {f.label}
          </div>
        ))}
      </div>
    </section>
  )
}
