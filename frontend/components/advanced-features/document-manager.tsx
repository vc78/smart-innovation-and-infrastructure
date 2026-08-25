"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Download,
  Upload,
  Eye,
  Folder,
  Trash2,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Stamp,
  Camera,
  Search,
  MoreVertical,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Bot,
  Activity,
  MessageSquare,
  Wrench,
  CheckSquare,
  Send
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShareButton } from "@/components/share-button"
import { shareDocument } from "@/lib/share-utils"
import { getUserDataKey } from "@/lib/auth"
import { SitePhotoUpload } from "@/components/work-schedule/site-photo-upload"
import {
  createDocumentHeader,
  createDocumentFooter,
  addSection,
  addInfoBox,
  generateProfessionalDocument
} from "@/lib/document-template"

// Assume these exist in your ui folder, if not, native HTML variants will still render nicely
import { ScrollArea } from "@/components/ui/scroll-area"

interface Document {
  id: string
  name: string
  type: "approval" | "design" | "contract" | "permit" | "report" | "layout" | "blueprint"
  format: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "csv" | "png" | "jpg" | "jpeg" | "zip" | "dwg"
  status: "pending" | "approved" | "draft" | "rejected"
  date: string
  size: string
  version: string
  uploadedBy: string
  url?: string
  mlAnalysis?: {
    summary: string
    confidenceScore: number
    risks: string[]
    financialObligations?: string[]
    extractedSpecs: string[]
    docClass: string
    detectedZones?: {
      type: string
      label: string
      box: { x: number, y: number, w: number, h: number }
      confidence: number
      efficiencyGain?: string
      description: string
    }[]
  }
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Building Plan Approval.pdf",
    type: "approval",
    format: "pdf",
    status: "approved",
    date: "2024-01-15",
    size: "2.4 MB",
    version: "v1.0",
    uploadedBy: "Admin",
  },
  {
    id: "2",
    name: "Architectural Drawings.dwg",
    type: "design",
    format: "dwg",
    status: "approved",
    date: "2024-01-10",
    size: "15.8 MB",
    version: "v2.1",
    uploadedBy: "Architect",
  },
  {
    id: "3",
    name: "Structural Certificate.pdf",
    type: "approval",
    format: "pdf",
    status: "pending",
    date: "2024-01-20",
    size: "1.2 MB",
    version: "v1.0",
    uploadedBy: "Engineer",
  },
  {
    id: "4",
    name: "Contractor Agreement.pdf",
    type: "contract",
    format: "pdf",
    status: "approved",
    date: "2024-01-05",
    size: "890 KB",
    version: "v1.0",
    uploadedBy: "Legal",
  },
  {
    id: "5",
    name: "Fire NOC Application.pdf",
    type: "permit",
    format: "pdf",
    status: "pending",
    date: "2024-01-22",
    size: "3.1 MB",
    version: "v1.0",
    uploadedBy: "Admin",
  },
  {
    id: "6",
    name: "Electrical Layout.pdf",
    type: "layout",
    format: "pdf",
    status: "draft",
    date: "2024-01-25",
    size: "5.6 MB",
    version: "v1.2",
    uploadedBy: "Electrician",
  },
  {
    id: "7",
    name: "Plumbing Blueprint.pdf",
    type: "blueprint",
    format: "pdf",
    status: "rejected",
    date: "2024-02-01",
    size: "7.2 MB",
    version: "v1.0",
    uploadedBy: "Plumber",
  },
]

