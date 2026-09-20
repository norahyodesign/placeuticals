type TabPageHeaderProps = {
  tags?: string[]
}

/**
 * about/support 상단 헤더 — 다크 히어로. PageHero와 같은 배경·여백을 쓰며 키워드 배지만 노출한다.
 */
export function TabPageHeader({ tags }: TabPageHeaderProps) {
  return (
    <section
      className="relative overflow-hidden bg-brand-navy px-6 pt-40 pb-20 text-white"
      style={{
        backgroundImage:
          'radial-gradient(560px circle at 15% 0%, #857bf833, transparent 60%), radial-gradient(560px circle at 100% 30%, #6a5ef02e, transparent 60%)',
      }}
    >
      {tags && tags.length > 0 && (
        <div className="relative mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
