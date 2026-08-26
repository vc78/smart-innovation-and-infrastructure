"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Shield,
  Save,
  RefreshCw,
  Bell,
  Sliders,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure platform security parameters, notifications, and default preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 px-3.5"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security & Access */}
        <Card className="bg-slate-900/80 border-slate-800/80 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Security & Authentication</h3>
              <p className="text-xs text-slate-400">Manage login enforcement and access controls</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-white">Two-Factor Authentication</Label>
                <p className="text-[11px] text-slate-400">Enforce 2FA for all administrator accounts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-white">Strict Session Expiry</Label>
                <p className="text-[11px] text-slate-400">Automatically logout inactive operators after 24 hours</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-white">Audit Trail Logging</Label>
                <p className="text-[11px] text-slate-400">Capture detailed IP and payload metadata for all events</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Notifications & System Preferences */}
        <Card className="bg-slate-900/80 border-slate-800/80 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Notifications & Alerts</h3>
              <p className="text-xs text-slate-400">Configure alert thresholds and digest deliveries</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-white">Email Digest on New Registrations</Label>
                <p className="text-[11px] text-slate-400">Notify admins when a new user signs up</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-white">Failed Auth Alerts</Label>
                <p className="text-[11px] text-slate-400">Alert on 5+ consecutive failed login attempts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-2">
              <Label className="text-xs font-semibold text-white">Platform Contact Email</Label>
              <Input
                defaultValue="support@siid.com"
                className="bg-slate-900 border-slate-800 text-white h-8 text-xs font-mono"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
