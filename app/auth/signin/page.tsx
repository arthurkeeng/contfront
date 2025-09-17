"use client"

import { useContext, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useAuth } from "@/lib/auth"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  companyCode: z.string().min(10, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const { setUser , setCompany} = useAuth()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      companyCode: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)


    //  API call
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          // user fields
          email: values.email,
          password: values.password,

          // Company fields. This is for the company that is being created.
          company_code: values.companyCode,

        })
      }
    )
    if (res.ok) {
      let { user , company , message} = await res.json()
      localStorage.setItem(
        "propertyflow_user",
        JSON.stringify({
          ...user,
          email: values.email,
        })
      )
      setUser(user)
      setCompany({...company})
      localStorage.setItem(
        "propertyflow_company",
        JSON.stringify({
          ...company
        })
      )
      // localStorage.clear()
      toast.success(message)
      redirect("/dashboard")
    }
    else {

      console.log(res)
      toast("Sign in Unsuccessful")
    }
    setIsLoading(false)
  }


  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left side - Image */}
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

      {/* Right side - Sign in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl w-full space-y-4">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900">PropertyFlow</h1>
              <p className="text-sm text-gray-600 mt-1">Real Estate & Construction ERP</p>
            </Link>
          </div>

          <Card className="shadow-lg border-0 lg:shadow-lg lg:border">
            <CardHeader className="space-y-2 pb-1">
              <CardTitle className="text-2xl font-semibold text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center text-base">
                Enter your email and password to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-12 pb-1">


              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>

              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Company Code</FormLabel>
                        <Input
                          placeholder="Enter your company code"
                          type="text"
                          // autoComplete="email"
                          className="h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email address</FormLabel>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          autoComplete="email"
                          className="h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Password</FormLabel>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          autoComplete="current-password"
                          className="h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end pt-1">
                    <div className="text-sm">
                      <Link href="/auth/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : null}
                    Sign in
                  </Button>
                </form>
              </Form>

              <div className="text-center pt-2">
                <p className="text-base text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/#pricing" className="font-medium text-purple-600 hover:text-purple-500">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-base text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
