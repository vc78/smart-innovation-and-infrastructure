"use client"

import { useState, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calculator, Zap, CheckCircle2, ChevronRight, BarChart3, Clock, MapPin, Box, Compass, Droplets, ShieldCheck, Factory, Download, FileText, Sparkles, Loader2 } from "lucide-react"
import { generateMaterialReportPDF } from "@/lib/material-pdf-export"
import { getCurrentUser } from "@/lib/auth"
import { toast } from "sonner"

const GRADES = ["Economy", "Standard", "Premium", "Luxury"];
const DIRECTIONS = ["North", "East", "West", "South"];
const SOILS = ["Red Soil", "Black Cotton Soil", "Sandy Soil", "Laterite Soil", "Alluvial Soil"];
const CEMENTS = ["OPC 43 (Standard)", "OPC 53 (High Strength)", "PPC (Blended)", "PSC (Slag)"];
const STEELS = ["TMT Fe415", "TMT Fe500", "TMT Fe550"];
const KITCHEN_TYPES = ["Modular Island", "L-Shaped", "Parallel", "U-Shaped", "Straight"];
const ARCH_STYLES = ["Modern / Contemporary", "Traditional", "Colonial", "Mediterranean", "Vernacular"];

const AMENITIES = [
  { id: "home_office", label: "Home Office", icon: "💼", cost: 80000 },
  { id: "pooja_room", label: "Pooja Room", icon: "🪔", cost: 120000 },
  { id: "home_theater", label: "Home Theater", icon: "🎬", cost: 450000 },
  { id: "gym", label: "Gym", icon: "🏋️", cost: 250000 },
  { id: "servant_quarters", label: "Servant Quarters", icon: "🏠", cost: 180000 },
  { id: "terrace_garden", label: "Terrace Garden", icon: "🌿", cost: 150000 },
  { id: "swimming_pool", label: "Swimming Pool", icon: "🏊", cost: 900000 },
  { id: "solar_panels", label: "Solar Panels", icon: "☀️", cost: 220000 },
  { id: "smart_automation", label: "Smart Automation", icon: "🤖", cost: 350000 },
  { id: "study_room", label: "Study Room", icon: "📚", cost: 90000 },
  { id: "guest_room", label: "Guest Room", icon: "🛏️", cost: 130000 },
  { id: "ev_charging", label: "EV Charging", icon: "⚡", cost: 45000 },
];

const COMPLIANCES = [
  { id: "vastu", label: "Vastu Compliance Overlay", icon: "🧿" },
  { id: "senior", label: "Senior Citizen Accessibility", icon: "♿" },
  { id: "fire", label: "Fire Safety NOC", icon: "🔥" },
  { id: "green", label: "Green Building Certification", icon: "🌱" },
];

function Chip({ label, icon, active, onClick }: { label: string, icon?: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
        border: active ? "1.5px solid #1a6fd4" : "1px solid #d0d7e3",
        background: active ? "#e8f1fd" : "#fff",
        color: active ? "#1a6fd4" : "#555",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: active ? 600 : 400,
        transition: "all 0.15s",
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

function SelectBtn({ options, value, onChange }: { options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
          border: value === o ? "1.5px solid #1a6fd4" : "1px solid #d0d7e3",
          background: value === o ? "#1a6fd4" : "#fff",
          color: value === o ? "#fff" : "#555",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          transition: "all 0.15s",
        }}>{o}</button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "number", style = {} }: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      style={{
        width: "100%", height: 42, borderRadius: 10, border: "1px solid #d0d7e3",
        padding: "0 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        background: "#fafafa", color: "#222", outline: "none", boxSizing: "border-box", ...style
      }}
    />
  );
}

function Select({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: "100%", height: 42, borderRadius: 10, border: "1px solid #d0d7e3",
      padding: "0 12px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
      background: "#fafafa", color: "#222", outline: "none",
    }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function CostRow({ label, value, sub, highlight, indent }: any) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "10px 0", borderBottom: "1px solid #f3f4f6",
      paddingLeft: indent ? 16 : 0,
    }}>
      <span style={{ fontSize: 13, color: highlight ? "#111" : "#555", fontWeight: highlight ? 700 : 400, fontFamily: "'DM Sans', sans-serif" }}>
        {label}{sub && <span style={{ fontSize: 11, color: "#aaa", marginLeft: 6 }}>{sub}</span>}
      </span>
      <span style={{ fontSize: highlight ? 16 : 14, color: highlight ? "#1a6fd4" : "#333", fontWeight: highlight ? 700 : 600, fontFamily: "'DM Mono', monospace" }}>
        {value}
      </span>
    </div>
  );
}

function StreamingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center", marginLeft: 8 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: "#1a6fd4",
          display: "inline-block",
          animation: "dot-pulse 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
      <style>{`@keyframes dot-pulse { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </span>
  );
}

const fmt = (n: number) => "₹ " + Number(n).toLocaleString("en-IN");
const fmtL = (n: number) => {
  const l = n / 100000;
  return l >= 1 ? `₹ ${l.toFixed(2)} L` : fmt(n);
};

export function MaterialCalculator() {
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("30");
  const [floors, setFloors] = useState("1");
  const [city, setCity] = useState("Hyderabad");
  const [grade, setGrade] = useState("Standard");
  const [direction, setDirection] = useState("North");
  const [soil, setSoil] = useState("Red Soil");
  const [cement, setCement] = useState("OPC 43 (Standard)");
  const [steel, setSteel] = useState("TMT Fe415");
  const [beds, setBeds] = useState("3");
  const [baths, setBaths] = useState("3");
  const [kitchenType, setKitchenType] = useState("Modular Island");
  const [archStyle, setArchStyle] = useState("Modern / Contemporary");
  const [amenities, setAmenities] = useState(new Set<string>());
  const [compliances, setCompliances] = useState(new Set<string>(["vastu"]));
  
  const [minBudget, setMinBudget] = useState("5000000");
  const [maxBudget, setMaxBudget] = useState("8000000");

  const [loading, setLoading] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const plotArea = (parseFloat(length) || 0) * (parseFloat(width) || 0);

  const toggleAmenity = (id: string) => setAmenities(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const toggleCompliance = (id: string) => setCompliances(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const runEstimate = useCallback(async () => {
    if (!length || !width || !plotArea) { setError("Please enter plot dimensions first."); return; }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai-predict-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length: parseFloat(length),
          width: parseFloat(width),
          floors: parseInt(floors),
          city, grade, direction, soil, cement, steel, beds, baths, kitchenType, archStyle,
          amenities: Array.from(amenities),
          compliances: Array.from(compliances),
          minBudget: parseFloat(minBudget),
          maxBudget: parseFloat(maxBudget)
        }),
      });

      if (!res.ok) throw new Error("Estimation engine failed to respond.");
      
      const parsed = await res.json();
      setResult(parsed);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [length, width, floors, city, grade, direction, soil, cement, steel, beds, baths, kitchenType, archStyle, amenities, compliances, minBudget, maxBudget, plotArea]);

  const downloadProjectPDF = async () => {
    if (!result) {
      toast.error("Please generate or wait for the project estimate first.");
      return;
    }

    setDownloadingPDF(true);
    const toastId = toast.loading("Processing project data with Gemini AI Engine...");

    try {
      const user = getCurrentUser();
      const projectPayload = {
        length,
        width,
        plotArea,
        builtUpArea: result.builtUpArea || plotArea * 0.85 * parseInt(floors),
        floors,
        city,
        grade,
        direction,
        soil,
        cement,
        steel,
        beds,
        baths,
        kitchenType,
        archStyle,
        amenities: Array.from(amenities),
        compliances: Array.from(compliances),
        minBudget,
        maxBudget,
        result,
      };

      // Call AI document processing endpoint powered by Gemini
      const aiRes = await fetch("/api/process-project-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDetails: {
            length,
            width,
            plotArea,
            builtUpArea: result.builtUpArea || plotArea * 0.85 * parseInt(floors),
            floors,
            city,
            grade,
            direction,
            soil,
            cement,
            steel,
            beds,
            baths,
            kitchenType,
            archStyle,
            amenities: Array.from(amenities),
            compliances: Array.from(compliances),
          },
          materialQuantities: result.materials,
          financialBreakdown: {
            ...result.breakdown,
            totalCostFormatted: fmtL(result.totalCost),
          },
          userInfo: user ? { name: user.name, email: user.email } : null,
        }),
      });

      let aiAnalysis = null;
      if (aiRes.ok) {
        const aiJson = await aiRes.json();
        aiAnalysis = aiJson.data;
      }

      toast.loading("Generating your verified Project Manifest PDF...", { id: toastId });

      const fileName = await generateMaterialReportPDF(
        projectPayload,
        aiAnalysis,
        user ? { name: user.name, email: user.email } : null
      );

      toast.success(`Downloaded ${fileName} successfully!`, { id: toastId });
    } catch (e: any) {
      console.error("PDF generation failed:", e);
      toast.error(e.message || "Failed to generate PDF report", { id: toastId });
    } finally {
      setDownloadingPDF(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
       if (plotArea > 0) runEstimate();
    }, 200);
    return () => clearTimeout(timer);
  }, [length, width, floors, grade, city, direction, soil, cement, steel, beds, baths, kitchenType, archStyle, amenities, compliances, minBudget, maxBudget, plotArea, runEstimate]);

  return (
    <Card className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white border-slate-100 shadow-2xl rounded-2xl sm:rounded-[2.5rem] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl text-blue-600 shadow-sm">
            <Calculator className="w-6 h-6 sm:w-8 sm:w-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">AI Material Estimator</h2>
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Market Rates Updated: June 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-emerald-50 text-emerald-600 text-[10px] sm:text-[11px] font-black uppercase rounded-full border border-emerald-100 flex items-center gap-2">
             <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
             AI Calibrated
           </div>
           {result && (
             <button
               onClick={downloadProjectPDF}
               disabled={downloadingPDF}
               className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm hover:shadow transition-all disabled:opacity-50"
             >
               {downloadingPDF ? (
                 <>
                   <Loader2 className="w-3.5 h-3.5 animate-spin" />
                   <span>Processing PDF...</span>
                 </>
               ) : (
                 <>
                   <Download className="w-3.5 h-3.5" />
                   <span>Download PDF</span>
                 </>
               )}
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 md:gap-12">
        
        {/* LEFT PANEL: INPUTS */}
        <div className="space-y-10">
          
          {/* Plot Details */}
          <section>
            <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-slate-50 pb-2">
               <MapPin className="w-4 h-4 text-blue-500" />
               <h3 className="text-[12px] sm:text-[13px] font-black text-slate-400 uppercase tracking-widest">01. Terrain & Layout</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              <Field label="Length (ft)"><Input value={length} onChange={setLength} /></Field>
              <Field label="Width (ft)"><Input value={width} onChange={setWidth} /></Field>
              <div className="col-span-2 sm:col-span-1">
                <Field label="Total Plot Area">
                  <div className="h-[42px] rounded-xl border border-blue-100 bg-blue-50/30 flex items-center px-4 font-mono font-bold text-blue-600 text-sm">
                    {plotArea.toLocaleString()} SQ FT
                  </div>
                </Field>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mt-2 sm:mt-4">
              <Field label="City / Region"><Select value={city} onChange={setCity} options={["Hyderabad", "Vijayawada", "Warangal", "Secunderabad"]} /></Field>
              <Field label="Total Floors"><Input value={floors} onChange={setFloors} /></Field>
              <div className="col-span-2 sm:col-span-1">
                <Field label="Vastu Direction"><Select value={direction} onChange={setDirection} options={DIRECTIONS} /></Field>
              </div>
            </div>
            <div className="mt-2 sm:mt-4">
              <Field label="Geotechnical Soil Profile"><Select value={soil} onChange={setSoil} options={SOILS} /></Field>
            </div>
          </section>

          {/* Construction Specs */}
          <section>
            <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-slate-50 pb-2">
               <Box className="w-4 h-4 text-blue-500" />
               <h3 className="text-[12px] sm:text-[13px] font-black text-slate-400 uppercase tracking-widest">02. Engineering Standards</h3>
            </div>
            <Field label="Project Grade Finish"><SelectBtn options={GRADES} value={grade} onChange={setGrade} /></Field>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-4 sm:mt-6">
              <Field label="Cement Specification"><Select value={cement} onChange={setCement} options={CEMENTS} /></Field>
              <Field label="Steel Rebar"><Select value={steel} onChange={setSteel} options={STEELS} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-2 sm:mt-4">
              <Field label="Min Budget (₹)"><Input value={minBudget} onChange={setMinBudget} /></Field>
              <Field label="Max Budget (₹)"><Input value={maxBudget} onChange={setMaxBudget} /></Field>
            </div>
          </section>

          {/* Lifestyle & Architecture */}
          <section>
            <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-slate-50 pb-2">
               <Zap className="w-4 h-4 text-blue-500" />
               <h3 className="text-[12px] sm:text-[13px] font-black text-slate-400 uppercase tracking-widest">03. Lifestyle Architecture</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              <Field label="Beds"><Input value={beds} onChange={setBeds} /></Field>
              <Field label="Baths"><Input value={baths} onChange={setBaths} /></Field>
              <div className="col-span-2 sm:col-span-1">
                <Field label="Kitchen Style"><Select value={kitchenType} onChange={setKitchenType} options={KITCHEN_TYPES} /></Field>
              </div>
            </div>
            <div className="mt-2 sm:mt-4">
              <Field label="Architectural Design Language"><Select value={archStyle} onChange={setArchStyle} options={ARCH_STYLES} /></Field>
            </div>
            
            <Field label="Premium Amenities">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {AMENITIES.map(a => (
                  <Chip key={a.id} label={a.label} icon={a.icon} active={amenities.has(a.id)} onClick={() => toggleAmenity(a.id)} />
                ))}
              </div>
            </Field>

            <Field label="Structural Compliances">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {COMPLIANCES.map(c => (
                  <Chip key={c.id} label={c.label} icon={c.icon} active={compliances.has(c.id)} onClick={() => toggleCompliance(c.id)} />
                ))}
              </div>
            </Field>
          </section>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={runEstimate}
              disabled={loading || !plotArea}
              className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-lg shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
            >
              {loading ? (<>Computing Intelligent Estimate <StreamingDots /></>) : "⚡ Generate AI Project Manifest"}
            </button>

            {result && (
              <button
                onClick={downloadProjectPDF}
                disabled={downloadingPDF}
                className="h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="space-y-4 sm:space-y-6">
          {!result && !loading && (
            <div className="bg-slate-50 rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 opacity-40">🏗️</div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Awaiting Input Parameters</h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-[200px]">Define your terrain and specs to see the AI breakdown.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 p-8 sm:p-10 text-center shadow-lg h-full flex flex-col items-center justify-center">
               <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4 sm:mb-6" />
               <h4 className="text-base sm:text-lg font-bold text-slate-900">AI Engine Running</h4>
               <p className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">Simulating {plotArea.toLocaleString()} sq ft build in {city}...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Main Cost Card */}
               <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 sm:mb-2">Total Project Investment</div>
                  <div className="text-2xl sm:text-4xl font-black font-mono mb-1 sm:mb-2">{fmtL(result.totalCost)}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-bold mb-4 sm:mb-8">
                    {fmt(result.costPerSqFt)} / sq ft · {result.builtUpArea} sq ft Built-up
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                     <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                        <div className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase mb-0.5 sm:mb-1">Timeline</div>
                        <div className="text-xs sm:text-sm font-bold truncate">{result.timeline}</div>
                     </div>
                     <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                        <div className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase mb-0.5 sm:mb-1">Status</div>
                        <div className={`text-xs sm:text-sm font-bold truncate ${result.feasibility.includes("Over") ? "text-orange-400" : "text-emerald-400"}`}>
                          {result.feasibility}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Breakdown List */}
               <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest">Financial Breakdown</h4>
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm">
                    {Object.entries(result.breakdown).map(([k, v]) => (
                      <CostRow key={k} label={k.replace(/_/g, " ").toUpperCase()} value={fmtL(v as number)} />
                    ))}
                    <div className="pt-3 mt-2 border-t border-slate-100">
                      <CostRow label="TOTAL PROJECT VALUE" value={fmtL(result.totalCost)} highlight />
                    </div>
                  </div>
               </div>

               {/* Material Detail - SIDE-BY-SIDE 2-COLUMN GRID ON MOBILE */}
               <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest mb-4 sm:mb-6">Material Quantities</h4>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    {Object.entries(result.materials).map(([k, v]) => (
                      <div key={k} className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                         <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase truncate">{k}</span>
                         <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono mt-1 break-words">{v as string}</span>
                      </div>
                    ))}
                  </div>
               </div>

               {/* AI Intelligence Tips */}
               <div className="bg-blue-600 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 text-white">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
                    <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-widest">AI Intelligence Tips</h4>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {result.alerts.map((a: string, i: number) => (
                      <div key={i} className="text-[11px] sm:text-xs leading-relaxed opacity-90 flex gap-1.5 sm:gap-2">
                        <span className="text-blue-200">•</span> {a}
                      </div>
                    ))}
                  </div>
               </div>

            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
