"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Route, Sparkles, Building2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { BrandLogo } from "@/components/brand-logo"
import { CONSTRUCTION_STAGES } from "@/data/construction-stages"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [workflowDropdownOpen, setWorkflowDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/"
  }

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm py-2 md:py-3"
          : "bg-background/40 backdrop-blur-sm border-b border-border/30 py-3 md:py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
          <BrandLogo
            size="md"
            className="transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
          <Link
            href="/#features"
            className="text-xs md:text-sm font-semibold text-foreground/80 hover:text-primary transition-all"
          >
            Design Intelligence
          </Link>

          {/* Construction Workflow Dropdown for Desktop */}
          <div className="relative group">
            <Link
              href="/construction/site-survey"
              className="text-xs md:text-sm font-semibold text-foreground/80 hover:text-primary transition-all inline-flex items-center gap-1 py-1"
            >
              <span>Construction Workflow</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
            </Link>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-72 p-2 bg-card border border-border/60 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider border-b border-border/40 mb-1">
                8 Milestone Stages
              </div>
              <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                {CONSTRUCTION_STAGES.map((st) => (
                  <Link
                    key={st.id}
                    href={`/construction/${st.id}`}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-foreground/90 hover:text-primary hover:bg-muted/80 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      0{st.step}
                    </span>
                    <span className="truncate">{st.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/#cinema"
            className="text-xs md:text-sm font-semibold text-foreground/80 hover:text-primary transition-all"
          >
            SIID Cinema
          </Link>

          <Link
            href="/3d-generator"
            className="text-xs md:text-sm font-semibold text-foreground/80 hover:text-primary transition-all"
          >
            3D Engine
          </Link>

          <Link
            href="/contact"
            className="text-xs md:text-sm font-semibold text-foreground/80 hover:text-primary transition-all"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 md:gap-4">
          <LanguageSelector />

          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm" className="text-xs md:text-sm font-medium">
                  {user.name.split(" ")[0]}'s Portal
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                size="sm"
                className="text-xs md:text-sm bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 transition-all"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm font-semibold">
                  Login
                </Button>
              </Link>
              <Link href="/projects/create">
                <Button size="sm" className="text-xs md:text-sm bg-primary hover:bg-primary/90 text-white font-bold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  New Project
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground h-10 w-10 hover:bg-muted/50"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[64px] bg-black/60 lg:hidden transition-opacity z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-y-auto z-50 ${
          mobileMenuOpen
            ? "opacity-100 max-h-[85vh] py-4 px-4"
            : "opacity-0 max-h-0 py-0 border-transparent pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-3">
          {/* Main Links */}
          <Link
            href="/"
            className="text-sm font-bold text-foreground hover:text-primary py-2 border-b border-border/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/#features"
            className="text-sm font-semibold text-foreground/90 hover:text-primary py-2 border-b border-border/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Design Intelligence
          </Link>

          {/* Expandable Construction Workflow for Mobile */}
          <div className="py-2 border-b border-border/40">
            <button
              onClick={() => setWorkflowDropdownOpen(!workflowDropdownOpen)}
              className="w-full flex items-center justify-between text-sm font-semibold text-foreground/90 hover:text-primary"
            >
              <span className="flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                Construction Workflow (8 Stages)
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  workflowDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {workflowDropdownOpen && (
              <div className="mt-2 space-y-1 pl-4 pt-2 border-l-2 border-primary/30">
                {CONSTRUCTION_STAGES.map((st) => (
                  <Link
                    key={st.id}
                    href={`/construction/${st.id}`}
                    className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    0{st.step}. {st.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/3d-generator"
            className="text-sm font-semibold text-foreground/90 hover:text-primary py-2 border-b border-border/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            3D Model Generator
          </Link>

          <Link
            href="/contact"
            className="text-sm font-semibold text-foreground/90 hover:text-primary py-2 border-b border-border/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact & Support
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="pt-3 flex flex-col gap-2.5">
            {user ? (
              <Button
                onClick={handleLogout}
                className="w-full bg-destructive text-white text-sm h-11 font-bold"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/projects/create" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm h-11 font-bold shadow-md">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    New Smart Project
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full text-sm h-11 font-semibold">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
