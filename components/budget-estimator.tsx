"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  IndianRupee,
  Ruler,
  Layers,
  Package,
  Users,
  Wrench,
  PiggyBank,
  TrendingUp,
  Info,
  CheckCircle2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateProjectEstimate, ConstructionTier, BrickType, TIER_RATES } from "@/lib/cost-engine"
import { toast } from "sonner"
import { getUserDataKey } from "@/lib/auth"

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function BudgetEstimator() {
  const [area, setArea] = useState(1500)
  const [tier, setTier] = useState<ConstructionTier>("Standard")
  const [brickType, setBrickType] = useState<BrickType>("Standard Red")
  const [numRooms, setNumRooms] = useState(3)
  const [isSaved, setIsSaved] = useState(false)

  const estimation = calculateProjectEstimate({
    builtUpAreaSqft: area,
    tier,
    brickType,
    numRooms,
  })

  const { totalEstimateINR, finalRatePerSqft, breakdown } = estimation

  const breakdownList = [
    { label: "Materials", value: breakdown.civilMaterialsINR, percentage: breakdown.civilMaterialsPercentage, icon: Package, color: "bg-blue-500" },
    { label: "Labor", value: breakdown.laborINR, percentage: breakdown.laborPercentage, icon: Users, color: "bg-green-500" },
    { label: "MEP & Finishing", value: breakdown.mepAndFinishingINR, percentage: breakdown.mepAndFinishingPercentage, icon: Wrench, color: "bg-purple-500" },
    { label: "Contingency", value: breakdown.contingencyINR, percentage: breakdown.contingencyPercentage, icon: PiggyBank, color: "bg-amber-500" },
  ]

  const handleSaveEstimate = () => {
    try {
      const key = getUserDataKey("siid_saved_estimates")
      const existing = localStorage.getItem(key)
      const list = existing ? JSON.parse(existing) : []
      const newEntry = {
        id: `EST-${Date.now()}`,
        date: new Date().toISOString(),
        area,
        tier,
        brickType,
        numRooms,
        totalEstimateINR,
        finalRatePerSqft,
        breakdown,
      }
      list.unshift(newEntry)
      localStorage.setItem(key, JSON.stringify(list))
      setIsSaved(true)
      toast.success("Estimate saved successfully!", {
        description: `Saved estimate of ${formatINR(totalEstimateINR)} to your browser session.`,
      })
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err) {
      toast.error("Failed to save estimate.")
    }
  }

  return (
    <TooltipProvider>
      <Card className="border-border bg-background overflow-hidden shadow-xl rounded-3xl">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black">Smart Budget Estimator</CardTitle>
              <CardDescription>Calculate construction costs based on current Indian market benchmarks</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section 1: Area Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                Built-up Area
              </span>
              <span className="font-bold text-primary">{area.toLocaleString()} sq.ft</span>
            </div>
            <Slider
              value={[area]}
              onValueChange={(val) => setArea(val[0])}
              min={500}
              max={10000}
              step={100}
              className="py-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
              <span>500 sq.ft</span>
              <span>5,000 sq.ft</span>
              <span>10,000 sq.ft</span>
            </div>
          </div>

          <Separator />

          {/* Section 2: Construction Quality Tier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                Construction Grade
              </span>
              <Badge variant="outline" className="font-bold">
                {tier} Tier
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {(["Economy", "Standard", "Premium", "Luxury"] as ConstructionTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tier === t
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border hover:border-primary/50 text-muted-foreground"
                  }`}
                >
                  <div className="font-bold text-xs mb-0.5">{t}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">{formatINR(TIER_RATES[t].baseRatePerSqft)}/sqft</div>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-dashed">
              <div className="text-[10px] font-bold mb-2 uppercase tracking-wider text-muted-foreground">{tier} tier features:</div>
              <div className="flex flex-wrap gap-1.5">
                {TIER_RATES[tier].features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-[10px] font-medium py-0.5">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 3: Cost Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <PiggyBank className="h-4 w-4 text-primary" />
              <span>Cost Breakdown</span>
            </div>

            <div className="h-3 rounded-full overflow-hidden flex bg-muted">
              {breakdownList.map((item) => (
                <div
                  key={item.label}
                  className={`${item.color} transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {breakdownList.map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-muted/40 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] text-muted-foreground font-bold">{item.label}</span>
                  </div>
                  <div className="font-bold text-xs">{formatINR(item.value)}</div>
                  <div className="text-[10px] text-muted-foreground">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Section 4: Total Estimate */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="font-bold text-sm">Authoritative Total Estimate</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Market Rate Q2 2025</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-primary">{formatINR(totalEstimateINR)}</div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Based on {formatINR(finalRatePerSqft)}/sqft × {area.toLocaleString()} sq.ft built-up area
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleSaveEstimate} 
            className="w-full h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/20" 
            size="lg"
            variant={isSaved ? "secondary" : "default"}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                Estimate Saved!
              </>
            ) : (
              <>
                <PiggyBank className="h-4 w-4 mr-2" />
                Save Estimate
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
