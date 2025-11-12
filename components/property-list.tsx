"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Users, DollarSign, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Property {
  id: string
  property_name: string
  property_address: string
  category: string
  transaction_type: string
  property_type?: string
  units: number
  occupied: number
  vacant: number
  monthly_rent?: number
  sale_price?: number
  lease_price?: number
  currency: string
  property_status: string
  created_at: string
}



export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [transactionFilter, setTransactionFilter] = useState("all")
  const router = useRouter()

 useEffect(() => {
  // Fetch properties once when component mounts
  const fetchProperties = async () => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client/properties`)
      const response = await req.json()
      setProperties(response.properties || [])
    } catch (error) {
      console.error("Error fetching properties:", error)
    }
  }

  fetchProperties()
}, []) 

useEffect(() => {
  let filtered = properties.filter(
    (property) => property.property_status.toLowerCase() === "active"
  )

  if (searchTerm) {
    filtered = filtered.filter(
      (property) =>
        property.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (typeFilter !== "all") {
    filtered = filtered.filter(
      (property) =>
        property.property_type?.toLowerCase() === typeFilter.toLowerCase()
    )
  }

  if (transactionFilter !== "all") {
    filtered = filtered.filter(
      (property) => property.transaction_type === transactionFilter
    )
  }

  setFilteredProperties(filtered)
}, [searchTerm, typeFilter, transactionFilter, properties]) 


  const getPrice = (property: Property) => {
    switch (property.transaction_type) {
      case "rent":
        return property.monthly_rent
          ? `${property.currency} ${property.monthly_rent.toLocaleString()}/month`
          : "Price on request"
      case "buy":
        return property.sale_price ? `${property.currency} ${property.sale_price.toLocaleString()}` : "Price on request"
      case "lease":
        return property.lease_price
          ? `${property.currency} ${property.lease_price.toLocaleString()}/year`
          : "Price on request"
      default:
        return "Price on request"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Find Properties</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Available Properties</h1>
          <p className="text-muted-foreground">
            Discover your perfect home or investment property. Browse available units and contact property managers
            directly.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="buy">For Sale</SelectItem>
                  <SelectItem value="lease">For Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/property/${property.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{property.property_name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">{property.property_address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {property.transaction_type}
                    </Badge>
                    <Badge variant="secondary">{property.property_type}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Units Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{property.units} units</span>
                        </div>
                        <div className="text-green-600">{property.vacant} available</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="font-semibold text-primary">{getPrice(property)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== "all" || transactionFilter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "No properties are currently available. Check back later for new listings."}
            </p>
          </div>
        )}

        {filteredProperties.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{filteredProperties.length}</div>
                <div className="text-sm text-muted-foreground">Available Properties</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredProperties.reduce((sum, p) => sum + p.vacant, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Available Units</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredProperties.filter((p) => p.transaction_type === "rent").length}
                </div>
                <div className="text-sm text-muted-foreground">For Rent</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
