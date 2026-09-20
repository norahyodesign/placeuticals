type PageHeroProps = {
  tags?: string[]
}

/** consulting/research/platform 서비스 상세 페이지 상단 다크 히어로 — 키워드 배지만 노출한다 */
export function PageHero({ tags }: PageHeroProps) {
  return (
    <section
      /* pt-40: 헤더(~100px)가 이 다크 히어로 위에 겹쳐 뜨므로 배지가 가리지 않도록 위를 넉넉히 비운다 */
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
