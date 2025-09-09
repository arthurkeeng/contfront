"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

const requestSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  companyCode: z.string().min(6, "Company code must be at least 6 characters."),
})

const verifySchema = z.object({
  code: z.string().length(6, "Reset code must be 6 digits."),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
})

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify">("request")
  const [isLoading, setIsLoading] = useState(false)
  const [savedValues, setSavedValues] = useState<{ email: string; companyCode: string } | null>(null)

  // Step 1 form
  const requestForm = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "", companyCode: "" },
  })

  // Step 2 form
  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "", newPassword: "" },
  })

  async function onRequest(values: z.infer<typeof requestSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          company_code: values.companyCode,
        }),
      })

      if (res.ok) {
        toast.success("✅ Reset code sent to your email")
        setSavedValues({ email: values.email, companyCode: values.companyCode })
        setStep("verify")
      } else {
        toast.error("❌ Could not send reset code")
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function onVerify(values: z.infer<typeof verifySchema>) {
    if (!savedValues) return

    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: savedValues.email,
          company_code: savedValues.companyCode,
          code: values.code,
          new_password: values.newPassword,
        }),
      })

      if (res.ok) {
        toast.success("✅ Password reset successful. Please log in.")
        window.location.href = "/auth/signin"
      } else {
        toast.error("❌ Invalid code or expired reset request")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left side - Marketing (kept as is) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/80 z-10" />
        <img
          src="/modern-office-building-with-construction-cranes-an.png"
          alt="PropertyFlow ERP - Real Estate and Construction Management"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Streamline Your Business</h2>
            <p className="text-xl mb-6 drop-shadow-md">
              Manage properties, projects, and teams all in one powerful platform
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold drop-shadow-md">500+</div>
                <div className="drop-shadow-sm">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold drop-shadow-md">10k+</div>
                <div className="drop-shadow-sm">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold drop-shadow-md">99.9%</div>
                <div className="drop-shadow-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            {/* The Link component has been replaced with a standard anchor tag */}
            <a href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900">PropertyFlow</h1>
              <p className="text-sm text-gray-600 mt-1">Real Estate & Construction ERP</p>
            </a>
          </div>

          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">
                {step === "request" ? "Request Reset Code" : "Verify Code & Set New Password"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === "request" ? (
                <Form {...requestForm}>
                  <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                    <FormField
                      control={requestForm.control}
                      name="companyCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Code</FormLabel>
                          <Input placeholder="Enter your company code" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requestForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <Input placeholder="Enter your email" type="email" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Get Code"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form key="verify" {...verifyForm}>
                  <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-4">
                    <FormField
                      control={verifyForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <Input placeholder="Enter 6-digit code" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={verifyForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <Input type="password" placeholder="Enter new password" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
