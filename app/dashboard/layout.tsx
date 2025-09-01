"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, FileText, Users, Wrench, BarChart3, Settings, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", icon: Building2, label: "Properties", permission: "properties.view" },
      { href: "/dashboard/rentals", icon: FileText, label: "Rentals", permission: "rentals.manage" },
      { href: "/dashboard/occupancy", icon: Users, label: "Occupancy", permission: "properties.view" },
      { href: "/dashboard/maintenance", icon: Wrench, label: "Maintenance", permission: "maintenance.view" },
    ]

    // Admin gets all items plus additional ones
    if (user?.role === "admin") {
      return [
        ...baseItems,
        { href: "/dashboard/reports", icon: BarChart3, label: "Reports", permission: "*" },
        { href: "/dashboard/settings", icon: Settings, label: "Settings", permission: "*" },
      ]
    }

    // Filter items based on user permissions
    return baseItems.filter((item) => user?.permissions.includes(item.permission) || user?.permissions.includes("*"))
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <aside className="w-72 bg-white border-r border-gray-200 shadow-sm">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PropertyFlow</h1>
                  <p className="text-sm text-gray-500">Real Estate ERP</p>
                </div>
              </div>
            </div>

            {/* User Profile */}
            {user && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role} Access</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</h3>
              </div>
              {getNavigationItems().map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-11 px-4 text-left font-medium transition-all duration-200",
                        isActive
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <item.icon
                        className={cn("h-5 w-5 mr-3 transition-colors", isActive ? "text-white" : "text-gray-500")}
                      />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Sign Out */}
            <div className="p-6 border-t border-gray-100">
              <Button
                variant="ghost"
                className="w-full justify-start h-11 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
