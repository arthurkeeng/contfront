"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  Home,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Clock,
  MapPin,
  Eye,
  UserPlus,
} from "lucide-react"

// Mock data for occupancy tracking
const mockOccupancyData = [
  {
    id: 1,
    propertyName: "Sunset Apartments",
    address: "123 Main St, Lagos",
    totalUnits: 24,
    occupiedUnits: 22,
    vacantUnits: 2,
    occupancyRate: 92,
    avgVacancyDuration: 15, // days
    lastTurnover: "2024-01-10",
    prospectiveInquiries: 8,
    scheduledViewings: 3,
    vacantUnitsDetails: [
      { unit: "2B", vacantSince: "2024-01-05", reason: "lease_ended", rent: 28000 },
      { unit: "4A", vacantSince: "2024-01-12", reason: "tenant_moved", rent: 32000 },
    ],
  },
  {
    id: 2,
    propertyName: "Downtown Office Complex",
    address: "456 Business Ave, Abuja",
    totalUnits: 12,
    occupiedUnits: 10,
    vacantUnits: 2,
    occupancyRate: 83,
    avgVacancyDuration: 22,
    lastTurnover: "2023-12-20",
    prospectiveInquiries: 12,
    scheduledViewings: 5,
    vacantUnitsDetails: [
      { unit: "5B", vacantSince: "2023-12-20", reason: "lease_ended", rent: 150000 },
      { unit: "7A", vacantSince: "2024-01-08", reason: "renovation", rent: 180000 },
    ],
  },
  {
    id: 3,
    propertyName: "Green Valley Homes",
    address: "789 Garden Rd, Port Harcourt",
    totalUnits: 18,
    occupiedUnits: 15,
    vacantUnits: 3,
    occupancyRate: 83,
    avgVacancyDuration: 28,
    lastTurnover: "2024-01-01",
    prospectiveInquiries: 6,
    scheduledViewings: 2,
    vacantUnitsDetails: [
      { unit: "House 8", vacantSince: "2023-12-15", reason: "lease_ended", rent: 22000 },
      { unit: "House 12", vacantSince: "2024-01-01", reason: "tenant_moved", rent: 25000 },
      { unit: "House 15", vacantSince: "2024-01-03", reason: "maintenance", rent: 20000 },
    ],
  },
  {
    id: 4,
    propertyName: "Tech Hub Plaza",
    address: "321 Innovation St, Lagos",
    totalUnits: 8,
    occupiedUnits: 8,
    vacantUnits: 0,
    occupancyRate: 100,
    avgVacancyDuration: 0,
    lastTurnover: "2023-11-15",
    prospectiveInquiries: 15,
    scheduledViewings: 0,
    vacantUnitsDetails: [],
  },
]

export default function OccupancyTracking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Calculate overall statistics
  const totalUnits = mockOccupancyData.reduce((sum, property) => sum + property.totalUnits, 0)
  const totalOccupied = mockOccupancyData.reduce((sum, property) => sum + property.occupiedUnits, 0)
  const totalVacant = mockOccupancyData.reduce((sum, property) => sum + property.vacantUnits, 0)
  const overallOccupancyRate = Math.round((totalOccupied / totalUnits) * 100)
  const totalInquiries = mockOccupancyData.reduce((sum, property) => sum + property.prospectiveInquiries, 0)
  const totalViewings = mockOccupancyData.reduce((sum, property) => sum + property.scheduledViewings, 0)
  const avgVacancyDuration = Math.round(
    mockOccupancyData.reduce((sum, property) => sum + property.avgVacancyDuration, 0) / mockOccupancyData.length,
  )

  // Filter properties based on search and filter
  const filteredProperties = mockOccupancyData.filter((property) => {
    const matchesSearch =
      property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterStatus === "high-occupancy") {
      matchesFilter = property.occupancyRate >= 90
    } else if (filterStatus === "low-occupancy") {
      matchesFilter = property.occupancyRate < 80
    } else if (filterStatus === "has-vacancies") {
      matchesFilter = property.vacantUnits > 0
    }

    return matchesSearch && matchesFilter
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getOccupancyBadge = (rate: number) => {
    if (rate >= 95) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
    } else if (rate >= 85) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good</Badge>
    } else if (rate >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Fair</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor</Badge>
    }
  }

  const getVacancyReasonBadge = (reason: string) => {
    switch (reason) {
      case "lease_ended":
        return <Badge variant="secondary">Lease Ended</Badge>
      case "tenant_moved":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Tenant Moved</Badge>
      case "renovation":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Renovation</Badge>
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{reason}</Badge>
    }
  }

  const getDaysVacant = (vacantSince: string) => {
    const today = new Date()
    const vacantDate = new Date(vacantSince)
    const diffTime = today.getTime() - vacantDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Occupancy Tracking</h1>
              <p className="text-sm text-muted-foreground">Monitor vacancy rates and tenant turnover</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Prospect
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Occupancy</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overallOccupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalOccupied} of {totalUnits} units occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vacant Units</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalVacant}</div>
              <p className="text-xs text-muted-foreground">Avg. vacancy: {avgVacancyDuration} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalInquiries}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Viewings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalViewings}</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Occupancy Overview</CardTitle>
            <CardDescription>Track occupancy rates and manage vacant units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
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
                  variant={filterStatus === "high-occupancy" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("high-occupancy")}
                >
                  High Occupancy
                </Button>
                <Button
                  variant={filterStatus === "has-vacancies" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("has-vacancies")}
                >
                  Has Vacancies
                </Button>
              </div>
            </div>

            {/* Properties List */}
            <div className="space-y-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{property.propertyName}</h3>
                          {getOccupancyBadge(property.occupancyRate)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-foreground">{property.occupancyRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Occupied Units</p>
                        <p className="font-semibold text-green-600">{property.occupiedUnits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vacant Units</p>
                        <p className="font-semibold text-red-600">{property.vacantUnits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Inquiries</p>
                        <p className="font-semibold">{property.prospectiveInquiries}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Viewings</p>
                        <p className="font-semibold">{property.scheduledViewings}</p>
                      </div>
                    </div>

                    {/* Vacant Units Details */}
                    {property.vacantUnits > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-foreground mb-3">Vacant Units</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {property.vacantUnitsDetails.map((unit, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">{unit.unit}</span>
                                  {getVacancyReasonBadge(unit.reason)}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Vacant for {getDaysVacant(unit.vacantSince)} days
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(unit.rent)}</p>
                                <p className="text-xs text-muted-foreground">per month</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Last turnover: {new Date(property.lastTurnover).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Avg. vacancy: {property.avgVacancyDuration} days
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Analytics
                        </Button>
                        <Button size="sm">Manage Units</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
