"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
} from "lucide-react"

// Mock data for rentals/leases
const mockRentals = [
  {
    id: 1,
    tenantName: "John Adebayo",
    tenantEmail: "john.adebayo@email.com",
    tenantPhone: "+234 801 234 5678",
    propertyName: "Sunset Apartments - Unit 2A",
    propertyAddress: "123 Main St, Lagos",
    monthlyRent: 25000,
    leaseStart: "2023-06-01",
    leaseEnd: "2024-05-31",
    status: "active",
    paymentStatus: "paid",
    lastPayment: "2024-01-01",
    nextPayment: "2024-02-01",
    securityDeposit: 50000,
    outstandingBalance: 0,
  },
  {
    id: 2,
    tenantName: "Sarah Okafor",
    tenantEmail: "sarah.okafor@email.com",
    tenantPhone: "+234 802 345 6789",
    propertyName: "Downtown Office Complex - Suite 5B",
    propertyAddress: "456 Business Ave, Abuja",
    monthlyRent: 120000,
    leaseStart: "2023-03-15",
    leaseEnd: "2025-03-14",
    status: "active",
    paymentStatus: "overdue",
    lastPayment: "2023-12-15",
    nextPayment: "2024-01-15",
    securityDeposit: 240000,
    outstandingBalance: 120000,
  },
  {
    id: 3,
    tenantName: "Michael Emeka",
    tenantEmail: "michael.emeka@email.com",
    tenantPhone: "+234 803 456 7890",
    propertyName: "Green Valley Homes - House 12",
    propertyAddress: "789 Garden Rd, Port Harcourt",
    monthlyRent: 18000,
    leaseStart: "2023-09-01",
    leaseEnd: "2024-08-31",
    status: "expiring",
    paymentStatus: "paid",
    lastPayment: "2024-01-01",
    nextPayment: "2024-02-01",
    securityDeposit: 36000,
    outstandingBalance: 0,
  },
  {
    id: 4,
    tenantName: "Grace Nwosu",
    tenantEmail: "grace.nwosu@email.com",
    tenantPhone: "+234 804 567 8901",
    propertyName: "Tech Hub Plaza - Office 3A",
    propertyAddress: "321 Innovation St, Lagos",
    monthlyRent: 150000,
    leaseStart: "2024-01-01",
    leaseEnd: "2026-12-31",
    status: "active",
    paymentStatus: "pending",
    lastPayment: "2023-12-01",
    nextPayment: "2024-01-01",
    securityDeposit: 300000,
    outstandingBalance: 0,
  },
]

export default function RentalManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Calculate summary statistics
  const totalRentals = mockRentals.length
  const activeRentals = mockRentals.filter((rental) => rental.status === "active").length
  const totalMonthlyRevenue = mockRentals.reduce((sum, rental) => sum + rental.monthlyRent, 0)
  const overduePayments = mockRentals.filter((rental) => rental.paymentStatus === "overdue").length
  const expiringLeases = mockRentals.filter((rental) => rental.status === "expiring").length
  const totalOutstanding = mockRentals.reduce((sum, rental) => sum + rental.outstandingBalance, 0)

  // Filter rentals based on search and filter
  const filteredRentals = mockRentals.filter((rental) => {
    const matchesSearch =
      rental.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || rental.status === filterStatus
    return matchesSearch && matchesFilter
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Rental Management</h1>
              <p className="text-sm text-muted-foreground">Leases, Payments & Tenants</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeRentals}</div>
              <p className="text-xs text-muted-foreground">of {totalRentals} total leases</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Payments</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overduePayments}</div>
              <p className="text-xs text-muted-foreground">Outstanding: {formatCurrency(totalOutstanding)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Leases</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{expiringLeases}</div>
              <p className="text-xs text-muted-foreground">within next 90 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rental Agreements</CardTitle>
            <CardDescription>Manage leases, payments, and tenant relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants or properties..."
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
                          <h3 className="text-lg font-semibold text-foreground">{rental.tenantName}</h3>
                          {getStatusBadge(rental.status)}
                          {getPaymentStatusBadge(rental.paymentStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{rental.propertyName}</p>
                        <p className="text-xs text-muted-foreground">{rental.propertyAddress}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        <p className="font-semibold">{formatCurrency(rental.monthlyRent)}</p>
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
                        <p className="text-xs text-muted-foreground">Outstanding Balance</p>
                        <p
                          className={`font-semibold ${rental.outstandingBalance > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {formatCurrency(rental.outstandingBalance)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Last payment: {new Date(rental.lastPayment).toLocaleDateString()}
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
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Payment overdue</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Lease
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRentals.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No rentals found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
