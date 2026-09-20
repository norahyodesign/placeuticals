import { TabPageHeader } from '@/components/common/TabPageHeader'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import { OrgChart } from '@/components/about/OrgChart'
import { useStickyCenter } from '@/hooks/use-sticky-center'
import {
  ABOUT_HEADER,
  COMPANY_PHOTO,
  COMPANY_TAGS,
  LAB_DESC,
  LAB_ITEMS,
  LAB_PHOTO,
  LOCATION_INFO,
  LOCATION_MAP_SRC,
  MISSION_QUOTE,
} from '@/content/about'

export function AboutPage() {
  const labPhoto = useStickyCenter<HTMLImageElement>()

  return (
    <>
      <TabPageHeader {...ABOUT_HEADER} />

      <Section id="mission">
        <SectionHeading
          title={
            <>
              회사소개 & <span>미션</span>
            </>
          }
        />
        <div
          className="relative overflow-hidden rounded-t-2xl bg-brand-navy px-8 py-10 text-center text-white"
          style={{
            backgroundImage:
              'radial-gradient(500px circle at 90% 0%, #857bf838, transparent 60%), radial-gradient(420px circle at 10% 100%, #6a5ef02e, transparent 60%)',
          }}
        >
          <div className="relative text-2xl leading-9 font-bold">{MISSION_QUOTE.text}</div>
          <p className="relative mt-3 text-sm leading-6 text-white/60">{MISSION_QUOTE.en}</p>
        </div>
        {/* 다크 카드와 맞붙는 사진 — 맞닿는 모서리를 각지게 해서 둘이 한 덩어리로 읽힌다 */}
        <img
          src={COMPANY_PHOTO}
          alt=""
          loading="lazy"
          className="aspect-[21/9] w-full rounded-b-2xl object-cover"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <p className="text-base leading-[1.625rem] text-muted-foreground">
            <strong className="text-foreground">플라슈티컬즈(Placeuticals)</strong>는 태반 유래 줄기세포 및 엑소좀 기반
            재생의료 기술을 바탕으로 임상 진입 및 개발 전략을 설계하는 바이오 기업입니다.
            <br />
            <br />
            단순 연구에 머무르지 않고, <strong className="text-foreground">Backward Design</strong> 방법론을 통해 임상
            목표에서 거꾸로 개발 전략을 설계합니다. CMC, 비임상, 규제 전략을 하나의 목표 아래 통합하여 재생의료
            연구가 임상으로 이어질 수 있도록 지원합니다.
            <br />
            <br />
            기업부설연구소를 기반으로 자체 연구개발과 외부 기업 컨설팅을 병행하며, 재생의료 분야의 임상 진입 장벽을
            낮추는 데 집중합니다.
          </p>
          {/* justify-self-end — 칸 전체를 채우지 않고 내용 폭만큼 줄어들어 오른쪽 끝에 붙는다.
              글자는 읽기 편하도록 왼쪽 정렬 그대로 둔다 */}
          <div className="space-y-4 lg:justify-self-end">
            {COMPANY_TAGS.map((tag) => (
              <div key={tag.title} className="flex items-start gap-3">
                <div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="text-sm leading-6 font-bold text-foreground">{tag.title}</div>
                  <div className="text-sm leading-6 text-muted-foreground">{tag.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section alt id="organization">
        <SectionHeading
          title={
            <>
              조직 <span>구조</span>
            </>
          }
          subtitle="연구, 기획, 임상이 통합된 조직 구조를 기반으로 임상 진입 중심의 개발 전략을 수행합니다."
        />
        <OrgChart />
      </Section>

      <Section id="lab">
        <SectionHeading
          title={
            <>
              기업부설 <span>연구소</span>
            </>
          }
        />
        <p className="mx-auto -mt-4 mb-10 max-w-2xl text-center text-base leading-[1.625rem] text-muted-foreground">{LAB_DESC}</p>
        {/* 사진 왼쪽 + 항목 오른쪽 — 회사소개(가로 밴드)와 구조를 달리해 두 섹션이 구분된다 */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {/* 스크롤을 따라오는 사진 — top은 훅이 높이를 재서 화면 세로 가운데로 넣는다 (lg 미만은 static이라 무시됨) */}
          <img
            ref={labPhoto.ref}
            style={labPhoto.style}
            src={LAB_PHOTO}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover lg:sticky lg:self-start"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {LAB_ITEMS.map((item) => (
            <div key={item.title} className="plt-card-hover rounded-xl border border-border p-6">
              <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-brand-accent-soft text-primary">
                {item.icon}
              </div>
              <div className="mb-1 text-base leading-[1.625rem] font-bold text-foreground">{item.title}</div>
              <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
          </div>
        </div>
      </Section>

      <Section alt id="location">
        <SectionHeading title="오시는길" subtitle={LOCATION_INFO[0].value.split('\n')[0]} />
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            src={LOCATION_MAP_SRC}
            width="100%"
            height={400}
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="오시는길 지도"
          />
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {LOCATION_INFO.map((info) => (
            <div key={info.label} className="plt-card-hover rounded-xl border border-transparent bg-muted/60 p-6">
              <div className="mb-2 text-sm leading-6 font-bold text-foreground">{info.label}</div>
              <div className="text-sm leading-6 whitespace-pre-line text-muted-foreground">{info.value}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
