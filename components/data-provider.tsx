"use client"

import { useState, createContext, useContext, ReactNode } from "react"

interface AppInterface {
    user: any
    company: any
    subscription: any
    setUser: (user: any) => void
    setCompany: (company: any) => void
    setSubscription: (sub: any) => void
    clearContext: () => void

}

const AppContext = createContext<AppInterface | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null)
    const [company, setCompany] = useState<any>(null)
    const [subscription, setSubscription] = useState<any>(null)

    const clearContext = () => {
        setUser(null)
        setCompany(null)
        setSubscription(null)
    }

    return (
        <AppContext.Provider
            value={
                { user, setUser, company, setCompany, subscription, setSubscription, clearContext }
            }
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () =>{
    const context = useContext(AppContext)

    if(!context){
        throw new Error("Context should be provided")
    }
    return context
}