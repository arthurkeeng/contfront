"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Hammer, Users, FileText, DollarSign, BarChart3, Shield, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { subscriptions } from "./data/subscription"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"real-estate" | "construction">("real-estate")

  // at this point , we get the subscription plan the user clicked on

  const router = useRouter()
  const getSubscriptionPlan = async (name: string, industry: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch-subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        industry: industry.trim(),
      }),
    })
    console.log(res)
    if (res.ok) {
      const det = await res.json()
      console.log("the data is ", det)
      try {
        await handlePay(det.price, det.id, det.industry)
      } catch (error) {}
    }
  }

  const handlePay = async (price: string, subscription_id: string, industry: string) => {
    // 2️⃣ Launch Paystack
    const { default: PaystackPop } = await import("@paystack/inline-js")
    const paystack = new PaystackPop()
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: "omnidev.build@gmail.com",
      amount: Math.ceil(Number.parseInt(price) * 100),
      onSuccess: (tran) => {
        // 4️⃣ Verify payment
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: tran.reference }),
        })
          .then((res) => res.json())
          .then(async ({ data }) => {
            console.log("the data is ", data)
            if (data.status === "success") {
              // the follow up will be placed here
              localStorage.setItem(
                "credentials",
                JSON.stringify({
                  subscription_id,
                  industry,
                  paystack_ref: tran.reference,
                  amount: price,
                  currency: "NGN",
                }),
              )
              toast.success("Payment Successful. One minute - Redirecting to sign up")
              router.push("/auth/signup")
            } else {
              console.error("Verification failed:", data.error)
            }
          })
          .catch((err) => console.error("Verify error", err))
      },
      onCancel: () => {},
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8" />
            <span className="text-xl font-bold">PropertyFlow</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-accent transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-accent transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href={"/auth/signin"}>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                Sign In
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="secondary" size="sm" className="mr-2">
                View Properties
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="secondary" size="sm">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start space-x-4 mb-6">
                <Badge variant="secondary" className="px-3 py-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  Real Estate
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Hammer className="w-4 h-4 mr-1" />
                  Construction
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Streamline Your Operations with Our ERP Solution
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Tailored for Real Estate and Construction Management. Manage properties, projects, contracts, and teams
                all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/properties">
                  <Button size="lg" className="px-8 py-3">
                    View Properties
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                width={40}
                height={40}
                src="/modern-office-building-with-construction-site-in-b.png"
                alt="PropertyFlow ERP Dashboard"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30" id="about">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how PropertyFlow ERP transforms your daily operations
            </p>
          </div>

          {/* Property Management Feature */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-accent mr-3" />
                <h3 className="text-2xl font-bold">Smart Property Management</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Manage your entire property portfolio from one dashboard. Track occupancy, handle maintenance requests,
                and automate rent collection with ease.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Automated rent collection and late fee processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Real-time occupancy and vacancy tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Integrated maintenance request system</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                width={40}
                height={40}
                src="/property-management-dashboard-showing-building-lis.png"
                alt="Property Management Dashboard"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>

          {/* Construction Management Feature */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1 relative">
              <Image
                width={40}
                height={40}
                src="/construction-project-timeline-dashboard-with-gantt.png"
                alt="Construction Management Dashboard"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <Hammer className="h-8 w-8 text-accent mr-3" />
                <h3 className="text-2xl font-bold">Advanced Project Tracking</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Keep your construction projects on time and under budget. Monitor progress, manage resources, and
                coordinate teams with powerful project management tools.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Interactive project timelines and milestones</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Resource allocation and budget tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Contractor and subcontractor management</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Team Collaboration Feature */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-accent mr-3" />
                <h3 className="text-2xl font-bold">Seamless Team Collaboration</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Connect your entire team with role-based access, real-time notifications, and mobile-friendly interfaces
                for field workers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Role-based permissions and access control</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Real-time notifications and updates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span>Mobile-optimized for field operations</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                width={40}
                height={40}
                src="/team-collaboration-interface-showing-user-roles--n.png"
                alt="Team Collaboration Interface"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Your Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From property management to construction projects, our ERP handles it all
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Building2 className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  Manage properties, track availability, handle leases, and maintain tenant relationships
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Hammer className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Project Tracking</CardTitle>
                <CardDescription>
                  Monitor construction projects, track progress, manage resources, and meet deadlines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Coordinate teams, assign tasks, track maintenance requests, and manage contractors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <FileText className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Store contracts, leases, permits, and project documents in one secure location
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Financial Tracking</CardTitle>
                <CardDescription>
                  Handle rent collection, project budgets, expenses, and generate financial reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Get insights with detailed reports on occupancy, project progress, and profitability
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Every Role in Your Organization
            </h2>
            <p className="text-xl text-muted-foreground">
              Tailored interfaces and permissions for different user types
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Admin</CardTitle>
                <CardDescription>
                  Full system access, manage all properties, users, and generate comprehensive reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Property Manager</CardTitle>
                <CardDescription>
                  Manage assigned properties, approve maintenance, handle tenant communications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Tenant Portal</CardTitle>
                <CardDescription>
                  View contracts, pay rent, submit maintenance requests, access documents
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Hammer className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Maintenance Staff</CardTitle>
                <CardDescription>Receive work orders, update ticket status, upload completion photos</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose your industry and find the perfect plan</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("real-estate")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "real-estate"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Real Estate
              </button>
              <button
                onClick={() => setActiveTab("construction")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "construction"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Hammer className="w-4 h-4 inline mr-2" />
                Construction
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptions[activeTab].map((plan, idx) => {
              return (
                <Card key={idx} className={`relative ${plan.popular ? "border-accent border-2 scale-105" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary">
                      ${plan.price}
                      <span className="text-lg font-normal text-muted-foreground">/mo</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={async () => {
                        try {
                          const subscription = await getSubscriptionPlan(plan.name, activeTab)
                          console.log("subscription from button click", subscription)

                          // Example: save to state or redirect
                          // setSelectedPlan(subscription);
                          // router.push("/signup?plan=" + subscription.name);
                        } catch (err) {
                          console.error("Failed to fetch subscription", err)
                        }
                      }}
                      className={`w-full ${plan.popular ? "" : "bg-transparent"}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12 p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Need More?</h3>
            <p className="text-muted-foreground mb-4">
              For unlimited properties/projects, white-labeling, and custom integrations
            </p>
            <Button variant="outline">Contact Sales for Enterprise</Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of real estate and construction companies already using PropertyFlow ERP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="px-8 py-3">
              Schedule a Demo
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Properties Managed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-bold">PropertyFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamlining real estate and construction operations with powerful ERP solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PropertyFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
