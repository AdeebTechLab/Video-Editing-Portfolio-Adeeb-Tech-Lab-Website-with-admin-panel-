import { useSeo } from '../lib/seo'
import { ContactSection } from '../components/sections/ContactSection'
import { FaqSection } from '../components/sections/FaqSection'
import {
  AboutSection,
  ComparisonSection,
  Hero,
  ProcessSection,
  ServicesSection,
  ShowreelSection,
  Ticker,
  TimelineSection,
  ToolsSection,
  WhySection,
  WorkSection,
} from '../components/sections/HomeSections'

export default function Home() {
  useSeo({ path: '/' })
  return (
    <>
      <Hero />
      <Ticker />
      <ShowreelSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <TimelineSection />
      <ToolsSection />
      <ProcessSection />
      <ComparisonSection />
      <WhySection />
      <FaqSection />
      <ContactSection />
    </>
  )
}
