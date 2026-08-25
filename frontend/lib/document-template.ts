import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export interface DocumentTemplateConfig {
    title: string
    subtitle?: string
    content?: string
    sections?: Array<{
        heading: string
        content: string | string[]
    }>
    data?: { [key: string]: string | number }[]
    columns?: string[]
    footerText?: string
    companyName?: string
    companyLogoPath?: string
}

const COMPANY_NAME = "SIID - Smart Intelligent Integrated Design"
const BRANDING_COLOR: [number, number, number] = [59, 130, 246]
const TEXT_COLOR: [number, number, number] = [15, 23, 42]
const MUTED_COLOR: [number, number, number] = [100, 116, 139]
const ACCENT_COLOR: [number, number, number] = [244, 63, 94]

export function createDocumentHeader(doc: jsPDF, title: string, subtitle?: string) {
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFillColor(BRANDING_COLOR[0], BRANDING_COLOR[1], BRANDING_COLOR[2])
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("SIID", 15, 15)
    doc.setFontSize(8)
    doc.text("Smart Intelligent Integrated Design", 15, 22)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(title, pageWidth - 15, 15, { align: "right" })

    if (subtitle) {
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.text(subtitle, pageWidth - 15, 23, { align: "right" })
    }

    doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2])
    doc.setLineWidth(2)
    doc.line(0, 40, pageWidth, 40)
}

export function createDocumentFooter(doc: jsPDF, customText?: string) {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.5)
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15)

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(MUTED_COLOR[0], MUTED_COLOR[1], MUTED_COLOR[2])
    
    const text = customText || "Confidential - For Internal Use Only | " + COMPANY_NAME
    doc.text(text, 15, pageHeight - 8)

    const pageCount = (doc as any).internal.getNumberOfPages()
    const pageCurrent = (doc as any).internal.getCurrentPageInfo().pageNumber
    doc.text(`Page ${pageCurrent} of ${pageCount}`, pageWidth - 15, pageHeight - 8, { align: "right" })
}

export function generateBrandedDocument(config: DocumentTemplateConfig): jsPDF {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 50

    createDocumentHeader(doc, config.title, config.subtitle)

    if (config.content) {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2])

        const splitText = doc.splitTextToSize(config.content, pageWidth - 30)
        doc.text(splitText, 15, yPosition)
        yPosition += splitText.length * 5 + 10
    }

    if (config.sections && config.sections.length > 0) {
        for (const section of config.sections) {
            if (yPosition > 250) {
                doc.addPage()
                yPosition = 20
            }

            doc.setFontSize(12)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(BRANDING_COLOR[0], BRANDING_COLOR[1], BRANDING_COLOR[2])
            doc.text(section.heading, 15, yPosition)
            yPosition += 7

            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2])

            if (Array.isArray(section.content)) {
                for (const item of section.content) {
                    if (yPosition > 270) {
                        doc.addPage()
                        yPosition = 20
                    }
                    doc.text(`• ${item}`, 20, yPosition)
                    yPosition += 6
                }
                yPosition += 5
            } else {
                const splitContent = doc.splitTextToSize(section.content, pageWidth - 30)
                if (yPosition + splitContent.length * 5 > 270) {
                    doc.addPage()
                    yPosition = 20
                }
                doc.text(splitContent, 15, yPosition)
                yPosition += splitContent.length * 5 + 10
            }
        }
    }

    if (config.data && config.data.length > 0) {
        if (yPosition > 220) {
            doc.addPage()
            yPosition = 20
        }

        const columns = config.columns || Object.keys(config.data[0])
        const tableData = config.data.map((row) =>
            columns.map((col) => String(row[col] || "N/A"))
        )

        autoTable(doc, {
            startY: yPosition,
            head: [columns],
            body: tableData,
            theme: "grid",
            headStyles: {
                fillColor: BRANDING_COLOR,
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 10,
                halign: "center",
            },
            bodyStyles: {
                textColor: TEXT_COLOR,
                fontSize: 9,
            },
            alternateRowStyles: {
                fillColor: [244, 244, 245],
            },
            margin: { left: 15, right: 15 },
            didDrawPage: () => {
                createDocumentFooter(doc, config.footerText)
            },
        })
    } else {
        createDocumentFooter(doc, config.footerText)
    }

    return doc
}

export function downloadBrandedDocument(config: DocumentTemplateConfig, filename?: string) {
    const doc = generateBrandedDocument(config)
    const name = filename || `${config.title.toLowerCase().replace(/\s+/g, "_")}.pdf`
    doc.save(name)
}

export const generateProfessionalDocument = generateBrandedDocument

export function exportAsBeautifulPDF(filenameOrTitle: any, title?: string, data?: any, options?: any) {
  if (typeof filenameOrTitle === "object" && filenameOrTitle.title) {
    downloadBrandedDocument(filenameOrTitle, title)
  } else {
    const config: DocumentTemplateConfig = {
      title: title || String(filenameOrTitle),
      data: Array.isArray(data) ? data : undefined,
      subtitle: options?.subtitle,
      columns: options?.columns,
      sections: options?.sections,
    }
    const name = typeof filenameOrTitle === "string" ? filenameOrTitle : `${config.title.toLowerCase().replace(/\s+/g, "_")}.pdf`
    downloadBrandedDocument(config, name.endsWith(".pdf") ? name : `${name}.pdf`)
  }
}

export function addSection(doc: jsPDF, yPosition: number, heading: string, content: string | string[], pageWidth?: number, pageHeight?: number): number {
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(BRANDING_COLOR[0], BRANDING_COLOR[1], BRANDING_COLOR[2])
  doc.text(heading, 15, yPosition)
  let y = yPosition + 7

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2])

  if (Array.isArray(content)) {
    for (const item of content) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(`• ${item}`, 20, y)
      y += 6
    }
    y += 5
  } else {
    const splitContent = doc.splitTextToSize(content, (pageWidth || 210) - 30)
    if (y + splitContent.length * 5 > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(splitContent, 15, y)
    y += splitContent.length * 5 + 10
  }
  return y
}

export function addDataTable(doc: jsPDF, yPosition: number, data: any[], columns?: string[], pageHeight?: number): number {
  if (!data || data.length === 0) return yPosition
  const cols = columns || Object.keys(data[0] || {})
  const tableData = data.map((row) => cols.map((col) => String(row[col] || "N/A")))

  autoTable(doc, {
    startY: yPosition,
    head: [cols],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: BRANDING_COLOR, textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 15, right: 15 },
  })
  return (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : yPosition + 40
}

export function addInfoBox(doc: jsPDF, yPosition: number, details: Record<string, any>, pageWidth?: number, pageHeight?: number): number {
  doc.setFontSize(10)
  let y = yPosition
  Object.entries(details).forEach(([key, val]) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setFont("helvetica", "bold")
    doc.text(`${key}:`, 15, y)
    doc.setFont("helvetica", "normal")
    doc.text(String(val || "N/A"), 65, y)
    y += 6
  })
  return y + 5
}
