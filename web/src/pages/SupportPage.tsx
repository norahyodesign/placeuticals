import { Mail, MapPin, Clock } from 'lucide-react'
import { TabPageHeader } from '@/components/common/TabPageHeader'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import { FaqAccordion } from '@/components/support/FaqAccordion'
import { ContactForm } from '@/components/support/ContactForm'
import { CONTACT_INFO_ROWS, SUPPORT_HEADER } from '@/content/support'

const ICONS = [Mail, MapPin, Clock]

export function SupportPage() {
  return (
    <>
      <TabPageHeader {...SUPPORT_HEADER} />

      <Section id="qna">
        <SectionHeading
          label="Frequently Asked Questions"
          title={
            <>
              자주 묻는 <span>질문</span>
            </>
          }
          subtitle="플라슈티컬즈 서비스에 대한 자주 묻는 질문을 모았습니다."
        />
        <FaqAccordion />
      </Section>

      <Section alt id="contact">
        <SectionHeading
          title={
            <>
              문의 & <span>상담 신청</span>
            </>
          }
          subtitle="어떤 단계에서든, 임상 진입을 목표로 하는 모든 문의를 환영합니다."
        />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <div className="space-y-6">
            {CONTACT_INFO_ROWS.map((row, i) => {
              const Icon = ICONS[i]
              return (
                <div key={row.label} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-accent-soft text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {row.label}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {row.href ? (
                        <a href={row.href} className="hover:underline">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{row.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    </>
  )
}
