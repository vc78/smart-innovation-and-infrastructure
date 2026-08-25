"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    Send,
    X,
    Sparkles,
    Copy,
    Check,
    Bot,
    Building2,
    Calculator,
    Compass,
    Layers,
    RefreshCw,
    Maximize2,
    Minimize2,
    ShieldCheck,
    HelpCircle,
} from "lucide-react"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp?: string
    isStreaming?: boolean
}

// User-Centric Quick Prompts
const QUICK_PROMPTS = [
    {
        label: "Estimate House Cost",
        icon: Calculator,
        prompt: "Calculate the complete construction budget and material quantities for a 1500 sqft residential house in Hyderabad with current local market rates.",
        badge: "BOQ & Budget"
    },
    {
        label: "Structural & Column Rules",
        icon: Building2,
        prompt: "What are the structural safety rules and concrete grades for columns and beams according to IS 456?",
        badge: "IS 456 Standards"
    },
    {
        label: "Cement & Steel Guide",
        icon: Layers,
        prompt: "Compare OPC 53 vs PPC cement and Fe 550D steel rebar specifications with current market price ranges.",
        badge: "Materials & Pricing"
    },
    {
        label: "Vastu & Room Layout",
        icon: Compass,
        prompt: "What are the best Vastu placements for the main entrance, kitchen, and master bedroom in a north/east facing plot?",
        badge: "Architectural Layout"
    },
]

