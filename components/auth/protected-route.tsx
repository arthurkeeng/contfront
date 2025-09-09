"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: "admin" | "manager" | "maintenance"
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallbackPath = "/auth/signin",
}: ProtectedRouteProps) {
  // const { user, isLoading } = useAuth()
  const isLoading = false
  const user = {
    id: "1",
    email: "admin@propertyflow.com",
    name: "John Admin",
    role: "manager",
    permissions: ["*"], // Admin has all permissions
    phone: "+234 801 234 5678",
  }
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        router.push("/dashboard") // Redirect to main dashboard if wrong role
        return
      }

      if (requiredPermission && !user.permissions.includes(requiredPermission) && !user.permissions.includes("*")) {
        router.push("/dashboard") // Redirect if no permission
        return
      }
    }
  }, [user, isLoading, requiredPermission, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
