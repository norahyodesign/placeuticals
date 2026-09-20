import { PRIVACY_EFFECTIVE_DATE, PRIVACY_INTRO, PRIVACY_SECTIONS } from '@/content/privacy'

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-muted-foreground">시행일: {PRIVACY_EFFECTIVE_DATE}</p>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">{PRIVACY_INTRO}</p>

      <div className="mt-10 space-y-10">
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-foreground">{section.heading}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="mt-3 text-sm leading-6 text-muted-foreground">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.table && (
              <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      {section.table.headers.map((h) => (
                        <th key={h} className="px-4 py-2.5 font-semibold text-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5 text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
