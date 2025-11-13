"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Toast, { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { redirect, useRouter } from "next/navigation"

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  companyEmail: z.string().email({ message: "Please enter a valid company email" }),
  phone: z.string().optional(),
  // industry: z.string().min(2, { message: "Industry is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  companySize: z.string().optional(),

  name: z.string().min(2, { message: "Your name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

interface Paystack_details {
  subscription_id: string,
  paystack_ref: string,
  amount: string,
  industry: string
}
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [items, setItems] = useState<Paystack_details | null>(null)
  useEffect(() => {
    let items = localStorage.getItem("credentials")

    if (items) {
      setItems(JSON.parse(items))
    }

  }, [])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      phone: "",
      // industry : "",
      country: "",
      companySize: "",
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Call to backend API to create company + admin user
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/onboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            // user fields
            email: values.email,
            password: values.password,
            name: values.name,
            // Company fields. This is for the company that is being created.
            company_name: values.companyName,
            company_email: values.companyEmail,
            phone: values.phone,
            industry: items?.industry,
            country: values.country,

            // Subscription details
            subscription_id: items?.subscription_id,
            paystack_ref: items?.paystack_ref,
            amount: parseInt(items?.amount!)
          })
        }
      )
      if (res.ok) {
        let det = await res.json()

        toast.success("Onboarding Successful! Redirecting to Sign In")
        router.push("/auth/signin")
        redirect("/auth/signin")
      }
      else {

        toast("Company Onboarding Unsuccessful")
      }
    } catch (error) {

      // toast.error("Internal Service Error")
    }
    finally {

      setIsLoading(false)
    }
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
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Create Your Company Workspace</h2>
            <p className="text-xl mb-1 drop-shadow-md">
              Manage your business with a single powerful ERP platform
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl w-full space-y-1">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900">PropertyFlow</h1>
              <p className="text-sm text-gray-600 mt-1">Real Estate & Construction ERP</p>
            </Link>
          </div>

          <Card className="shadow-lg border-0 lg:shadow-lg lg:border">
            <CardHeader className="">
              <CardTitle className="text-2xl font-semibold text-center">Create your company account</CardTitle>
              <CardDescription className="text-center text-base">
                Enter company details and your admin account credentials
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-1 px-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Company Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="ConstReal Ltd" {...field}
                                className="h-10 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="info@company.com" {...field}
                                className="h-10 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+2348000000000" {...field}
                                className="h-10 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   


                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Nigeria" {...field}
                                className="h-10 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="51-200 employees" {...field}
                                type="number"
                                className="h-10 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Admin User Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Admin User</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field}
                                className="h-8 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="admin@company.com" {...field}
                                className="h-8 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field}
                                className="h-9 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"

                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isLoading}>
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    )}
                    Create Company Account
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-base text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
