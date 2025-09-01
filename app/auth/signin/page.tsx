"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // TODO: Implement authentication logic
    console.log(values)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    // TODO: Implement Google OAuth
    console.log("Google sign in")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGoogleLoading(false)
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
              <Button
                variant="outline"
                className="w-full bg-transparent h-12 text-base"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77C17.45 20.53 14.97 23 12 23 7.7 23 3.99 20.53 2.18 17.07v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Sign up for free
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
