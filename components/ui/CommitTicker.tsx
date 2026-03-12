'use client'

const COMMITS = [
  "fix: fixed the bug i introduced while fixing the last bug",
  "feat: it works, don't touch it",
  "chore: forgot to save. again.",
  "fix: undefined is not a function (this time it really is fixed)",
  "feat: added feature at 2am. vibes only.",
  "hotfix: removed the thing that was definitely not supposed to be there",
  "refactor: moved code around until it felt right",
  "fix: turns out the bug was me",
  "feat: added AI because why not",
  "chore: npm audit fix --force (prayers sent)",
  "style: made it look less terrible",
  "docs: added comment explaining why this works (I don't know why)"
]

export function CommitTicker() {
  // Duplicate array 3x for seamless infinite scrolling
  const messages = [...COMMITS, ...COMMITS, ...COMMITS]

  return (
    <div className="w-full overflow-hidden border-t border-brand-mid bg-[#0a0a0a] py-3" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
      <div className="flex flex-row gap-8 w-max animate-ticker hover:[animation-play-state:paused] cursor-default">
        {messages.map((msg, i) => (
          <div key={i} className="flex-shrink-0 font-pixel text-[10px] text-brand-dgray tracking-wide">
            <span className="text-brand-red opacity-50">&gt;</span> git commit -m <span className="text-brand-lgray">&quot;{msg}&quot;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
