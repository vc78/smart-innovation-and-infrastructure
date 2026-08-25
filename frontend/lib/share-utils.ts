/**
 * Utilities for sharing project information across various platforms
 */

export interface ShareData {
  title: string
  text: string
  url: string
  image?: string
}

export interface ShareOptions {
  method?: "native" | "whatsapp" | "gmail" | "email" | "copy" | "auto"
}

export async function share(data: ShareData, options: ShareOptions = {}): Promise<boolean> {
  const method = options.method || "auto"

  try {
    switch (method) {
      case "whatsapp":
        return shareViaWhatsApp(data)
      case "gmail":
        return shareViaGmail(data)
      case "email":
        return shareViaEmail(data)
      case "copy":
        return await copyToClipboard(data.url)
      case "native":
        return await shareViaNativeAPI(data)
      case "auto":
      default:
        if (typeof navigator !== "undefined" && typeof (navigator as any).share === "function") {
          return await shareViaNativeAPI(data)
        }
        return shareViaWhatsApp(data)
    }
  } catch (error) {
    console.error("Share error:", error)
    return await copyToClipboard(data.url)
  }
}

export async function shareViaNativeAPI(data: ShareData): Promise<boolean> {
  if (typeof navigator === "undefined" || !(navigator as any).share) {
    throw new Error("Native share API not supported")
  }

  await (navigator as any).share({
    title: data.title,
    text: data.text,
    url: data.url,
  })
  return true
}

export function shareViaWhatsApp(data: ShareData): boolean {
  const text = encodeURIComponent(`${data.title}\n\n${data.text}\n\n${data.url}`)
  const whatsappUrl = `https://wa.me/?text=${text}`
  if (typeof window !== "undefined") {
    window.open(whatsappUrl, "_blank")
  }
  return true
}

export function shareViaGmail(data: ShareData): boolean {
  const subject = encodeURIComponent(data.title)
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`)
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`
  if (typeof window !== "undefined") {
    window.open(gmailUrl, "_blank")
  }
  return true
}

export function shareViaEmail(data: ShareData): boolean {
  const subject = encodeURIComponent(data.title)
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`)
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
  if (typeof window !== "undefined") {
    window.location.href = mailtoUrl
  }
  return true
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else if (typeof document !== "undefined") {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)
      return successful
    }
    return false
  } catch (err) {
    console.error("Failed to copy:", err)
    return false
  }
}

export async function showShareDialog(data: ShareData): Promise<void> {
  await share(data, { method: "auto" })
}

// Backward-compatible exports for legacy callers
export const shareDocument = share
export function createSecureLink(url: string) {
  return url
}
