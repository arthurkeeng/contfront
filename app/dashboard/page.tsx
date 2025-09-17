"use client"

import { useEffect, useState } from "react"
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

// TypeScript interface matching backend response
interface Property {
  id: string
  company_id: string
  property_name: string
  property_address: string
  category: string
  transaction_type: string
  property_type: string | null
  units: number | null
  occupied: number | null
  vacant: number | null
  monthly_rent: string | null
  sale_price: string | null
  lease_price: string | null
  currency: string | null
  property_status: string
  last_inspection: string | null
  maintenance_requests: number | null
}

export default function PropertyDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [properties, setProperties] = useState<Property[]>([])

  let user = JSON.parse(localStorage.getItem("propertyflow_user")!)
  let company = JSON.parse(localStorage.getItem("propertyflow_company")!)

  useEffect(() => {
    const getProperties = async () => {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch_properties_as_admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: company?.company_id,
          user_id: user?.user_id,
        }),
      })
      if (res.ok) {
        let props: Property[] = await res.json()
        console.log("the properties are", props)
        setProperties(props)
      } else {
        console.log("error fetching properties")
      }
    }
    getProperties()
  }, [])

  // Summary statistics
  // Calculate summary statistics
const totalProperties = properties.length
const totalUnits = properties.reduce((sum, prop) => sum + (prop.units || 0), 0)
const totalOccupied = properties.reduce((sum, prop) => sum + (prop.occupied || 0), 0)
const totalVacant = properties.reduce((sum, prop) => sum + (prop.vacant || 0), 0)
const totalRevenue = properties.reduce((sum, prop) => sum + (Number(prop.monthly_rent )|| 0), 0)
const totalSaleValue = properties.reduce((sum, prop) => sum + (Number(prop.sale_price) || 0), 0)
const totalLeaseValue = properties.reduce((sum, prop) => sum + (Number(prop.lease_price) || 0), 0)
const totalMaintenanceRequests = properties.reduce((sum, prop) => sum + (prop.maintenance_requests || 0), 0)
const occupancyRate = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0


  // Search + Filter
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property_address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || (property.property_type ?? "").toLowerCase() === filterType.toLowerCase()
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
            <Link href="/dashboard/addproperty">
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
          {/* Total Properties */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalProperties}</div>
            </CardContent>
          </Card>

          {/* Occupancy */}
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

          {/* Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Rent Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalMaintenanceRequests}</div>
            </CardContent>
          </Card>
          
        </div>

        {/* Search and Filter */}
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
                <Button
                  variant={filterType === "land" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("land")}
                >
                  Land
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
                        <CardTitle className="text-lg">{property.property_name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.property_address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(property.property_status)}
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
                        <p className="font-medium">{property.property_type ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Units</p>
                        <p className="font-medium">{property.units ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rent</p>
                        <p className="font-medium">
                          {property.monthly_rent ? formatCurrency(Number(property.monthly_rent)) : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          <span>{property.occupied ?? 0} Occupied</span>
                        </div>
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
                          <span>{property.vacant ?? 0} Vacant</span>
                        </div>
                      </div>
                      {property.maintenance_requests && property.maintenance_requests > 0 && (
                        <div className="flex items-center text-red-600">
                          <Wrench className="h-4 w-4 mr-1" />
                          <span>{property.maintenance_requests} requests</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Last inspection:{" "}
                        {property.last_inspection
                          ? new Date(property.last_inspection).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div className="flex space-x-2">
                      <Link href ={`/dashboard/${property.id}`}>
                      
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
