'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq?: any
    _fbq?: any
  }
}

export function MetaPixel() {
  const pathname = usePathname()

  // Initialize pixel on first load
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Setup fbq before loading the external script
    if (!window.fbq) {
      window.fbq = function(this: any) {
        (window.fbq as any).callMethod
          ? (window.fbq as any).callMethod.apply(window.fbq, arguments)
          : (window.fbq as any).queue.push(arguments)
      }
      ;(window as any)._fbq = window.fbq
      ;(window.fbq as any).push = window.fbq
      ;(window.fbq as any).loaded = true
      ;(window.fbq as any).version = '2.0'
      ;(window.fbq as any).queue = []
    }

    // Load the Facebook Events Library script
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.async = true
    document.head.appendChild(script)

    // Initialize pixel after script loads
    script.onload = () => {
      if ((window as any).fbq) {
        (window as any).fbq('init', '797473043399003')
        (window as any).fbq('track', 'PageView')
      }
    }

    // Add noscript fallback
    if (!document.querySelector('noscript[data-pixel-id="797473043399003"]')) {
      const noscript = document.createElement('noscript')
      noscript.setAttribute('data-pixel-id', '797473043399003')
      const img = document.createElement('img')
      img.height = 1
      img.width = 1
      img.style.display = 'none'
      img.src = 'https://www.facebook.com/tr?id=797473043399003&ev=PageView&noscript=1'
      noscript.appendChild(img)
      document.body.appendChild(noscript)
    }
  }, [])

  // Track PageView on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}

export function trackPurchase(data: {
  currency?: string
  value: number
  content_name?: string
  content_ids?: string[]
  num_items?: number
}) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      currency: data.currency || 'MAD',
      value: data.value,
      content_name: data.content_name,
      content_ids: data.content_ids,
      num_items: data.num_items,
    })
  }
}

export function trackInitiateCheckout(data: {
  currency?: string
  value: number
  content_ids?: string[]
  num_items?: number
}) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      currency: data.currency || 'MAD',
      value: data.value,
      content_ids: data.content_ids,
      num_items: data.num_items,
    })
  }
}

export function trackAddToCart(data: {
  currency?: string
  value: number
  content_name?: string
  content_id?: string
}) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'AddToCart', {
      currency: data.currency || 'MAD',
      value: data.value,
      content_name: data.content_name,
      content_id: data.content_id,
    })
  }
}

export function trackViewContent(data: {
  currency?: string
  value: number
  content_name?: string
  content_id?: string
  content_type?: string
}) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      currency: data.currency || 'MAD',
      value: data.value,
      content_name: data.content_name,
      content_id: data.content_id,
      content_type: data.content_type || 'product',
    })
  }
}