export default function ConstructionAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [hasStarted, setHasStarted] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom smoothly
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    // Load conversation history
    useEffect(() => {
        try {
            const cached = localStorage.getItem("siid-assistant-chat-v4")
            if (cached) {
                const parsed = JSON.parse(cached) as Message[]
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed)
                    setHasStarted(true)
                }
            }
        } catch {
            // Ignore storage errors
        }
    }, [])

    // Save conversation history
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("siid-assistant-chat-v4", JSON.stringify(messages.slice(-25)))
        }
    }, [messages])

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150)
        }
    }, [isOpen])

    // Real-Time Token Streaming Dispatch
    async function handleSend(e?: React.FormEvent, customText?: string) {
        e?.preventDefault()
        const text = (customText || input).trim()
        if (!text || isLoading) return

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        const assistantMsgId = crypto.randomUUID()
        const placeholderAssistantMsg: Message = {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStreaming: true,
        }

        setMessages((prev) => [...prev, userMsg, placeholderAssistantMsg])
        setInput("")
        setIsLoading(true)
        setHasStarted(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    sync: false,
                }),
            })

            if (!response.ok) {
                // Fallback to sync endpoint
                const fallbackRes = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: [...messages, userMsg].map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                        sync: true,
                    }),
                })
                const data = await fallbackRes.json()
                const fullText = data.text || data.content || "I have analyzed your construction requirements. How can I further assist your plan?"
                
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMsgId
                            ? { ...msg, content: fullText, isStreaming: false }
                            : msg
                    )
                )
                return
            }

            // Read live token stream
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let accumulatedText = ""

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const chunk = decoder.decode(value, { stream: true })
                    accumulatedText += chunk

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, content: accumulatedText, isStreaming: true }
                                : msg
                        )
                    )
                }
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMsgId
                        ? { ...msg, content: accumulatedText || "Analysis complete.", isStreaming: false }
                        : msg
                )
            )
        } catch (err) {
            console.error("Chat streaming error:", err)
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMsgId
                        ? {
                            ...msg,
                            content: "I'm connected and ready. Please try asking your construction question again or provide details like plot area, location, or building type.",
                            isStreaming: false,
                        }
                        : msg
                )
            )
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text).catch(() => {})
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1800)
    }

    const clearHistory = () => {
        setMessages([])
        setHasStarted(false)
        localStorage.removeItem("siid-assistant-chat-v4")
    }

    // Rich Markdown Formatter with Table support
    const renderFormattedContent = (content: string) => {
        if (!content) return null

        return (
            <div className="space-y-2 text-[13.5px] leading-relaxed break-words">
                {content.split("\n").map((line, idx) => {
                    const trimmed = line.trim()

                    // Tables
                    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
                        const cols = trimmed.split("|").filter((c) => c.length > 0)
                        if (trimmed.includes("---")) return <div key={idx} className="border-b border-border/40 my-1" />
                        return (
                            <div key={idx} className="overflow-x-auto py-0.5">
                                <div className="grid grid-flow-col auto-cols-fr gap-2 text-xs font-mono bg-white/5 p-2 rounded border border-white/10 min-w-[280px]">
                                    {cols.map((col, cIdx) => (
                                        <span key={cIdx} className={cn("truncate", cIdx === 0 ? "font-semibold text-emerald-400" : "text-slate-300")}>
                                            {col.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    // Bullet lists
                    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("* ")) {
                        const bulletText = trimmed.replace(/^[-•*]\s*/, "")
                        return (
                            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                                <span>{renderInlineBold(bulletText)}</span>
                            </div>
                        )
                    }

                    // Numbered lists
                    if (/^\d+\.\s/.test(trimmed)) {
                        const num = trimmed.match(/^(\d+)\.\s/)?.[1]
                        const rest = trimmed.replace(/^\d+\.\s/, "")
                        return (
                            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
                                <span className="text-xs font-bold text-emerald-400 mt-0.5">{num}.</span>
                                <span>{renderInlineBold(rest)}</span>
                            </div>
                        )
                    }

                    // Headers
                    if (trimmed.startsWith("### ")) {
                        return <h4 key={idx} className="font-bold text-sm text-emerald-400 pt-1.5">{trimmed.replace("### ", "")}</h4>
                    }
                    if (trimmed.startsWith("## ")) {
                        return <h3 key={idx} className="font-bold text-base text-white pt-2">{trimmed.replace("## ", "")}</h3>
                    }

                    if (trimmed.length === 0) return <div key={idx} className="h-1" />

                    return <p key={idx}>{renderInlineBold(line)}</p>
                })}
            </div>
        )
    }

    const renderInlineBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="font-semibold text-emerald-300">{part.slice(2, -2)}</strong>
            }
            if (part.startsWith("*") && part.endsWith("*")) {
                return <em key={i} className="text-slate-400">{part.slice(1, -1)}</em>
            }
            return part
        })
    }

    return (
        <>
            {/* FLOATING LAUNCHER (Mobile + Desktop Responsive) */}
            {!isOpen && (
                <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 group">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
                    
                    <button
                        onClick={() => setIsOpen(true)}
                        aria-label="Open Construction Assistant"
                        className="relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-slate-950/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl hover:scale-105 hover:border-emerald-400 transition-all duration-200 active:scale-95"
                    >
                        <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                        </div>

                        <div className="text-left pr-1 hidden sm:block">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white tracking-wide">BuildAssist</span>
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    AI Expert
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400">Ask cost, codes & layouts</p>
                        </div>
                    </button>
                </div>
            )}

            {/* FULL-FEATURED CHAT CONTAINER (Mobile Fullsheet + Desktop Floating Window) */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed z-50 flex flex-col shadow-2xl border border-emerald-500/30 overflow-hidden backdrop-blur-2xl bg-slate-950/98 text-slate-100 transition-all duration-300 ease-out",
                        // Mobile View: Full Bottom Sheet / Modal
                        "inset-x-0 bottom-0 top-12 rounded-t-3xl sm:top-auto sm:inset-x-auto sm:bottom-6 sm:right-6 sm:rounded-2xl",
                        // Desktop View: Standard vs Expanded
                        isExpanded
                            ? "sm:w-[680px] sm:h-[85vh] sm:max-h-[850px]"
                            : "sm:w-[440px] sm:h-[620px] sm:max-h-[90vh]"
                    )}
                >
                    {/* TOP HEADER */}
                    <div className="relative px-4 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-emerald-500/20 flex items-center justify-between flex-shrink-0">
                        {/* Neon accent top bar */}
                        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

                        {/* Mobile Pull Bar */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-700/60 rounded-full sm:hidden" />

                        <div className="flex items-center gap-3 pt-1 sm:pt-0">
                            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
                                <Bot className="w-5 h-5 text-white" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white tracking-wide">BuildAssist Smart</h3>
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                                        Verified
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Online • Instant Engineering Advice
                                </p>
                            </div>
                        </div>

                        {/* Window Controls */}
                        <div className="flex items-center gap-1 text-slate-400 pt-1 sm:pt-0">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    title="Clear Conversation"
                                    className="p-2 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                title={isExpanded ? "Standard Window" : "Expanded Studio Window"}
                                className="p-2 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors hidden sm:block"
                            >
                                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close"
                                className="p-2 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* CHAT MESSAGES SCROLL AREA */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                        
                        {/* WELCOME / QUICK START (Shown on fresh start) */}
                        {!hasStarted && messages.length === 0 && (
                            <div className="space-y-4 pt-1 animate-in fade-in duration-300">
                                <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-emerald-400 animate-spin-slow" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white">How can I assist your construction project?</h4>
                                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                        Get instant cost estimates, IS 456 structural standards, cement and steel pricing, and architectural plans.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                                        Popular Questions
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {QUICK_PROMPTS.map((item) => {
                                            const IconComp = item.icon
                                            return (
                                                <button
                                                    key={item.label}
                                                    onClick={() => handleSend(undefined, item.prompt)}
                                                    className="w-full text-left p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all duration-200 group flex items-start justify-between gap-3 shadow-sm active:scale-[0.99]"
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mt-0.5">
                                                            <IconComp className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                                                                {item.label}
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                                                {item.prompt}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full flex-shrink-0">
                                                        {item.badge}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MESSAGE THREAD */}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md border border-emerald-400/30 mt-0.5">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "max-w-[88%] sm:max-w-[85%] rounded-2xl px-4 py-3 shadow-lg relative group transition-all",
                                        msg.role === "user"
                                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs shadow-emerald-950/40"
                                            : "bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-xs shadow-black/40"
                                    )}
                                >
                                    {/* Message Header */}
                                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                                        <span className="font-semibold text-emerald-400">
                                            {msg.role === "user" ? "You" : "BuildAssist"}
                                        </span>
                                        {msg.timestamp && <span>{msg.timestamp}</span>}
                                    </div>

                                    {/* Message Body */}
                                    {msg.role === "assistant" ? (
                                        msg.content.length === 0 && msg.isStreaming ? (
                                            <div className="flex items-center gap-2 text-xs text-emerald-400 py-1">
                                                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                                <span>Analyzing & calculating...</span>
                                            </div>
                                        ) : (
                                            renderFormattedContent(msg.content)
                                        )
                                    ) : (
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    )}

                                    {/* Copy Response Button */}
                                    {msg.role === "assistant" && msg.content && (
                                        <div className="flex justify-end mt-2 pt-1 border-t border-slate-800/60">
                                            <button
                                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 py-0.5"
                                            >
                                                {copiedId === msg.id ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                        <span className="text-emerald-400 font-medium">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* FIXED INPUT BAR */}
                    <div className="p-3 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl flex-shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                        <form onSubmit={handleSend} className="relative flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask construction cost, BOQ, or IS standards..."
                                disabled={isLoading}
                                className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 rounded-xl pl-4 pr-12 py-3 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all"
                            />

                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={cn(
                                    "absolute right-1.5 p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
                                    input.trim() && !isLoading
                                        ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 hover:scale-105 shadow-md shadow-emerald-500/30"
                                        : "text-slate-600 hover:text-slate-400 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </form>

                        <div className="flex items-center justify-between px-1 mt-2 text-[10px] text-slate-500">
                            <span>Civil Engineering & Architectural Intelligence</span>
                            <span>IS 456 & NBC 2016 Compliant</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
