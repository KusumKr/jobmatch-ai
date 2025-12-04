"use client"

import { Bell, Lock, Eye, Database, LogOut } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    weeklyDigest: true,
    profileVisibility: "public",
  })

  return (
    <div className="flex-1 bg-background">
      <TopNav title="Settings" />

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Account Settings */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Lock size={24} className="text-primary" />
            Account Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value="john@example.com"
                disabled
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <button className="rounded-lg border border-border bg-background px-4 py-2.5 font-medium text-foreground hover:bg-muted transition">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Bell size={24} className="text-secondary" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates about jobs and messages</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded accent-primary w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Job Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
              </div>
              <input
                type="checkbox"
                checked={settings.jobAlerts}
                onChange={(e) => setSettings({ ...settings, jobAlerts: e.target.checked })}
                className="rounded accent-primary w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">Summary of your weekly activity</p>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                className="rounded accent-primary w-5 h-5"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Eye size={24} className="text-accent" />
            Privacy
          </h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Profile Visibility</label>
            <div className="space-y-3">
              {[
                { value: "public", label: "Public", desc: "Anyone can see your profile" },
                { value: "private", label: "Private", desc: "Only recruiters you contact can see your profile" },
                { value: "hidden", label: "Hidden", desc: "Your profile is completely hidden" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border bg-background/50 cursor-pointer hover:border-primary/50 transition"
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={settings.profileVisibility === option.value}
                    onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Data Settings */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Database size={24} className="text-primary" />
            Data
          </h2>

          <div className="space-y-3">
            <button className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-medium text-foreground hover:bg-muted transition text-left">
              Download My Data
            </button>
            <p className="text-sm text-muted-foreground">
              Download a copy of your profile information and activity data
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-destructive mb-6">Danger Zone</h2>

          <button className="rounded-lg bg-destructive/10 px-6 py-2.5 font-semibold text-destructive hover:bg-destructive/20 transition flex items-center gap-2">
            <LogOut size={20} />
            Sign Out All Sessions
          </button>

          <button className="mt-4 rounded-lg bg-destructive px-6 py-2.5 font-semibold text-destructive-foreground hover:bg-destructive/90 transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
