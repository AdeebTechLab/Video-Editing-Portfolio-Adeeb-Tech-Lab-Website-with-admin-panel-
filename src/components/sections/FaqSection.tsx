import { Plus, Minus } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { Heading } from '../ui'
import { Num } from './HomeSections'

export function FaqSection() {
  const { settings } = useContent()
  return (
    <section id="faq" className="section faq">
      <Heading number="11" kicker="Before we begin">
        GOOD
        <br />
        <em>QUESTIONS.</em>
      </Heading>
      <div>
        {settings.faqs.map(({ question: q, answer: a }, i) => (
          <details key={q}>
            <summary>
              <span className="muted">
                <Num i={i} />
              </span>
              {q}
              <Plus className="plus" size={19} />
              <Minus className="minus" size={19} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