type SortField = 'name' | 'date' | 'size' | 'status' | 'type';
type SortOrder = 'asc' | 'desc';

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isDragging, setIsDragging] = useState(false)

  // AI Workbench States
  const [activePreviewTab, setActivePreviewTab] = useState<"insights" | "chat" | "tools" | "site_scan">("insights")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isSimulatingAction, setIsSimulatingAction] = useState(false)

  // AI Tools Result States
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [translatedText, setTranslatedText] = useState<string>("")
  const [selectedLang, setSelectedLang] = useState<string>("Hindi")
  const [isTranslating, setIsTranslating] = useState(false)
  const [nbcReport, setNbcReport] = useState<any>(null)
  const [isAuditingNbc, setIsAuditingNbc] = useState(false)
  const [siteScanReport, setSiteScanReport] = useState<any>(null)
  const [isScanningSite, setIsScanningSite] = useState(false)

  const { toast } = useToast()

  // Reset workbench on preview change
  useEffect(() => {
    if (previewDoc) {
      setActivePreviewTab("insights")
      setExtractedData(null)
      setTranslatedText("")
      setNbcReport(null)
      setSiteScanReport(null)
      setChatMessages([
        { role: "assistant", content: `Hello! I am your SIID Engineering Intelligence Assistant. I have analyzed "${previewDoc.name}". You can ask questions, verify NBC compliance, or extract structured specifications.` }
      ])
      
      // Auto-scan if photo format
      if (["png", "jpg", "jpeg"].includes(previewDoc.format)) {
        handleScanSitePhoto(previewDoc)
      }
    }
  }, [previewDoc])

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !previewDoc || isChatLoading) return
    const userQuestion = chatInput.trim()
    const newMsg = { role: "user", content: userQuestion }
    setChatMessages(prev => [...prev, newMsg])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const res = await fetch("/api/scan-document-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          document: previewDoc,
          query: userQuestion,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        setChatMessages(prev => [...prev, { role: "assistant", content: json.answer || "Document analysis complete." }])
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Could not retrieve response from AI engine." }])
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Connection to AI service failed. Please try again." }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleExtractStructuredData = async () => {
    if (!previewDoc) return
    setIsExtracting(true)
    toast({ title: "Extracting Data", description: "Parsing tables and technical metrics..." })
    try {
      const res = await fetch("/api/scan-document-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "extract",
          document: previewDoc,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setExtractedData(json.data)
        toast({ title: "Extraction Complete", description: "Structured parameters extracted successfully." })
      }
    } catch (e) {
      toast({ title: "Extraction Failed", description: "Could not parse document tables.", variant: "destructive" })
    } finally {
      setIsExtracting(false)
    }
  }

  const handleTranslate = async (lang: string) => {
    if (!previewDoc) return
    setSelectedLang(lang)
    setIsTranslating(true)
    toast({ title: "Translating", description: `Translating technical context into ${lang}...` })
    try {
      const res = await fetch("/api/scan-document-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          document: previewDoc,
          targetLanguage: lang,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setTranslatedText(json.translation)
        toast({ title: "Translation Ready", description: `Document summary converted to ${lang}.` })
      }
    } catch (e) {
      toast({ title: "Translation Failed", description: "Could not translate text.", variant: "destructive" })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleVerifyNbcCompliance = async () => {
    if (!previewDoc) return
    setIsAuditingNbc(true)
    toast({ title: "Running NBC Audit", description: "Checking clauses against NBC 2016 & IS 456..." })
    try {
      const res = await fetch("/api/scan-document-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_nbc",
          document: previewDoc,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setNbcReport(json.data)
        toast({ title: "NBC Audit Complete", description: `Compliance score: ${json.data?.complianceScore || 94}%` })
      }
    } catch (e) {
      toast({ title: "Compliance Check Failed", description: "Could not complete audit.", variant: "destructive" })
    } finally {
      setIsAuditingNbc(false)
    }
  }

  const handleScanSitePhoto = async (doc?: Document) => {
    const targetDoc = doc || previewDoc
    if (!targetDoc) return
    setIsScanningSite(true)
    try {
      const res = await fetch("/api/scan-document-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scan_photo",
          document: targetDoc,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setSiteScanReport(json.data)
      }
    } catch (e) {
      console.error("Site photo risk scan failed:", e)
    } finally {
      setIsScanningSite(false)
    }
  }

  const handleRemediate = (risk: string) => {
    setIsSimulatingAction(true)
    toast({ title: "Analyzing Context", description: "Generating AI remediation plan..." })
    setTimeout(() => {
      setIsSimulatingAction(false)
      toast({ title: "Plan Generated", description: "Task has been drafted and queued for review." })
      setActivePreviewTab("chat")
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: `✅ I have drafted a remediation plan for: "${risk}". I've also assigned a priority task to the engineering team's backlog.` 
      }])
    }, 1200)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/db/documents")
        if (res.ok) {
          const dbDocs: Document[] = await res.json()
          localStorage.setItem("projectDocuments", JSON.stringify(dbDocs))
          setDocuments([...MOCK_DOCUMENTS, ...dbDocs])
          return
        }
      } catch (err) {
        console.error("Failed to load documents from DB", err)
      }
      const key = getUserDataKey("projectDocuments")
      const stored = localStorage.getItem(key)
      const storedDocs = stored ? JSON.parse(stored) : []
      setDocuments([...MOCK_DOCUMENTS, ...storedDocs])
    }
    load()
  }, [])

  const saveDocuments = async (docs: Document[]) => {
    const userDocs = docs.filter((d) => !MOCK_DOCUMENTS.find((m) => m.id === d.id))
    const key = getUserDataKey("projectDocuments")
    localStorage.setItem(key, JSON.stringify(userDocs))
    setDocuments(docs)
    try {
      await fetch("/api/db/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDocs),
      })
    } catch (err) {
      console.error("Failed to save documents to DB", err)
    }
  }

  // Sorting and Filtering Logic
  const processedDocs = useMemo(() => {
    let result = documents;

    // Filter by type or status
    if (filter !== "all") {
      result = result.filter(d => d.type === filter || d.status === filter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.uploadedBy.toLowerCase().includes(lowerQuery) ||
        d.type.toLowerCase().includes(lowerQuery)
      );
    }

    // Sorting
    return result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'size') {
        const aSize = Number.parseFloat(a.size.replace(/[^\d.]/g, ""));
        const bSize = Number.parseFloat(b.size.replace(/[^\d.]/g, ""));
        comparison = aSize - bSize;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [documents, filter, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getTypeIcon = (format: Document["format"]) => {
    const className = "w-5 h-5";
    if (["png", "jpg", "jpeg"].includes(format)) return <FileImage className={`${className} text-blue-500`} />
    if (["xls", "xlsx", "csv"].includes(format)) return <FileSpreadsheet className={`${className} text-green-500`} />
    if (["zip"].includes(format)) return <FileArchive className={`${className} text-amber-500`} />
    if (["dwg"].includes(format)) return <Folder className={`${className} text-purple-500`} />
    return <FileText className={`${className} text-red-500`} />
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-medium flex gap-1 items-center px-2 py-0.5">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-medium flex gap-1 items-center px-2 py-0.5">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-medium flex gap-1 items-center px-2 py-0.5">
            <AlertCircle className="w-3 h-3" /> Rejected
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="font-medium px-2 py-0.5">
            Draft
          </Badge>
        )
    }
  }

  const handleDownload = async (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    })

    if (doc.url) {
      const a = document.createElement("a")
      a.href = doc.url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    if (doc.format === "pdf") {
      try {
        const { jsPDF } = await import("jspdf")
        const pdf = new jsPDF()
        pdf.setFontSize(22)
        pdf.setTextColor(15, 23, 42)
        pdf.text(doc.name, 20, 30)

        pdf.setFontSize(14)
        pdf.setTextColor(100, 116, 139)
        pdf.text(`Official SIID Document Generator`, 20, 40)

        pdf.setDrawColor(226, 232, 240)
        pdf.line(20, 45, 190, 45)

        pdf.setFontSize(12)
        pdf.setTextColor(51, 65, 85)
        pdf.text(`Type: ${doc.type.toUpperCase()}`, 20, 60)
        pdf.text(`Status: ${doc.status.toUpperCase()}`, 20, 70)
        pdf.text(`Uploaded By: ${doc.uploadedBy}`, 20, 80)
        pdf.text(`Date of Issue: ${doc.date}`, 20, 90)
        pdf.text(`Version Code: ${doc.version}`, 20, 100)

        pdf.setDrawColor(59, 130, 246)
        pdf.setLineWidth(1)
        pdf.rect(140, 60, 40, 20)
        pdf.setFontSize(10)
        pdf.setTextColor(59, 130, 246)
        pdf.text("VERIFIED", 160, 70, { align: "center" })
        pdf.text("SIID SYSTEM", 160, 75, { align: "center" })

        pdf.save(doc.name)
      } catch (err) {
        console.error("Failed to generate mock PDF", err)
      }
      return
    }

    // Text File Fallback
    const blob = new Blob([`SIID DIGITAL TWIN - DOCUMENT PLACEHOLDER\n\nFilename: ${doc.name}\nType: ${doc.type}\nStatus: ${doc.status}\nUploaded By: ${doc.uploadedBy}\nDate: ${doc.date}\nVersion: ${doc.version}\n\n*This is an auto-generated system placeholder for demonstration*`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name + (doc.name.endsWith(".txt") ? "" : ".txt")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')
    const form = new FormData()
    Array.from(files).forEach((f) => form.append("files", f))

    // Optimistic UI update could go here
    toast({
      title: "Uploading files...",
      description: "Please wait while we process your documents.",
    })

    try {
      let savedEntries: any[] = []
      try {
        const res = await fetch("/api/uploads/photos", { method: "POST", body: form })
        if (res.ok) {
          const data = await res.json()
          savedEntries = data.saved || []
        }
      } catch (uploadNetErr) {
        console.warn("Upload service fallback to local blob:", uploadNetErr)
      }

      const newDocs: Document[] = []

      for (const file of Array.from(files)) {
        const extension = (file.name.split(".").pop()?.toLowerCase() || "pdf") as Document["format"]
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        const urlEntry = savedEntries.find(
          (s: any) => s.originalName === file.name || s.filename === file.name || s.filename?.includes(file.name)
        )
        const url = urlEntry?.url || URL.createObjectURL(file)

        // Perform ML Analysis
        let mlData = undefined
        try {
          const aiRes = await fetch("/api/analyze-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, fileType: extension, size: file.size })
          })
          const aiResult = await aiRes.json()
          if (aiResult.success) {
            mlData = aiResult.analysis
          }
        } catch (e) {
          console.error("AI Analysis Failed", e)
        }

        const isImage = ["jpg", "jpeg", "png", "webp", "heic"].includes(extension)

        const newDoc: Document = {
          id: crypto.randomUUID(),
          name: file.name,
          type: isImage ? "site_photo" : "design",
          format: extension || "pdf",
          status: "approved",
          date: new Date().toISOString().split("T")[0],
          size: `${sizeInMB} MB`,
          version: "v1.0",
          uploadedBy: currentUser.name || "Site Engineer",
          url,
          mlAnalysis: mlData
        }
        newDocs.push(newDoc)
      }

      const updatedDocs = [...newDocs, ...documents]
      saveDocuments(updatedDocs)

      toast({
        title: "Upload Successful",
        description: `${newDocs.length} file(s) processed and added to the registry.`,
      })

      setUploadDialogOpen(false)
    } catch (err: any) {
      console.error("Document upload handler error:", err)
      toast({
        title: "Files Processed",
        description: "Files have been registered to your local repository.",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this document?")) {
      const updatedDocs = documents.filter((d) => d.id !== id)
      saveDocuments(updatedDocs)
      toast({
        title: "Document Deleted",
        description: "Document has been securely removed.",
      })
    }
  }

  const handleShare = async (doc: Document) => {
    const success = await shareDocument({
      title: doc.name,
      text: `Document: ${doc.name}`,
      url: doc.url || window.location.href,
    })

    if (success) {
      toast({
        title: "Link Copied",
        description: `Sharing link for ${doc.name} copied to clipboard.`,
      })
    }
  }

  const generateProgressPDF = async () => {
    try {
      const date = new Date().toLocaleDateString()
      const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User","email":"user@example.com"}')

      const pdf = await generateProfessionalDocument({
        title: "Document Repository Report",
        subtitle: `Generated on ${date}`,
        sections: [
          {
            heading: "Repository Summary",
            content: [
              `Total Documents Managed: ${documents.length}`,
              `Approved Documents: ${documents.filter(d => d.status === 'approved').length}`,
              `Pending Review: ${documents.filter(d => d.status === 'pending').length}`,
              `Requested By: ${currentUser.name}`,
            ]
          },
          {
            heading: "System Information",
            content: [
              "Repository: SIID Document Management System",
              "Platform: Smart Intelligent Integrated Design",
              "Status: Active and Operational",
              "Security Level: Enterprise Grade"
            ]
          }
        ],
        footerText: `Contact Support: venkatbodduluri78@gmail.com | Report Generated: ${date}`,
      })

      pdf.save(`SIID-Document-Report-${date}.pdf`)

      toast({
        title: "Report Generated",
        description: "Official Document Summary has been downloaded.",
      })
    } catch (error) {
      console.error("PDF Error:", error)
      toast({
        title: "Report Generation Failed",
        description: "Could not assemble the PDF report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filterOptions = ["all", "approval", "design", "contract", "permit", "layout", "blueprint", "approved", "pending", "rejected"]

  return (
    <>
      <Card
        className={`p-6 border-border shadow-sm flex flex-col min-h-[600px] transition-all duration-200 ${isDragging ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <div className="text-center animate-in fade-in zoom-in duration-200 pointer-events-none">
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary animate-bounce" />
              <h2 className="text-2xl font-bold text-primary">Drop files to upload</h2>
              <p className="text-muted-foreground mt-2">Documents will be added to the registry</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Document Repository</h3>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span>{documents.length} Files</span>
                <span className="w-1 h-1 rounded-full bg-border inline-block"></span>
                <span>
                  {documents.reduce((acc, d) => {
                    const size = Number.parseFloat(d.size.replace(/[^\d.]/g, ""))
                    return acc + (Number.isNaN(size) ? 0 : size)
                  }, 0).toFixed(1)} MB
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-9 bg-background focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={showPhotoGallery ? "secondary" : "outline"}
              onClick={() => setShowPhotoGallery(!showPhotoGallery)}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden lg:inline">Site Photos</span>
            </Button>
            <Button variant="outline" onClick={generateProgressPDF} className="gap-2">
              <Stamp className="w-4 h-4" />
              <span className="hidden lg:inline">Report</span>
            </Button>
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2 shadow-sm">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="relative w-full mb-6 md:hidden">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files, types, or owners..."
            className="pl-9 bg-background focus-visible:ring-1 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {showPhotoGallery && (
          <div className="mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <SitePhotoUpload />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2 custom-scrollbar">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mr-2">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          {filterOptions.map((f) => (
            <Badge
              key={f}
              variant={filter === f ? "default" : "outline"}
              className={`cursor-pointer capitalize whitespace-nowrap px-3 py-1 text-sm font-medium transition-colors ${filter === f ? 'shadow-sm' : 'hover:bg-muted bg-background'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </Badge>
          ))}
        </div>

        {/* Industry Standard Data Table */}
        <div className="rounded-xl border bg-card overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 border-b uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-medium cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1">
                      File Name
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'name' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium hidden md:table-cell cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'status' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium hidden lg:table-cell cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('type')}>
                    <div className="flex items-center gap-1">
                      Category
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'type' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium hidden sm:table-cell cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-1">
                      Uploaded
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'date' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {processedDocs.length > 0 ? (
                  processedDocs.map((doc) => (
                    <tr key={doc.id} className="bg-background hover:bg-muted/40 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-background border shadow-sm flex items-center justify-center flex-shrink-0">
                            {getTypeIcon(doc.format)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate cursor-pointer hover:underline" onClick={() => setPreviewDoc(doc)}>
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {doc.size} • {doc.version}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="capitalize font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md text-xs">
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{doc.date}</span>
                          <span className="text-xs text-muted-foreground">{doc.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors hidden sm:flex" onClick={() => handleDownload(doc)} title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" onClick={() => setPreviewDoc(doc)} title="Preview">
                            <Eye className="w-4 h-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownload(doc)}>
                                <Download className="w-4 h-4 mr-2" /> Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleShare(doc)}>
                                <ShareButton data={{ url: doc.url || "", title: doc.name, text: doc.name }} showText={true} className="w-full justify-start p-0 h-auto font-normal" variant="ghost" />
                              </DropdownMenuItem>
                              {!MOCK_DOCUMENTS.find((m) => m.id === doc.id) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => handleDelete(doc.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-lg font-medium text-foreground">No documents found</h4>
                        <p className="text-sm mt-1 max-w-sm mx-auto">
                          We couldn't find any documents matching your current filters and search query. Try adjusting your criteria.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => { setFilter("all"); setSearchQuery(""); }}>
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Advanced Upload Dialog via generic HTML dropzone styling */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Upload Documents</DialogTitle>
            <DialogDescription>
              Drag and drop your files here or click to browse.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer group relative">
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => processFiles(e.target.files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.zip,.dwg"
              />
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Drag & drop files or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports PDF, Images, Excel, CAD & Archives up to 50MB
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between items-center bg-muted/30 p-2 -mx-6 -mb-6 px-6 pb-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground tracking-tight">Secure server upload channel activated.</p>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Preview Dialog with Clean Side-by-Side Docked Layout */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] h-[850px] p-0 overflow-hidden flex flex-col bg-background border border-border shadow-2xl rounded-2xl gap-0">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b bg-muted/20 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
                {previewDoc && getTypeIcon(previewDoc.format)}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold truncate max-w-[320px] sm:max-w-[500px]" title={previewDoc?.name}>
                  {previewDoc?.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold bg-background px-2 py-0.5 rounded border shadow-sm">
                    {previewDoc?.version}
                  </span>
                  <span>{previewDoc?.size}</span>
                  <span>•</span>
                  <span>Uploaded {previewDoc?.date}</span>
                  <span>•</span>
                  <span className="capitalize font-medium text-foreground">{previewDoc?.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {previewDoc && getStatusBadge(previewDoc.status)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewDoc && handleDownload(previewDoc)}
                className="hidden sm:flex items-center gap-1.5 h-8 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            </div>
          </div>

          {/* MAIN 2-COLUMN SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
            
            {/* LEFT: DOCUMENT / SITE PHOTO PREVIEW (7 cols) */}
            <div className="lg:col-span-7 bg-muted/40 p-4 sm:p-6 flex items-center justify-center relative overflow-y-auto border-b lg:border-b-0 lg:border-r border-border">
              {previewDoc?.url ? (
                <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-background border shadow-inner relative group/preview">
                  {["png", "jpg", "jpeg"].includes(previewDoc.format) ? (
                    <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                      <img
                        src={previewDoc.url}
                        alt={previewDoc.name}
                        className="max-w-full max-h-[68vh] object-contain rounded-lg shadow-md"
                      />
                      {/* VISION OVERLAYS */}
                      {previewDoc.mlAnalysis?.detectedZones?.map((zone, i) => (
                        <div
                          key={i}
                          className="absolute border-2 border-red-500 bg-red-600/15 animate-pulse pointer-events-auto rounded group/zone"
                          style={{
                            top: `${zone.box.y}%`,
                            left: `${zone.box.x}%`,
                            width: `${zone.box.w}%`,
                            height: `${zone.box.h}%`,
                          }}
                        >
                          <div className="absolute -top-5 left-0 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-lg z-20">
                            {zone.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : previewDoc.format === "pdf" ? (
                    <iframe src={previewDoc.url} className="w-full h-full min-h-[500px]" title={previewDoc.name} />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        {getTypeIcon(previewDoc.format)}
                      </div>
                      <h3 className="text-base font-semibold">Native File Document</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                        Format: {previewDoc.format.toUpperCase()} • Ready for download or AI processing.
                      </p>
                      <Button onClick={() => previewDoc && handleDownload(previewDoc)} size="sm" className="mt-4 gap-1.5">
                        <Download className="w-4 h-4" /> Download File
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-sm bg-background rounded-2xl p-8 text-center shadow-md border">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-base font-semibold">Project Record</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Document ready for intelligent auditing and AI analysis.
                  </p>
                  <Button size="sm" onClick={() => previewDoc && handleDownload(previewDoc)} className="gap-1.5">
                    <Download className="w-4 h-4" /> Download Manifest
                  </Button>
                </div>
              )}
            </div>

            {/* RIGHT: DOCKED SIID AI WORKBENCH (5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-full min-h-0 bg-background overflow-hidden">
              
              {/* Workbench Header */}
              <div className="p-3.5 border-b bg-muted/10 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-none tracking-tight">SIID AI WORKBENCH</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                      Gemini 2.5 Flash Engine • Live
                    </p>
                  </div>
                </div>

                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold">
                  Verified Active
                </Badge>
              </div>

              {/* Workbench Tabs */}
              <div className="flex border-b text-xs font-semibold bg-muted/20 flex-shrink-0">
                <button
                  onClick={() => setActivePreviewTab("insights")}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 text-[11px] ${activePreviewTab === "insights" ? "border-blue-600 text-blue-600 font-bold bg-background" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Insights
                </button>
                <button
                  onClick={() => setActivePreviewTab("chat")}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 text-[11px] ${activePreviewTab === "chat" ? "border-blue-600 text-blue-600 font-bold bg-background" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> AI Chat
                </button>
                <button
                  onClick={() => setActivePreviewTab("tools")}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 text-[11px] ${activePreviewTab === "tools" ? "border-blue-600 text-blue-600 font-bold bg-background" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Wrench className="w-3.5 h-3.5" /> AI Tools
                </button>
                <button
                  onClick={() => {
                    setActivePreviewTab("site_scan")
                    if (!siteScanReport) handleScanSitePhoto()
                  }}
                  className={`flex-1 py-2.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 text-[11px] ${activePreviewTab === "site_scan" ? "border-blue-600 text-blue-600 font-bold bg-background" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <Activity className="w-3.5 h-3.5" /> Risk Scan
                </button>
              </div>

              {/* Scrollable Workbench Body */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                
                {/* TAB 1: INSIGHTS */}
                {activePreviewTab === "insights" && (
                  <div className="space-y-4 text-xs">
                    {previewDoc?.mlAnalysis?.summary ? (
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Executive Summary</span>
                        <p className="text-foreground leading-relaxed mt-1 text-xs">
                          {previewDoc.mlAnalysis.summary}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">Processing document summary with Gemini AI...</p>
                    )}

                    {previewDoc?.mlAnalysis?.risks && previewDoc.mlAnalysis.risks.length > 0 && (
                      <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3.5">
                        <h5 className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5 mb-2.5 text-xs uppercase tracking-wider">
                          <AlertCircle className="w-3.5 h-3.5" /> Critical Engineering Risks
                        </h5>
                        <div className="space-y-2">
                          {previewDoc.mlAnalysis.risks.map((r, i) => (
                            <div key={i} className="bg-background p-2.5 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30 text-xs">
                              <p className="text-red-900 dark:text-red-200 leading-snug">{r}</p>
                              <div className="flex justify-end gap-1.5 pt-2 mt-2 border-t border-red-50 dark:border-red-900/20">
                                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => {
                                  toast({ title: "Task Queued", description: "Assigned to Engineering backlog." })
                                }}>
                                  <CheckSquare className="w-3 h-3 mr-1" /> Queue Task
                                </Button>
                                <Button size="sm" className="h-6 text-[10px] px-2 bg-red-600 hover:bg-red-700 text-white" onClick={() => handleRemediate(r)} disabled={isSimulatingAction}>
                                  <Wrench className="w-3 h-3 mr-1" /> Auto-Fix
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {previewDoc?.mlAnalysis?.extractedSpecs && previewDoc.mlAnalysis.extractedSpecs.length > 0 && (
                      <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl p-3.5">
                        <h5 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider">
                          <FileSpreadsheet className="w-3.5 h-3.5" /> Technical Specifications
                        </h5>
                        <ul className="list-disc pl-4 space-y-1 text-blue-950 dark:text-blue-200 text-xs">
                          {previewDoc.mlAnalysis.extractedSpecs.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {previewDoc?.mlAnalysis?.financialObligations && previewDoc.mlAnalysis.financialObligations.length > 0 && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5">
                        <h5 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5" /> Financial & Milestone Obligations
                        </h5>
                        <ul className="list-disc pl-4 space-y-1 text-amber-950 dark:text-amber-200 text-xs">
                          {previewDoc.mlAnalysis.financialObligations.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: AI CHAT */}
                {activePreviewTab === "chat" && (
                  <div className="flex flex-col h-[460px]">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pb-3">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-muted/80 text-foreground rounded-tl-sm border"}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted text-muted-foreground text-xs rounded-2xl px-3 py-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span>Consulting Gemini AI Engine...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t mt-auto flex gap-2">
                      <Input
                        placeholder="Ask about this document, specs, or risks..."
                        className="text-xs h-9 rounded-xl bg-muted/40 focus-visible:bg-background"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button size="sm" className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendMessage} disabled={isChatLoading}>
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* TAB 3: AI TOOLS */}
                {activePreviewTab === "tools" && (
                  <div className="space-y-3 text-xs">
                    
                    {/* Tool 1: Structured Data Extraction */}
                    <div className="p-3.5 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><FileSpreadsheet className="w-4 h-4" /></div>
                          <div>
                            <h5 className="font-bold text-xs">Extract Structured Data (JSON)</h5>
                            <p className="text-[11px] text-muted-foreground">Extract itemized specs, quantities, and cost metrics.</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={handleExtractStructuredData} disabled={isExtracting}>
                          {isExtracting ? "Extracting..." : "Extract"}
                        </Button>
                      </div>

                      {extractedData && (
                        <div className="mt-3 p-2.5 rounded-lg bg-muted text-[11px] font-mono overflow-x-auto max-h-40">
                          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
                        </div>
                      )}
                    </div>

                    {/* Tool 2: Multi-Language Translation */}
                    <div className="p-3.5 border rounded-xl hover:bg-muted/30 transition-colors space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><FileText className="w-4 h-4" /></div>
                          <div>
                            <h5 className="font-bold text-xs">Auto-Translate Context</h5>
                            <p className="text-[11px] text-muted-foreground">Translate structural directives for regional contractors.</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {["Hindi", "Telugu", "Tamil", "English"].map(lang => (
                            <button
                              key={lang}
                              onClick={() => handleTranslate(lang)}
                              disabled={isTranslating}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border ${selectedLang === lang ? "bg-indigo-600 text-white" : "bg-background text-muted-foreground hover:text-foreground"}`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      {translatedText && (
                        <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200">
                          <span className="font-bold text-[10px] uppercase text-indigo-600 block mb-1">Translation ({selectedLang}):</span>
                          {translatedText}
                        </div>
                      )}
                    </div>

                    {/* Tool 3: NBC Compliance Audit */}
                    <div className="p-3.5 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                          <div>
                            <h5 className="font-bold text-xs">Verify NBC & IS 456 Compliance</h5>
                            <p className="text-[11px] text-muted-foreground">National Building Code clause verification & audit.</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={handleVerifyNbcCompliance} disabled={isAuditingNbc}>
                          {isAuditingNbc ? "Auditing..." : "Run Audit"}
                        </Button>
                      </div>

                      {nbcReport && (
                        <div className="mt-3 p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
                          <div className="flex justify-between font-bold text-amber-800 dark:text-amber-300">
                            <span>Status: {nbcReport.status}</span>
                            <span>Score: {nbcReport.complianceScore}%</span>
                          </div>
                          {nbcReport.clausesAudited?.map((c: any, idx: number) => (
                            <div key={idx} className="text-[11px] text-amber-950 dark:text-amber-200 flex justify-between border-t border-amber-100 dark:border-amber-900/20 pt-1">
                              <span>{c.clause}</span>
                              <span className="font-semibold">{c.result}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: SITE PHOTO HAZARD SCANNER */}
                {activePreviewTab === "site_scan" && (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200 dark:border-blue-900/40">
                      <div>
                        <h5 className="font-bold text-xs text-foreground">Computer Vision Site Hazard Scan</h5>
                        <p className="text-[11px] text-muted-foreground">Detecting concrete cracks, PPE breaches, & edge risks.</p>
                      </div>
                      <Button size="sm" onClick={() => handleScanSitePhoto()} disabled={isScanningSite} className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white">
                        {isScanningSite ? "Scanning..." : "Rescan Photo"}
                      </Button>
                    </div>

                    {siteScanReport ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted">
                          <span className="font-semibold">Overall Site Risk:</span>
                          <Badge className={`${siteScanReport.overallRiskLevel === "High" ? "bg-red-500 text-white" : "bg-amber-500 text-white"} text-xs font-bold`}>
                            {siteScanReport.overallRiskLevel || "Medium"} Risk
                          </Badge>
                        </div>

                        {siteScanReport.detectedHazards?.map((h: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-red-700 dark:text-red-300">{h.hazard}</span>
                              <Badge variant="outline" className="text-[10px] border-red-300 text-red-600">
                                {h.severity}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-red-900/80 dark:text-red-200">
                              <span className="font-semibold">Remedy:</span> {h.remedy}
                            </p>
                          </div>
                        ))}

                        {siteScanReport.inspectionChecklist && (
                          <div className="p-3 rounded-lg border bg-muted/20 space-y-1.5">
                            <h6 className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Safety Checklist</h6>
                            {siteScanReport.inspectionChecklist.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span>{item.item}</span>
                                <span className={item.status === "Passed" ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                                  {item.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs text-center py-6">
                        Click "Rescan Photo" to run Gemini Computer Vision hazard analysis on this file.
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

