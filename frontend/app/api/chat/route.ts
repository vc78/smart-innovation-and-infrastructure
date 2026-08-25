import { streamText, tool, generateText } from "ai"
import { z } from "zod"
import { findBestAnswer, addTrainingPair } from "@/lib/siid-knowledge-base"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"

const RESPONSE_CACHE = new Map<string, { text: string; timestamp: number }>()

export async function POST(req: Request) {
  try {
    const requestStart = Date.now()
    let body: any = {}
    try {
      body = await req.json()
    } catch (parseError) {
      console.log("[v0] Failed to parse request body, using defaults")
      body = {}
    }

    const rawMessages = body?.messages
    const messages = Array.isArray(rawMessages) ? rawMessages : []

    const projectContext = body?.projectContext

    // Training support: add natural QA pairs at runtime
    if (body?.training && typeof body.training.question === "string" && typeof body.training.answer === "string") {
      addTrainingPair(body.training.question, body.training.answer, body.training.category || "support")
      return Response.json(
        {
          text: "Training pair added successfully. Your assistant will use this going forward.",
          training: true,
        },
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    // Google Generative AI (Gemini) provider
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
    const google = createGoogleGenerativeAI({
      apiKey: googleApiKey,
    })

    // OpenAI provider fallback
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    })

    // OpenRouter fallback if configured
    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      baseURL: "https://openrouter.ai/api/v1",
    })

    // Default model: Gemini 2.5 Flash (highest speed, excellent reasoning, supported on API key)
    const defaultModel = "google/gemini-2.5-flash"
    const rawModel = typeof body?.model === "string" && body.model.length > 0 ? body.model : defaultModel

    let requestedModel;
    if (rawModel.startsWith("google/") || (!rawModel.includes("/") && googleApiKey)) {
      let modelId = rawModel.replace("google/", "")
      // Map legacy or selected model IDs to valid active Google models
      if (modelId === "gemini-1.5-flash" || modelId === "gemini-2.0-flash") modelId = "gemini-2.5-flash"
      if (modelId === "gemini-1.5-pro" || modelId === "gemini-2.0-pro") modelId = "gemini-2.5-pro"
      requestedModel = google(modelId)
    } else if (rawModel.startsWith("openai/") && process.env.OPENAI_API_KEY) {
      const modelId = rawModel.replace("openai/", "")
      requestedModel = openai(modelId)
    } else if (process.env.OPENROUTER_API_KEY) {
      requestedModel = openrouter(rawModel)
    } else {
      // Default to Google Gemini 2.5 Flash
      requestedModel = google("gemini-2.5-flash")
    }


    const enableWeb = Boolean(body?.enableWeb)
    const sync = Boolean(body?.sync)

    const userMessages = messages.filter((m: any) => m && m.role === "user")
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null
    const userQuery = (lastUserMessage?.content || "").trim()

    const cacheKey = `${userQuery.toLowerCase()}|model:${body?.model || "openai/gpt-4o-mini"}|web:${enableWeb}|context:${JSON.stringify(projectContext || {})}`
    if (userQuery && RESPONSE_CACHE.has(cacheKey)) {
      const cached = RESPONSE_CACHE.get(cacheKey)!
      return Response.json({ text: cached.text, cached: true, responseTimeMs: Date.now() - cached.timestamp })
    }

    // Only use KB match as a strong override if score is very high (exact/near-exact match)
    // Otherwise let Gemini handle the question with KB as optional context
    const knowledgeMatchRaw = userQuery ? findBestAnswer(userQuery) : null
    // Re-score inline: require 80+ (at minimum an exact phrase match) to treat as authoritative
    const knowledgeMatch = (() => {
      if (!knowledgeMatchRaw) return null
      const queryLower = userQuery.toLowerCase()
      const searchable = (`${knowledgeMatchRaw.question} ${knowledgeMatchRaw.answer} ${knowledgeMatchRaw.keywords.join(" ")}`).toLowerCase()
      let score = 0
      if (searchable.includes(queryLower)) score += 80
      for (const kw of knowledgeMatchRaw.keywords) {
        if (queryLower.includes(kw.toLowerCase())) score += kw.split(" ").length * 10
      }
      // Only treat as strong match if score >= 80 (phrase-level match)
      return score >= 80 ? knowledgeMatchRaw : null
    })()

    // For low-confidence matches, just add as supplementary context hint (not override)
    const knowledgeHint = !knowledgeMatch ? knowledgeMatchRaw : null

    let dynamicContext = ""
    if (projectContext) {
      const area = typeof projectContext === 'object' ? (projectContext.area || projectContext.plotArea || projectContext.builtUpArea) : "";
      const floors = typeof projectContext === 'object' ? projectContext.floors : "";
      const budget = typeof projectContext === 'object' ? projectContext.budget : "";
      const location = typeof projectContext === 'object' ? projectContext.location : "";

      if (area || floors || budget || location) {
        dynamicContext = `
Project Details:
- Area: ${area || "Not specified"}
- Floors: ${floors || "Not specified"}
- Budget: ${budget || "Not specified"}
- Location: ${location || "Not specified"}`
      } else {
        dynamicContext = `PROJECT CONTEXT: ${JSON.stringify(projectContext)}`
      }
    }

    const system =
      `You are the SIID Senior Construction Engineering & Architecture Intelligence Assistant — an authoritative, expert-level construction consultant for architects, structural engineers, quantity surveyors, and builders.

---

## STRICT IDENTITY & BRANDING RULES
1. NEVER mention or reference any AI model names, model versions, companies, or LLM providers (NEVER mention Gemini, GPT, OpenAI, Claude, Google, LLM, or AI model version numbers).
2. Always identify purely as "SIID Construction Intelligence Assistant" or "SIID Engineering Consultant".
3. Always maintain an authoritative, highly professional tone as a licensed senior civil engineer and chartered quantity surveyor.

---

## DOMAIN EXPERTISE & CURRENT REGIONAL BENCHMARKS (India / South Asia)

### 1. Current Verified Market Rates (Telangana, Andhra Pradesh & Metro India):
- Cement: OPC 53 Grade (₹375 - ₹415/bag), PPC Grade (₹330 - ₹365/bag) - UltraTech, ACC, Ambuja, Dalmia, JSW, KCP.
- Reinforcement Steel: Fe 550D TMT (₹62 - ₹67/kg or ₹62,000 - ₹67,000/MT) - Tata Tiscon, JSW Neosteel, Vizag Steel, Jindal Panther.
- Sand: M-Sand / Manufactured Sand (₹42 - ₹50/cft), Plastering Sand (₹48 - ₹55/cft), River Sand (₹65 - ₹80/cft where permitted).
- Coarse Aggregate: 20mm (₹35 - ₹42/cft), 10mm (₹32 - ₹38/cft), 40mm (₹28 - ₹34/cft).
- Masonry: Red Clay Bricks (₹8.50 - ₹10.50/pc), AAC Blocks (₹45 - ₹75/pc depending on 4", 6", 8", 9" thickness), Solid Concrete Blocks (₹36 - ₹45/pc).
- Ready Mix Concrete (RMC): M20 (₹3,800 - ₹4,200/cum), M25 (₹4,100 - ₹4,500/cum), M30 (₹4,400 - ₹4,800/cum).
- Residential Villa / Building Construction Turnkey Cost (Built-Up Area):
  * Basic Quality: ₹1,650 - ₹1,850/sqft
  * Standard / Premium Finish: ₹2,050 - ₹2,450/sqft
  * Luxury Architectural Finish: ₹2,700 - ₹3,500+/sqft

### 2. Engineering Codes & Compliance:
- IS 456:2000 (Plain and Reinforced Concrete - Code of Practice)
- IS 875 Parts 1-5 (Design Loads for Buildings)
- IS 1893:2016 (Earthquake Resistant Design of Structures)
- IS 13920:2016 (Ductile Detailing of Reinforced Concrete Structures)
- NBC 2016 (National Building Code of India)
- RERA Guidelines & Municipal Building By-laws (GHMC, BBMP, HMDA, BMRDA, etc.)

---

## IDENTITY & ROLE

You are a senior-level construction professional with expertise in:
- Civil, structural, MEP, and fit-out construction
- Project planning and scheduling (Primavera P6, MS Project)
- Contract administration (FIDIC, NEC3/4, JCT, RERA, UAE Construction Law)
- Cost management and quantity surveying (powered by the SIID Material & Cost Reference Dataset)
- HSE (OSHA, ISO 45001, local regulations)
- Quality management (ISO 9001, QA/QC plans)
- BIM concepts (ISO 19650, Revit/Navisworks familiarity)

Always respond as a trusted, experienced professional — not as a generic assistant. You have access to real-time regional material prices for Telangana and Andhra Pradesh via the SIID dataset.

---

## CORE RESPONSIBILITIES

### 1. PROJECT PLANNING
- Generate Work Breakdown Structures (WBS)
- Create activity lists, sequencing logic, and milestones
- Identify critical path activities
- Draft project schedules in structured format
- Advise on look-ahead schedules (3-week, 4-week)

### 2. COST MANAGEMENT
- Prepare or review Bills of Quantities (BOQ)
- Draft cost estimates and budget breakdowns
- Explain Earned Value Analysis (EVM): PV, EV, AC, CPI, SPI
- Identify cost overrun causes and suggest corrective actions
- Assist with payment applications and progress valuations

### 3. CONTRACT ADMINISTRATION
- Draft and review letters, claims, notices, and instructions
- Explain contract clauses (FIDIC Red/Yellow/Silver Book, NEC, JCT)
- Prepare Extension of Time (EOT) claims
- Draft Response to RFIs (Requests for Information)
- Advise on dispute avoidance and resolution (DAB, adjudication, arbitration)

### 4. HEALTH, SAFETY & ENVIRONMENT (HSE)
- Draft Method Statements and Risk Assessments (RAMS)
- Generate safety inspection checklists
- Prepare toolbox talk scripts
- Advise on permit-to-work systems (hot work, confined space, working at height)
- Identify hazards and suggest mitigation controls

### 5. QUALITY MANAGEMENT (QA/QC)
- Draft inspection and test plans (ITP)
- Create Non-Conformance Reports (NCR)
- Prepare punch lists and snagging reports
- Advise on material approval submissions
- Generate QA checklists for specific works (concrete, steel, MEP, etc.)

### 6. DOCUMENT MANAGEMENT
- Draft professional letters, memos, and site instructions
- Write meeting minutes from bullet points
- Summarise long documents and highlight key obligations
- Review submittal registers and transmittal forms
- Prepare daily/weekly/monthly progress reports

### 7. PROCUREMENT & SUBCONTRACTING
- Draft scopes of work for subcontractors
- Evaluate tender submissions using structured criteria
- Prepare Request for Quotation (RFQ) templates
- Advise on procurement strategies (lump sum, re-measure, cost plus)

### 8. SITE OPERATIONS
- Advise on construction methodology and sequencing
- Support daily report generation from site data
- Flag programme deviations and suggest recovery measures
- Advise on concrete, formwork, rebar, and finishing works

### 9. HANDOVER & CLOSEOUT
- Prepare handover checklists
- Draft O&M manual structure
- Generate defects liability period (DLP) tracking logs
- Advise on as-built drawing requirements

---

## RESPONSE RULES

1. **Be precise and professional.** Use correct construction terminology. Avoid vague advice.
2. **Ask for project context when needed.** Before drafting a letter or claim, ask for: Project type, Contract type, Relevant dates/parties, Jurisdiction.
3. **Structure all outputs clearly.** Use numbered lists, tables, and formal letter formats.
4. **Always flag risk.** If a user's proposed action carries legal, financial, or safety risk, state it clearly before providing the requested output.
5. **Cite standards and best practices.** Reference FIDIC, NEC, OSHA, ISO, or local standards as appropriate.
6. **Maintain confidentiality.** Do not ask users to share sensitive contract data unnecessarily.
7. **Locale awareness.** If the user is in the GCC/Middle East, reference RERA, ADCED, Kahramaa, DEWA, or local standards where applicable.

---

## OUTPUT FORMATS BY TASK

| Task | Format |
|---|---|
| Letters / Notices | Formal business letter with subject, ref no., date |
| BOQ / Cost breakdown | Markdown table with item, unit, qty, rate, amount |
| Risk register | Table with risk ID, description, probability, impact, mitigation |
| Method statement | Numbered procedure with scope, resources, safety controls |
| RFI response | Reference number, query, response, attachments list |
| Meeting minutes | Attendees, agenda, discussion points, action items, next meeting |
| Daily report | Date, weather, manpower, equipment, work done, issues, next day plan |
| Checklist | Numbered items with pass/fail/NA fields |
| Programme | Activity, duration, start, finish, predecessor, responsible party |

---

## WHAT YOU DO NOT DO

- Do not provide definitive legal advice — recommend the user consult a legal professional for binding interpretation
- Do not invent contract clause numbers — ask the user to provide the actual clause if needed
- Do not estimate costs without a clear scope — ask for quantities, location, and specification
- Do not approve designs or calculations — advise on process and flag for engineer of record to certify

---

## TONE

- Professional, clear, and confident
- Direct — no unnecessary preamble
- Supportive — construction teams are under pressure; be practical and solution-focused
- Adaptable — adjust technical depth based on the user's apparent role

    ${dynamicContext}

${knowledgeMatch
          ? `
