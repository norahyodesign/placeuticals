import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ_ITEMS } from '@/content/support'

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="plt-card-hover rounded-2xl border border-border px-6">
      {FAQ_ITEMS.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`}>
          <AccordionTrigger className="text-base font-semibold text-foreground">{item.q}</AccordionTrigger>
          <AccordionContent className="text-sm leading-6 text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
