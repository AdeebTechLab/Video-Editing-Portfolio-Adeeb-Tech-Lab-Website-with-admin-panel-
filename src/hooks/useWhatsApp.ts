import { useCallback } from 'react'
import { useSite } from '../store/siteStore'
import { whatsappLink } from '../lib/utils'

/** +923092333121 → +92 309 2333121 (Pakistani numbers); other numbers keep their digits after a +. */
export function formatWhatsApp(number: string) {
  const digits = number.replace(/\D/g, '')
  const pk = /^92(\d{3})(\d{7})$/.exec(digits)
  return pk ? `+92 ${pk[1]} ${pk[2]}` : digits ? `+${digits}` : ''
}

/** Builds WhatsApp links with the number and default message from Site content. */
export function useWhatsApp() {
  const { settings } = useSite()
  const link = useCallback(
    (message?: string) => whatsappLink(settings.whatsappNumber, message || settings.whatsappMessage),
    [settings.whatsappNumber, settings.whatsappMessage],
  )
  return { link, display: formatWhatsApp(settings.whatsappNumber) }
}
