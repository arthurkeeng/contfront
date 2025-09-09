"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  Settings,
  User,
  Bell,
  Shield,
  Building2,
  Palette,
  Mail,
  Phone,
  Save,
  Eye,
  EyeOff,
  Key,
  Users,
  CreditCard,
  Globe,
} from "lucide-react"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    maintenance: true,
    occupancy: true,
    financial: false,
  })

  const [profile, setProfile] = useState({
    name: "John Admin",
    email: "admin@propertyflow.com",
    phone: "+234 801 234 5678",
    company: "PropertyFlow Management",
    address: "123 Business District, Lagos, Nigeria",
    timezone: "Africa/Lagos",
    language: "English",
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ProtectedRoute requiredPermission="*">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and system preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Company</label>
                  <Input
                    value={profile.company}
                    onChange={(e) => handleProfileChange("company", e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Address</label>
                  <Input
                    value={profile.address}
                    onChange={(e) => handleProfileChange("address", e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <Input
                    value={profile.timezone}
                    onChange={(e) => handleProfileChange("timezone", e.target.value)}
                    placeholder="Select timezone"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Language</label>
                  <Input
                    value={profile.language}
                    onChange={(e) => handleProfileChange("language", e.target.value)}
                    placeholder="Select language"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Security & Authentication
              </CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter current password" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.email ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("email", !notifications.email)}
                  >
                    {notifications.email ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.sms ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("sms", !notifications.sms)}
                  >
                    {notifications.sms ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.push ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("push", !notifications.push)}
                  >
                    {notifications.push ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-foreground mb-3">Notification Categories</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Maintenance Requests</span>
                    <Button
                      variant={notifications.maintenance ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange("maintenance", !notifications.maintenance)}
                    >
                      {notifications.maintenance ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Occupancy Changes</span>
                    <Button
                      variant={notifications.occupancy ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange("occupancy", !notifications.occupancy)}
                    >
                      {notifications.occupancy ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Financial Reports</span>
                    <Button
                      variant={notifications.financial ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationChange("financial", !notifications.financial)}
                    >
                      {notifications.financial ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Company Settings
                </CardTitle>
                <CardDescription>Manage your organization preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Company Name</label>
                  <Input value="PropertyFlow Management" placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Business Type</label>
                  <Input value="Real Estate Management" placeholder="Enter business type" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tax ID</label>
                  <Input placeholder="Enter tax identification number" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Theme</label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Light
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Dark
                    </Button>
                    <Button variant="default" size="sm">
                      System
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Currency</label>
                  <Input value="NGN (₦)" placeholder="Select currency" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date Format</label>
                  <Input value="DD/MM/YYYY" placeholder="Select date format" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing & Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Current Plan</p>
                  <p className="text-sm text-muted-foreground">Professional Plan - Real Estate</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">₦99,000/month</p>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="bg-transparent">
                  View Billing History
                </Button>
                <Button variant="outline" className="bg-transparent">
                  Update Payment Method
                </Button>
                <Button variant="outline" className="bg-transparent">
                  Change Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API & Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                API & Integrations
              </CardTitle>
              <CardDescription>Manage API keys and third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">API Access</p>
                  <p className="text-sm text-muted-foreground">
                    Generate and manage API keys for external integrations
                  </p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Manage Keys
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Webhooks</p>
                  <p className="text-sm text-muted-foreground">
                    Configure webhook endpoints for real-time notifications
                  </p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
