"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Search,
  Building2,
  Users,
  DollarSign,
  Wrench,
  PieChart,
  LineChart,
  FileText,
} from "lucide-react"

// Mock data for reports
const mockReportData = {
  overview: {
    totalRevenue: 3000000,
    revenueGrowth: 12.5,
    totalProperties: 4,
    occupancyRate: 89,
    maintenanceCosts: 100000,
    maintenanceGrowth: -8.2,
    avgRentPerUnit: 48387,
  },
  monthlyRevenue: [
    { month: "Jan", revenue: 2800000, occupancy: 85 },
    { month: "Feb", revenue: 2850000, occupancy: 87 },
    { month: "Mar", revenue: 2900000, occupancy: 88 },
    { month: "Apr", revenue: 2950000, occupancy: 89 },
    { month: "May", revenue: 3000000, occupancy: 89 },
    { month: "Jun", revenue: 3050000, occupancy: 91 },
  ],
  propertyPerformance: [
    { name: "Sunset Apartments", revenue: 480000, occupancy: 92, maintenance: 25000 },
    { name: "Downtown Office Complex", revenue: 1200000, occupancy: 83, maintenance: 45000 },
    { name: "Green Valley Homes", revenue: 360000, occupancy: 83, maintenance: 35000 },
    { name: "Tech Hub Plaza", revenue: 960000, occupancy: 100, maintenance: 15000 },
  ],
  maintenanceBreakdown: [
    { category: "Plumbing", cost: 35000, percentage: 35 },
    { category: "Electrical", cost: 25000, percentage: 25 },
    { category: "HVAC", cost: 20000, percentage: 20 },
    { category: "General", cost: 20000, percentage: 20 },
  ],
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-6-months")
  const [selectedProperty, setSelectedProperty] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getGrowthBadge = (growth: number) => {
    if (growth > 0) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <TrendingUp className="h-3 w-3 mr-1" />+{growth}%
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <TrendingDown className="h-3 w-3 mr-1" />
          {growth}%
        </Badge>
      )
    }
  }

  return (
    <ProtectedRoute requiredPermission="*">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">Comprehensive business insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 6 Months
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockReportData.overview.totalRevenue)}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {getGrowthBadge(mockReportData.overview.revenueGrowth)}
                  <span className="text-xs text-muted-foreground">from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockReportData.overview.occupancyRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Across all properties</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Costs</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockReportData.overview.maintenanceCosts)}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {getGrowthBadge(mockReportData.overview.maintenanceGrowth)}
                  <span className="text-xs text-muted-foreground">from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rent/Unit</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockReportData.overview.avgRentPerUnit)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Monthly average</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-chart-1" />
                  Revenue & Occupancy Trends
                </CardTitle>
                <CardDescription>Monthly performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Revenue trend chart would be displayed here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing {mockReportData.monthlyRevenue.length} months of data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-chart-2" />
                  Maintenance Cost Breakdown
                </CardTitle>
                <CardDescription>Distribution of maintenance expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Maintenance breakdown chart would be displayed here</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      {mockReportData.maintenanceBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: `var(--chart-${index + 1})`,
                            }}
                          />
                          <span className="text-muted-foreground">
                            {item.category}: {item.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                Property Performance Analysis
              </CardTitle>
              <CardDescription>Detailed performance metrics for each property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search properties..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Property</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Monthly Revenue</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Occupancy</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Maintenance</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Net Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReportData.propertyPerformance.map((property, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">{property.name}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">{formatCurrency(property.revenue)}</td>
                        <td className="py-4 px-4 text-right">
                          <Badge
                            className={
                              property.occupancy >= 90
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : property.occupancy >= 80
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {property.occupancy}%
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right text-muted-foreground">
                          {formatCurrency(property.maintenance)}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-foreground">
                          {formatCurrency(property.revenue - property.maintenance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Report Actions
              </CardTitle>
              <CardDescription>Generate and export detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                  <DollarSign className="h-6 w-6" />
                  <span>Financial Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                  <Users className="h-6 w-6" />
                  <span>Occupancy Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                  <Wrench className="h-6 w-6" />
                  <span>Maintenance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
