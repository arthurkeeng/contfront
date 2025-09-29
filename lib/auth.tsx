"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "manager" | "maintenance"

export interface User {
  user_id: string
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
  company  : any , 
  setCompany : (company : any) => void,
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  canAccessProperty: (propertyId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration


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
  useEffect(() => {
    const storedCompany = localStorage.getItem("propertyflow_company")
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany))
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    setCompany(null)
    localStorage.removeItem("propertyflow_user")
    localStorage.removeItem("propertyflow_company")
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
        company ,
         setCompany,
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
