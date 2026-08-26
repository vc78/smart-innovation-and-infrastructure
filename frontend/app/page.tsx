"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Users,
  Zap,
  CheckCircle2,
  Sparkles,
  Award,
  Shield,
  Star,
  TrendingUp,
  ChevronDown,
  Calculator,
  Compass,
  FileText,
  MessageSquare,
  Wrench,
  Boxes,
  Tv,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import ConstructionAssistant from "@/components/construction-assistant"
import MediaFallbackInjector from "@/components/media-fallback-injector"
import KpiCounters from "@/components/kpi-counters"
import VideoCarousel from "@/components/video-carousel"
import { HeadlineScroller } from "@/components/headline-scroller"
import { CompanyLogoScroller } from "@/components/company-logo-scroller"
import { ConstructionRouteMap } from "@/components/construction-route-map"
import { SmartDesignSwitcher } from "@/components/smart-design-switcher"
import { FutureOfDesignSwitcher } from "@/components/future-of-design-switcher"
import ProgressAnalytics from "@/components/progress-analytics"
import BudgetEstimator from "@/components/budget-estimator"
import InsightsSearch from "@/components/insights-search"
import TestimonialsCarousel from "@/components/testimonials-carousel"
import LiveTicker from "@/components/live-ticker"

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MediaFallbackInjector />
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] md:min-h-screen flex items-center overflow-hidden pt-28 pb-16 md:py-32">
        {/* Architectural Background Render Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <img
            src="/images/hero_architectural_background.png"
            alt="Futuristic Architectural Design Background"
            className="w-full h-full object-cover scale-105 opacity-75"
          />
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          {/* Ambient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="w-full max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Intelligent Construction & Design Platform
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-balance text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">
              Turn Your Architectural Vision Into Reality
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-white/90 font-medium mb-6 sm:mb-8 leading-relaxed max-w-prose drop-shadow-md">
              Parametric BIM blueprints, real-time deterministic BOQ pricing, and AI-powered MEP systems for architects, contractors, and home builders.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              <Link href="/projects/create" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg h-12 px-6"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  New Smart Project
                </Button>
              </Link>
              <Link href="/3d-generator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold shadow-lg h-12 px-6"
                >
                  Launch 3D Engine
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/construction/site-survey" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-5 font-semibold"
                >
                  View Workflow (8 Stages)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* ======================= COMPACT ANIMATED STATISTICS (2x2) ======================== */}
      {/* ================================================================================== */}
      <section className="py-6 sm:py-10 bg-background border-y border-border/60">
        <div className="container mx-auto px-4">
          <KpiCounters />
        </div>
      </section>

      {/* Company Brand Logo Scroller */}
      <CompanyLogoScroller />

      {/* Infinite Scrolling Ticker */}
      <HeadlineScroller />

      {/* ================================================================================== */}
      {/* ================= SMART DESIGN INTELLIGENCE (INTERACTIVE SWITCHER) ================ */}
      {/* ================================================================================== */}
      <section id="features" className="py-12 sm:py-20 bg-muted/40 relative overflow-hidden border-b border-border/60">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              Smart Design Intelligence
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Experience next-generation design capabilities powered by smart intelligence, deterministic pricing, and automated compliance
            </p>
          </div>

          {/* Interactive Feature Switcher (Replaces massive vertical cards) */}
          <SmartDesignSwitcher />
        </div>
      </section>

      {/* ================================================================================== */}
      {/* =================== SIID CINEMA VIDEO SHOWCASE SECTION ========================== */}
      {/* ================================================================================== */}
      <section id="cinema" className="py-12 sm:py-20 bg-background relative overflow-hidden border-b border-border/60">
        <div className="container mx-auto px-4">
          <VideoCarousel />
        </div>
      </section>

      {/* ================================================================================== */}
      {/* ================= CONSTRUCTION ROUTE MAP / 8-STAGE JOURNEY ======================= */}
      {/* ================================================================================== */}
      <div id="how-it-works">
        <ConstructionRouteMap />
      </div>

      {/* ================================================================================== */}
      {/* ================= INTEGRATED ENGINEERING TOOLS & SUITE =========================== */}
      {/* ================================================================================== */}
      <section className="py-12 sm:py-20 bg-muted/30 border-b border-border/60 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge variant="outline" className="mb-3 px-4 py-1 border-primary/30 text-primary bg-primary/5 rounded-full font-bold text-xs">
              <Boxes className="w-3.5 h-3.5 mr-1.5 inline" />
              Integrated Toolsuite
            </Badge>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              Comprehensive Construction & Design Tools
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Everything you need to generate 3D models, create blueprints, estimate material BOQs, evaluate Vastu, and connect with contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Tool 1: 3D Generator */}
            <Card className="p-5 sm:p-6 border-border/60 hover:border-cyan-500/50 transition-all rounded-xl flex flex-col justify-between group bg-card">
              <div>
                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <Badge className="mb-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-[10px] font-bold">Interactive 3D</Badge>
                <h4 className="text-base sm:text-lg font-bold mb-2 group-hover:text-cyan-500 transition-colors">3D Building & Spatial Viewer</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Generate structural 3D models, customize lighting, and conduct interactive real-time walkthroughs.
                </p>
              </div>
              <Link href="/3d-generator">
                <Button className="w-full justify-between bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 text-xs font-bold h-10" variant="outline">
                  Launch 3D Engine
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Tool 2: Blueprint Creator */}
            <Card className="p-5 sm:p-6 border-border/60 hover:border-violet-500/50 transition-all rounded-xl flex flex-col justify-between group bg-card">
              <div>
                <div className="w-10 h-10 bg-violet-500/10 text-violet-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <Badge className="mb-2 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 text-[10px] font-bold">Smart Blueprints</Badge>
                <h4 className="text-base sm:text-lg font-bold mb-2 group-hover:text-violet-500 transition-colors">AI Architectural Plan Generator</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Create complete floor plans, room dimension specs, and structural framing calculations instantly.
                </p>
              </div>
              <Link href="/projects/create">
                <Button className="w-full justify-between bg-violet-500/10 text-violet-600 dark:text-violet-300 hover:bg-violet-600 hover:text-white border border-violet-500/30 text-xs font-bold h-10" variant="outline">
                  Create Blueprint
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Tool 3: Cost Engine */}
            <Card className="p-5 sm:p-6 border-border/60 hover:border-emerald-500/50 transition-all rounded-xl flex flex-col justify-between group bg-card">
              <div>
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <Badge className="mb-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">Deterministic BOQ</Badge>
                <h4 className="text-base sm:text-lg font-bold mb-2 group-hover:text-emerald-500 transition-colors">Cost & Material Estimator</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Calculate exact quantities for cement, steel tonnage, sand CFT, and aggregates based on live city prices.
                </p>
              </div>
              <Link href="/dashboard/new-project">
                <Button className="w-full justify-between bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-bold h-10" variant="outline">
                  Calculate BOQ
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Tool 4: Vastu Engine */}
            <Card className="p-5 sm:p-6 border-border/60 hover:border-amber-500/50 transition-all rounded-xl flex flex-col justify-between group bg-card">
              <div>
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <Badge className="mb-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">Spatial Compliance</Badge>
                <h4 className="text-base sm:text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">Vastu Layout Audit & Scoring</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Evaluate room orientations and entrance placement against ancient 16-zone directional rules.
                </p>
              </div>
              <Link href="/dashboard/projects/1/designs">
                <Button className="w-full justify-between bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-600 hover:text-white border border-amber-500/30 text-xs font-bold h-10" variant="outline">
                  Audit Vastu Score
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Tool 5: Contractor Network */}
            <Card className="p-5 sm:p-6 border-border/60 hover:border-rose-500/50 transition-all rounded-xl flex flex-col justify-between group bg-card">
              <div>
                <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wrench className="w-5 h-5" />
                </div>
                <Badge className="mb-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold">Verified Network</Badge>
                <h4 className="text-base sm:text-lg font-bold mb-2 group-hover:text-rose-500 transition-colors">Contractor Marketplace</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Connect directly with verified structural and civil contractors with transparent reviews and ratings.
                </p>
              </div>
              <Link href="/dashboard/contractors">
                <Button className="w-full justify-between bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-xs font-bold h-10" variant="outline">
                  Find Contractors
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Tool 6: 24/7 AI Assistant */}
            <Card className="p-5 sm:p-6 border-border/60 hover:border-blue-500/50 transition-all rounded-xl flex flex-col justify-between group bg-card">
              <div>
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <Badge className="mb-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-bold">24/7 Intelligence</Badge>
                <h4 className="text-base sm:text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors">AI Construction Assistant</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Get instant answers on local building codes, material ratios, timeline risk mitigation, and structural questions.
                </p>
              </div>
              <Link href="/assistant">
                <Button className="w-full justify-between bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold h-10" variant="outline">
                  Ask AI Assistant
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress Analytics */}
      <section className="py-12 sm:py-16 bg-muted/20 border-b border-border/60">
        <div className="container mx-auto px-4">
          <ProgressAnalytics />
        </div>
      </section>

      {/* Budget Estimator & Insights Search */}
      <section className="py-12 sm:py-16 bg-background border-b border-border/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetEstimator />
            <InsightsSearch />
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* ===================== COMPACT TRUST & CERTIFICATIONS (2x2) ======================= */}
      {/* ================================================================================== */}
      <section className="py-10 sm:py-14 bg-muted/40 border-b border-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-1">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Certified and recognized for engineering excellence & compliance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-3.5 sm:p-5 flex flex-col items-center justify-center text-center rounded-xl bg-card border-border/60">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1.5" />
              <h4 className="font-bold text-xs sm:text-sm text-foreground mb-0.5">ISO Certified</h4>
              <p className="text-[11px] text-muted-foreground">Quality Management</p>
            </Card>

            <Card className="p-3.5 sm:p-5 flex flex-col items-center justify-center text-center rounded-xl bg-card border-border/60">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1.5" />
              <h4 className="font-bold text-xs sm:text-sm text-foreground mb-0.5">Verified Partners</h4>
              <p className="text-[11px] text-muted-foreground">Trusted Contractors</p>
            </Card>

            <Card className="p-3.5 sm:p-5 flex flex-col items-center justify-center text-center rounded-xl bg-card border-border/60">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1.5" />
              <h4 className="font-bold text-xs sm:text-sm text-foreground mb-0.5">Industry Leader</h4>
              <p className="text-[11px] text-muted-foreground">Design Innovation</p>
            </Card>

            <Card className="p-3.5 sm:p-5 flex flex-col items-center justify-center text-center rounded-xl bg-card border-border/60">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-1.5" />
              <h4 className="font-bold text-xs sm:text-sm text-foreground mb-0.5">5-Star Rated</h4>
              <p className="text-[11px] text-muted-foreground">Customer Reviews</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* ================= FUTURE OF DESIGN (COMPACT INTERACTIVE) ========================= */}
      {/* ================================================================================== */}
      <section id="vision" className="py-12 sm:py-16 bg-background border-b border-border/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              The Future of Design & Construction
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Building not just homes, but smarter, more connected societies
            </p>
          </div>

          <FutureOfDesignSwitcher />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 bg-muted/30 border-b border-border/60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-2">
              Trusted by Construction Professionals
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Architects, contractors, and structural engineers sharing their experiences with SIID
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-12 sm:py-16 bg-background border-b border-border/60">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need to know about the SIID construction intelligence platform
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                question: "How does SIID's AI design generation work?",
                answer:
                  "Our smart system analyzes your project requirements including size, budget, style preferences, and location to generate comprehensive architectural, structural, electrical, plumbing, interior, and exterior designs. The system uses market data and best practices to create optimized designs tailored to your needs.",
              },
              {
                question: "What is included in the budget estimation and BOQ?",
                answer:
                  "Our budget estimation includes itemized material costs (cement bags, steel tonnage, sand CFT), labor charges, contractor fees, municipal permit fees, and contingency funds with live regional market price indexes.",
              },
              {
                question: "How do I explore individual construction workflow stages?",
                answer:
                  "You can click on any milestone in our Construction Journey to view dedicated technical inputs, required baseline surveys, engineering tools, sample project calculations, and certified deliverables.",
              },
              {
                question: "How do I connect with verified contractors?",
                answer:
                  "Once your design and BOQ are ready, you can browse our marketplace of verified contractors with ratings, reviews, portfolios, and standardized quote bidding.",
              },
              {
                question: "Is project data secure?",
                answer:
                  "Yes. All project designs, soil reports, municipal filings, and calculations are encrypted and stored in your private cloud vault with strict privacy compliance.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover:border-primary/40 transition-all rounded-xl"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-sm sm:text-base text-foreground pr-2">{faq.question}</h3>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openFaq === index && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-3 pt-3 border-t border-border/40 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-700 to-primary-dark opacity-95" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tight">
            Transform Your Construction Workflow Today
          </h2>
          <p className="text-sm sm:text-lg mb-6 sm:mb-8 text-white/90 leading-relaxed">
            Join 500+ architecture and construction teams accelerating designs, reducing rework, and locking in deterministic budgets with AI-powered intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/projects/create">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold text-sm h-12 px-8 shadow-lg hover:scale-105 transition-all"
              >
                Start Free Smart Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/construction/site-survey">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-bold text-sm h-12 px-6"
              >
                Explore 8-Stage Workflow
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 sm:py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">SIID</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-sm leading-relaxed">
                Smart Innovation & Infrastructure Design. Transforming architectural imagination into deterministic reality with AI-powered design tools.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-foreground">Construction</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/construction/site-survey" className="hover:text-foreground">01. Site Survey</Link></li>
                <li><Link href="/construction/concept-design" className="hover:text-foreground">02. Concept Design</Link></li>
                <li><Link href="/construction/approvals-boq" className="hover:text-foreground">03. Approvals & BOQ</Link></li>
                <li><Link href="/construction/structural-engineering" className="hover:text-foreground">04. Structure & FEA</Link></li>
                <li><Link href="/construction/services-routing" className="hover:text-foreground">05. Smart MEP</Link></li>
                <li><Link href="/construction/interior-finishes" className="hover:text-foreground">06. Interior Fit-Out</Link></li>
                <li><Link href="/construction/qa-inspection" className="hover:text-foreground">07. QA Inspection</Link></li>
                <li><Link href="/construction/handover" className="hover:text-foreground">08. Handover</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-foreground">Product</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/3d-generator" className="hover:text-foreground">3D Generator</Link></li>
                <li><Link href="/projects/create" className="hover:text-foreground">AI Blueprint Creator</Link></li>
                <li><Link href="/dashboard/new-project" className="hover:text-foreground">Material BOQ Calculator</Link></li>
                <li><Link href="/dashboard/contractors" className="hover:text-foreground">Contractor Marketplace</Link></li>
                <li><Link href="/assistant" className="hover:text-foreground">AI Assistant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-foreground">Company</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About SIID</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact Support</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} SIID. All rights reserved. Professional Construction Intelligence Platform.</div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <span>•</span>
              <Link href="/accessibility" className="hover:text-foreground">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>

      <ConstructionAssistant />
    </div>
  )
}
