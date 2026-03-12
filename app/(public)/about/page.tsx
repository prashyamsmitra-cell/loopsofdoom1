export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto min-h-[80svh]">
      <div className="mb-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight mb-4">
          The Architecture <span className="text-brand-red">Behind The Curtain.</span>
        </h1>
        <p className="font-body text-xl text-brand-lgray leading-relaxed">
          I build full-stack applications with a focus on cinematic user experiences, AI integration, and robust system design. Normal portfolios are boring. I wanted to build a product.
        </p>
      </div>

      <div className="space-y-12 border-l border-brand-mid pl-8 ml-4">
        
        <div className="relative">
          <div className="absolute -left-10 w-4 h-4 rounded-full bg-brand-red border-4 border-brand-dark" />
          <h3 className="font-display font-bold text-2xl text-white mb-2">Frontend</h3>
          <ul className="list-disc list-outside ml-4 space-y-2 font-body text-brand-lgray marker:text-brand-dgray">
             <li><strong className="text-white">Next.js 15 (App Router):</strong> Core framework for React server components and routing.</li>
             <li><strong className="text-white">Framer Motion & GSAP:</strong> Coordinated orchestration for entering animations, shared layout IDs, and complex physics.</li>
             <li><strong className="text-white">Three.js (@react-three/fiber):</strong> WebGL canvas for the interactive hero neural network.</li>
             <li><strong className="text-white">Tailwind CSS:</strong> Strict layout design, utilizing custom variable injection for the Netflix core themes.</li>
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -left-10 w-4 h-4 rounded-full bg-brand-mid border-4 border-brand-dark" />
          <h3 className="font-display font-bold text-2xl text-white mb-2">Backend & Edge</h3>
          <ul className="list-disc list-outside ml-4 space-y-2 font-body text-brand-lgray marker:text-brand-dgray">
             <li><strong className="text-white">Vercel Edge Functions:</strong> For low-latency AI streaming responses globally.</li>
             <li><strong className="text-white">Supabase (PostgreSQL):</strong> Core database managing projects, analytics logging, and auth states.</li>
             <li><strong className="text-white">Upstash (Redis):</strong> High-performance distributed rate-limiting to protect the Anthropic API keys.</li>
             <li><strong className="text-white">NextAuth.js:</strong> Dedicated GitHub OAuth flow locking down the admin area.</li>
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -left-10 w-4 h-4 rounded-full bg-brand-mid border-4 border-brand-dark" />
          <h3 className="font-display font-bold text-2xl text-white mb-2">Artificial Intelligence</h3>
          <ul className="list-disc list-outside ml-4 space-y-2 font-body text-brand-lgray marker:text-brand-dgray">
             <li><strong className="text-white">Claude 3.5 Sonnet:</strong> The core reasoning engine behind the site.</li>
             <li><strong className="text-white">Project Specific Contexts:</strong> Each project injected dynamically as a system prompt, grounding the AI to speak specifically as the developer.</li>
             <li><strong className="text-white">React Native Streams:</strong> Fluid UI mapping from raw data streams direct to the client without dropping chunks.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