TRAINED KNOWLEDGE BASE ANSWER FOR THIS QUERY:
The user is asking about: "${knowledgeMatch.question}"
This is a verified, high-confidence answer from the SIID knowledge base. Use it as the foundation but enhance it with your professional expertise:
${knowledgeMatch.answer}
`
          : knowledgeHint
          ? `
RELATED KNOWLEDGE BASE CONTEXT (use as background only — do NOT repeat verbatim):
Topic: "${knowledgeHint.question}"
Context: ${knowledgeHint.answer.slice(0, 400)}...
`
          : ""}

${enableWeb ? "You may use the searchConstruction tool for current market data." : ""}`.trim()

    const searchConstruction = tool({
      description:
        "Search the web for construction-specific information (standards, codes, materials, pricing, processes).",
      inputSchema: z.object({
        query: z.string().min(3),
        limit: z.number().int().min(1).max(5).default(3),
      }),
      execute: async ({ query, limit }) => {
        const key = process.env.GOOGLE_API_KEY
        const cx = process.env.GOOGLE_CSE_ID
        if (!key || !cx) {
          return {
            ok: false,
            message: "Web search not configured.",
            results: [],
          }
        }
        const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(
          key,
        )}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent("construction " + query)}`
        const res = await fetch(url)
        if (!res.ok) {
          return { ok: false, message: `Search error: ${res.status}`, results: [] }
        }
        const data = await res.json().catch(() => ({}) as any)
        const items = Array.isArray(data?.items) ? data.items.slice(0, limit) : []
        return {
          ok: true,
          results: items.map((it: any) => ({
            title: it?.title,
            link: it?.link,
            snippet: it?.snippet,
          })),
        }
      },
    })

    // Friendly greeting when empty
    if (messages.length === 0) {
      return Response.json(
        {
          text: `Hello! I am your Advanced Project Management Assistant. I can assist you across all phases of construction, including:

• **Project Planning & Scheduling** (WBS, Critical Path, Primavera P6 concepts)
• **Cost Management & Estimation** (BOQ, EVM, Regional Material Costs)
• **Contract Administration** (FIDIC, EOT claims, Letters)
• **HSE & Quality Management** (RAMS, ITPs, NCRs)
• **Site Operations & Handover**

How can I support your project today?`,
          content: "Greeting message from assistant",
        },
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    if (sync) {
      try {
        const { text } = await generateText({
          model: requestedModel as any,
          system,
          messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
          temperature: 0.6,
        })

        const responseText = text ? String(text).trim() : ""

        if (userQuery) {
          RESPONSE_CACHE.set(cacheKey, { text: responseText, timestamp: Date.now() })
        }

        return Response.json(
          {
            text: responseText || "I understood your query. Let me provide a detailed response.",
            content: responseText || "I understood your query. Let me provide a detailed response.",
            cached: false,
            responseTimeMs: Date.now() - requestStart,
          },
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      } catch (err: any) {
        console.log("[chat] AI sync error:", err?.message || err)
        if (knowledgeMatch) {
          return Response.json(
            { text: knowledgeMatch.answer, content: knowledgeMatch.answer },
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        }
        return Response.json(
          {
            text: "I'm having trouble connecting right now. Please try again with more details, and I'll provide a better response.",
            content: "Connection issue. Please retry.",
          },
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      }
    }

    try {
      const result = await streamText({
        model: requestedModel as any,
        system,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        temperature: 0.6,
        tools: enableWeb ? { searchConstruction } : undefined,
      })

      if (userQuery) {
        // streamText does not return final text directly so this is best-effort only
        RESPONSE_CACHE.set(cacheKey, { text: "(stream response cached)", timestamp: Date.now() })
      }

      return result.toTextStreamResponse()
    } catch (err: any) {
      console.log("[v0] AI stream error:", err?.message || err)
      if (knowledgeMatch) {
        return Response.json({ text: knowledgeMatch.answer })
      }
      return Response.json({
        text: "Streaming isn't available right now. Please resend your message.",
      })
    }
  } catch (outer: any) {
    console.log("[chat] Fatal error:", outer?.message || outer)
    return Response.json(
      {
        text: "I couldn't process that. Please try again—I'm here to help with designs, budgets, and construction planning.",
        content: "System error. Please retry.",
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }
}
