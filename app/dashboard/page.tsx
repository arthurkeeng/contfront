"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Users,
  Wrench,
  DollarSign,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    name: "Sunset Apartments",
    address: "123 Main St, Lagos, Nigeria",
    type: "Residential",
    units: 24,
    occupied: 22,
    vacant: 2,
    monthlyRevenue: 480000,
    status: "active",
    lastInspection: "2024-01-15",
    maintenanceRequests: 3,
  },
  {
    id: 2,
    name: "Downtown Office Complex",
    address: "456 Business Ave, Abuja, Nigeria",
    type: "Commercial",
    units: 12,
    occupied: 10,
    vacant: 2,
    monthlyRevenue: 1200000,
    status: "active",
    lastInspection: "2024-01-10",
    maintenanceRequests: 1,
  },
  {
    id: 3,
    name: "Green Valley Homes",
    address: "789 Garden Rd, Port Harcourt, Nigeria",
    type: "Residential",
    units: 18,
    occupied: 15,
    vacant: 3,
    monthlyRevenue: 360000,
    status: "maintenance",
    lastInspection: "2024-01-05",
    maintenanceRequests: 7,
  },
  {
    id: 4,
    name: "Tech Hub Plaza",
    address: "321 Innovation St, Lagos, Nigeria",
    type: "Commercial",
    units: 8,
    occupied: 8,
    vacant: 0,
    monthlyRevenue: 960000,
    status: "active",
    lastInspection: "2024-01-20",
    maintenanceRequests: 0,
  },
]

export default function PropertyDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Calculate summary statistics
  const totalProperties = mockProperties.length
  const totalUnits = mockProperties.reduce((sum, prop) => sum + prop.units, 0)
  const totalOccupied = mockProperties.reduce((sum, prop) => sum + prop.occupied, 0)
  const totalVacant = mockProperties.reduce((sum, prop) => sum + prop.vacant, 0)
  const totalRevenue = mockProperties.reduce((sum, prop) => sum + prop.monthlyRevenue, 0)
  const totalMaintenanceRequests = mockProperties.reduce((sum, prop) => sum + prop.maintenanceRequests, 0)
  const occupancyRate = Math.round((totalOccupied / totalUnits) * 100)

  // Filter properties based on search and filter
  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || property.type.toLowerCase() === filterType.toLowerCase()
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
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Property Management</h1>
              <p className="text-sm text-muted-foreground">Dashboard Overview</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href ="/dashboard/addproperty">

            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
            </Link>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalOccupied} of {totalUnits} units occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalMaintenanceRequests}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+3</span> pending requests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Properties</CardTitle>
            <CardDescription>Manage and monitor all your properties</CardDescription>
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
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "residential" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("residential")}
                >
                  Residential
                </Button>
                <Button
                  variant={filterType === "commercial" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("commercial")}
                >
                  Commercial
                </Button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(property.status)}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{property.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Units</p>
                        <p className="font-medium">{property.units}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">{formatCurrency(property.monthlyRevenue)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          <span>{property.occupied} Occupied</span>
                        </div>
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
                          <span>{property.vacant} Vacant</span>
                        </div>
                      </div>
                      {property.maintenanceRequests > 0 && (
                        <div className="flex items-center text-red-600">
                          <Wrench className="h-4 w-4 mr-1" />
                          <span>{property.maintenanceRequests} requests</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Last inspection: {new Date(property.lastInspection).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
