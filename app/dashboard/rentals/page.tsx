"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  FileText,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Clock,
} from "lucide-react"

// Mock data for rental management
const mockRentals = [
  {
    id: "L-001",
    tenant: {
      name: "John Adebayo",
      email: "john.adebayo@email.com",
      phone: "+234 801 234 5678",
      avatar: null,
    },
    property: "Sunset Apartments - Unit 2A",
    propertyAddress: "123 Main St, Lagos, Nigeria",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    monthlyRent: 28000,
    securityDeposit: 56000,
    status: "active",
    paymentStatus: "paid",
    lastPayment: "2024-01-15",
    nextDue: "2024-02-01",
    balance: 0,
    leaseType: "residential",
  },
  {
    id: "L-002",
    tenant: {
      name: "Sarah Okafor",
      email: "sarah.okafor@company.com",
      phone: "+234 802 345 6789",
      avatar: null,
    },
    property: "Downtown Office Complex - Suite 5B",
    propertyAddress: "456 Business Ave, Abuja, Nigeria",
    leaseStart: "2023-06-01",
    leaseEnd: "2025-05-31",
    monthlyRent: 150000,
    securityDeposit: 300000,
    status: "active",
    paymentStatus: "overdue",
    lastPayment: "2023-12-15",
    nextDue: "2024-01-01",
    balance: 150000,
    leaseType: "commercial",
  },
  {
    id: "L-003",
    tenant: {
      name: "Michael Emeka",
      email: "michael.emeka@email.com",
      phone: "+234 803 456 7890",
      avatar: null,
    },
    property: "Green Valley Homes - House 12",
    propertyAddress: "789 Garden Rd, Port Harcourt, Nigeria",
    leaseStart: "2023-03-01",
    leaseEnd: "2024-02-29",
    monthlyRent: 25000,
    securityDeposit: 50000,
    status: "expiring",
    paymentStatus: "paid",
    lastPayment: "2024-01-10",
    nextDue: "2024-02-01",
    balance: 0,
    leaseType: "residential",
  },
  {
    id: "L-004",
    tenant: {
      name: "Grace Nwosu",
      email: "grace.nwosu@startup.com",
      phone: "+234 804 567 8901",
      avatar: null,
    },
    property: "Tech Hub Plaza - Office 3A",
    propertyAddress: "321 Innovation St, Lagos, Nigeria",
    leaseStart: "2023-09-01",
    leaseEnd: "2025-08-31",
    monthlyRent: 120000,
    securityDeposit: 240000,
    status: "active",
    paymentStatus: "pending",
    lastPayment: "2023-12-15",
    nextDue: "2024-01-15",
    balance: 0,
    leaseType: "commercial",
  },
  {
    id: "L-005",
    tenant: {
      name: "Ahmed Hassan",
      email: "ahmed.hassan@email.com",
      phone: "+234 808 123 4567",
      avatar: null,
    },
    property: "Sunset Apartments - Unit 4B",
    propertyAddress: "123 Main St, Lagos, Nigeria",
    leaseStart: "2024-01-15",
    leaseEnd: "2025-01-14",
    monthlyRent: 32000,
    securityDeposit: 64000,
    status: "active",
    paymentStatus: "paid",
    lastPayment: "2024-01-15",
    nextDue: "2024-02-15",
    balance: 0,
    leaseType: "residential",
  },
]

export default function RentalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPayment, setFilterPayment] = useState("all")

  // Calculate summary statistics
  const totalLeases = mockRentals.length
  const activeLeases = mockRentals.filter((rental) => rental.status === "active").length
  const expiringLeases = mockRentals.filter((rental) => rental.status === "expiring").length
  const overduePayments = mockRentals.filter((rental) => rental.paymentStatus === "overdue").length
  const totalMonthlyRevenue = mockRentals.reduce((sum, rental) => sum + rental.monthlyRent, 0)
  const totalOutstanding = mockRentals.reduce((sum, rental) => sum + rental.balance, 0)

  // Filter rentals based on search and filters
  const filteredRentals = mockRentals.filter((rental) => {
    const matchesSearch =
      rental.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || rental.status === filterStatus
    const matchesPayment = filterPayment === "all" || rental.paymentStatus === filterPayment

    return matchesSearch && matchesStatus && matchesPayment
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "expiring":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Expiring Soon</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      default:
        return <Badge variant="secondary">{paymentStatus}</Badge>
    }
  }

  const getDaysUntilExpiry = (leaseEnd: string) => {
    const today = new Date()
    const endDate = new Date(leaseEnd)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <ProtectedRoute requiredPermission="rentals.manage">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Rental Management</h1>
                <p className="text-sm text-muted-foreground">Manage leases, payments, and tenant relationships</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Lease
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalLeases}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{activeLeases}</span> active leases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalMonthlyRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{expiringLeases}</div>
                <p className="text-xs text-muted-foreground">Within next 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalOutstanding)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">{overduePayments}</span> overdue payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lease Management</CardTitle>
              <CardDescription>Track and manage all rental agreements and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leases, tenants, or properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === "expiring" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("expiring")}
                  >
                    Expiring
                  </Button>
                  <Button
                    variant={filterPayment === "overdue" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPayment(filterPayment === "overdue" ? "all" : "overdue")}
                  >
                    Overdue
                  </Button>
                </div>
              </div>

              {/* Rentals List */}
              <div className="space-y-4">
                {filteredRentals.map((rental) => (
                  <Card key={rental.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-mono text-muted-foreground">{rental.id}</span>
                            <h3 className="text-lg font-semibold text-foreground">{rental.tenant.name}</h3>
                            {getStatusBadge(rental.status)}
                            {getPaymentBadge(rental.paymentStatus)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {rental.property}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {rental.tenant.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {rental.tenant.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Rent</p>
                          <p className="font-semibold text-foreground">{formatCurrency(rental.monthlyRent)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Lease Period</p>
                          <p className="font-semibold">
                            {new Date(rental.leaseStart).toLocaleDateString()} -{" "}
                            {new Date(rental.leaseEnd).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Security Deposit</p>
                          <p className="font-semibold">{formatCurrency(rental.securityDeposit)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Payment</p>
                          <p className="font-semibold">{new Date(rental.lastPayment).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Outstanding</p>
                          <p className={`font-semibold ${rental.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                            {formatCurrency(rental.balance)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Next due: {new Date(rental.nextDue).toLocaleDateString()}
                            </span>
                          </div>
                          {rental.status === "expiring" && (
                            <div className="flex items-center text-yellow-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Expires in {getDaysUntilExpiry(rental.leaseEnd)} days</span>
                            </div>
                          )}
                          {rental.paymentStatus === "overdue" && (
                            <div className="flex items-center text-red-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span>Payment Overdue</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Lease
                          </Button>
                          <Button size="sm">
                            {rental.paymentStatus === "overdue"
                              ? "Collect Payment"
                              : rental.status === "expiring"
                                ? "Renew Lease"
                                : "Manage"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredRentals.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No rental agreements found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
