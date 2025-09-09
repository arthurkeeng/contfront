"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "manager" | "maintenance"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: string[]
  assignedProperties?: string[]
  phone?: string
  avatar?: string
}

export interface Company{
  company_id : string, 
  
}

interface AuthContextType {
  user: User | null,
  setUser : (user : any) => void, 
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  canAccessProperty: (propertyId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers: Record<string, User> = {
  "admin@propertyflow.com": {
    id: "1",
    email: "admin@propertyflow.com",
    name: "John Admin",
    role: "admin",
    permissions: ["*"], // Admin has all permissions
    phone: "+234 801 234 5678",
  },
  "manager@propertyflow.com": {
    id: "2",
    email: "manager@propertyflow.com",
    name: "Sarah Manager",
    role: "manager",
    permissions: ["properties.view", "properties.manage", "rentals.manage", "maintenance.approve"],
    assignedProperties: ["1", "2", "3"], // Assigned to specific properties
    phone: "+234 802 345 6789",
  },
  "maintenance@propertyflow.com": {
    id: "3",
    email: "maintenance@propertyflow.com",
    name: "Mike Maintenance",
    role: "maintenance",
    permissions: ["maintenance.view", "maintenance.update"],
    phone: "+234 803 456 7890",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [company , setCompany] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("propertyflow_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would be an API call
    const user = mockUsers[email.toLowerCase()]
    if (user && password === "password123") {
      setUser(user)
      localStorage.setItem("propertyflow_user", JSON.stringify(user))
      setIsLoading(false)

      // Redirect based on role
      switch (user.role) {
        case "admin":
        case "manager":
          router.push("/dashboard")
          break
        case "maintenance":
          router.push("/dashboard/maintenance")
          break
        default:
          router.push("/dashboard")
      }

      return true
    }

    setIsLoading(false)
    return false
  }

 
  const logout = () => {
    setUser(null)
    localStorage.removeItem("propertyflow_user")
    router.push("/auth/signin")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.permissions.includes("*")) return true // Admin has all permissions
    return user.permissions.includes(permission)
  }

  const canAccessProperty = (propertyId: string): boolean => {
    if (!user) return false
    if (user.role === "admin") return true // Admin can access all properties
    if (user.role === "maintenance") return true // Maintenance can access all for work orders
    if (user.assignedProperties) {
      return user.assignedProperties.includes(propertyId)
    }
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isLoading,
        hasPermission,
        canAccessProperty,
      }}
    >
      {isLoading ?  <>Loading...</ > : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
