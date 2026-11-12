import { ChevronDown } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { SectionHeading } from '../ui'

export function FaqSection() {
  const { settings } = useContent()
  if (!settings.faqs.length) return null
  return (
    <section id="faq" className="scroll-mt-20 py-16 md:py-20">
      <div className="container-x">
        <SectionHeading title="Frequently asked questions" text="A few helpful details before we get started." />
        <div className="mt-8 divide-y divide-line border-y border-line">
          {settings.faqs.map(({ question, answer }) => (
            <details key={question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-ink marker:hidden focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown className="size-5 shrink-0 text-ink-faint transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-ink-muted">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
