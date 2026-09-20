import { type FormEvent, type ReactNode, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { COMPANY } from '@/content/site'
import { SERVICE_OPTIONS } from '@/content/support'
import { cn } from '@/lib/utils'

/**
 * Q5(마이그레이션 플랜): 정적 호스팅이라 서버가 없어 mailto 폴백으로 전송한다.
 * 아임웹 임베드 시엔 아임웹 자체 폼으로 교체될 수 있어 이 컴포넌트는 독립적으로 둔다.
 *
 * 디자인은 Aceternity "Signup Form" 패턴:
 *  - 라벨 + 입력을 한 묶음(Field)으로 쌓고, 짧은 항목 두 개는 한 줄에 나란히
 *  - 제출 버튼은 전체 폭 그라디언트, 호버 시 아래쪽에 빛줄기(BottomGradient)
 *  - 구분선은 양끝이 투명해지는 그라디언트 선
 * 원본의 시안/인디고 대신 브랜드 퍼플만 쓴다.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = data.get('name')
    const company = data.get('company')
    const email = data.get('email')
    const phone = data.get('phone')
    const service = data.get('service')
    const message = data.get('message')

    const body = [
      `이름: ${name}`,
      `소속: ${company}`,
      `이메일: ${email}`,
      `연락처: ${phone}`,
      `문의 유형: ${service}`,
      '',
      `${message}`,
    ].join('\n')

    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
      `[상담 문의] ${name}`,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="plt-card-hover mx-auto w-full max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-xl leading-7 font-bold text-foreground">상담 문의</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        연구 단계와 목표를 알려주시면 임상 진입 전략을 함께 검토해 드립니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        {/* 짧은 항목 두 개는 한 줄에 — 원본의 firstname/lastname 배치 */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <Field htmlFor="name" label="이름" required>
            <Input id="name" name="name" placeholder="홍길동" required autoComplete="name" />
          </Field>
          <Field htmlFor="company" label="소속 기관 / 회사">
            <Input id="company" name="company" placeholder="기관명" autoComplete="organization" />
          </Field>
        </div>

        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <Field htmlFor="email" label="이메일" required>
            <Input id="email" name="email" type="email" placeholder="example@email.com" required autoComplete="email" />
          </Field>
          <Field htmlFor="phone" label="연락처">
            <Input id="phone" name="phone" type="tel" placeholder="010-0000-0000" autoComplete="tel" />
          </Field>
        </div>

        <Field htmlFor="service" label="문의 유형" className="mb-4">
          <select
            id="service"
            name="service"
            className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">선택해주세요</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field htmlFor="message" label="문의 내용" className="mb-8">
          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder="현재 진행 중인 연구 단계, 목표, 문의 사항을 간략히 작성해 주세요."
          />
        </Field>

        {/* 전체 폭 그라디언트 버튼 — 호버 시 아래쪽에 퍼플 빛줄기 */}
        <button
          type="submit"
          /* flex+justify-center로 가운데 정렬 — scoped-reset이 button의 text-align을 inherit으로
             두기 때문에 block만 쓰면 카드의 왼쪽 정렬을 물려받는다 */
          className="group/btn relative flex h-11 w-full items-center justify-center rounded-md bg-gradient-to-br from-primary to-brand-accent2 text-sm font-bold text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-transform duration-200 hover:-translate-y-0.5"
        >
          문의 보내기 &rarr;
          <BottomGradient />
        </button>

        {/* 양끝이 투명해지는 구분선 */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <p className="text-center text-xs leading-5 text-muted-foreground">
          {sent
            ? '메일 앱이 열립니다. 전송이 안 되면 이메일로 직접 보내주세요.'
            : '모든 문의는 비밀이 보장됩니다. 영업일 2일 내 연락드립니다.'}
        </p>
      </form>
    </div>
  )
}

/** 제출 버튼 아래를 지나는 빛줄기 — 원본 BottomGradient의 시안/인디고를 브랜드 퍼플로 */
function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-brand-accent2 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

/** 라벨 + 입력 한 묶음 (원본 LabelInputContainer) */
function Field({
  htmlFor,
  label,
  required,
  className,
  children,
}: {
  htmlFor: string
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      <label htmlFor={htmlFor} className="text-sm leading-5 font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  )
}
