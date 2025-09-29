"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  Users,
  ArrowLeft,
  Phone,
  Mail,
  User,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Dumbbell,
  Shield,
  Waves,
} from "lucide-react"
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
  description?: string
  created_at: string
}

interface Unit {
  id: string
  property_id: string
  unit_number: string
  unit_type: string
  bedrooms: number
  bathrooms: number
  floor_number: number
  square_footage: number
  monthly_rent?: number
  sale_price?: number
  lease_price?: number
  currency: string
  status: string
  amenities: string[]
  description?: string
}

interface PropertyManager {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
}

// Mock data - replace with actual API calls
const mockProperty: Property = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  property_name: "Sunset Gardens Estate",
  property_address: "123 Sunset Boulevard, Victoria Island, Lagos, Nigeria",
  category: "house",
  transaction_type: "rent",
  property_type: "Residential",
  units: 24,
  occupied: 18,
  vacant: 6,
  monthly_rent: 850000,
  currency: "NGN",
  property_status: "Active",
  description:
    "A beautiful residential estate with modern amenities and excellent security. Located in the heart of Victoria Island with easy access to business districts and recreational facilities.",
  created_at: "2024-01-15T10:30:00Z",
}

const mockUnits: Unit[] = [
  {
    id: "unit-001",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "A101",
    unit_type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    floor_number: 1,
    square_footage: 1200,
    monthly_rent: 750000,
    currency: "NGN",
    status: "available",
    amenities: ["wifi", "parking", "security", "gym"],
    description: "Spacious 2-bedroom apartment with modern finishes and great natural light.",
  },
  {
    id: "unit-002",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "B205",
    unit_type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    floor_number: 2,
    square_footage: 1500,
    monthly_rent: 950000,
    currency: "NGN",
    status: "available",
    amenities: ["wifi", "parking", "security", "gym", "pool"],
    description: "Premium 3-bedroom apartment with balcony and pool access.",
  },
  {
    id: "unit-003",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "C301",
    unit_type: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    floor_number: 3,
    square_footage: 2000,
    monthly_rent: 1200000,
    currency: "NGN",
    status: "available",
    amenities: ["wifi", "parking", "security", "gym", "pool"],
    description: "Luxury penthouse with panoramic city views and premium amenities.",
  },
  {
    id: "unit-004",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "A102",
    unit_type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    floor_number: 1,
    square_footage: 800,
    monthly_rent: 600000,
    currency: "NGN",
    status: "occupied",
    amenities: ["wifi", "parking", "security"],
    description: "Cozy 1-bedroom apartment perfect for singles or couples.",
  },
]

const mockPropertyManager: PropertyManager = {
  id: "pm-001",
  name: "Adebayo Johnson",
  email: "adebayo.johnson@sunsetgardens.com",
  phone: "+234 803 123 4567",
  company: "Sunset Properties Ltd",
  role: "Property Manager",
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>(mockProperty)
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([])
  const [propertyManager, setPropertyManager] = useState<PropertyManager>(mockPropertyManager)
  const router = useRouter()

  useEffect(() => {
    const available = mockUnits.filter((unit) => unit.status === "available")
    setAvailableUnits(available)
  }, [])

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

  const getUnitPrice = (unit: Unit) => {
    switch (property.transaction_type) {
      case "rent":
        return unit.monthly_rent ? `${unit.currency} ${unit.monthly_rent.toLocaleString()}/month` : "Price on request"
      case "buy":
        return unit.sale_price ? `${unit.currency} ${unit.sale_price.toLocaleString()}` : "Price on request"
      case "lease":
        return unit.lease_price ? `${unit.currency} ${unit.lease_price.toLocaleString()}/year` : "Price on request"
      default:
        return "Price on request"
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "gym":
        return <Dumbbell className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "pool":
        return <Waves className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/properties")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Properties</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">{property.property_name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">{property.property_name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{property.property_address}</span>
              </div>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {property.transaction_type}
                </Badge>
                <Badge variant="secondary">{property.property_type}</Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">{property.property_status}</Badge>
              </div>
              {property.description && <p className="text-muted-foreground leading-relaxed">{property.description}</p>}
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <span className="font-semibold text-primary text-lg">{getPrice(property)}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{property.units} units</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{availableUnits.length} available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs defaultValue="units" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="units">Available Units ({availableUnits.length})</TabsTrigger>
            <TabsTrigger value="contact">Contact Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="space-y-6">
            {availableUnits.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableUnits.map((unit) => (
                  <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Unit {unit.unit_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">{unit.unit_type}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Unit Specs */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{unit.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{unit.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{unit.square_footage} sqft</span>
                        </div>
                      </div>

                      {/* Description */}
                      {unit.description && <p className="text-sm text-muted-foreground">{unit.description}</p>}

                      {/* Amenities */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {unit.amenities.map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md"
                            >
                              {getAmenityIcon(amenity)}
                              <span className="capitalize">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Price and Contact */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Floor {unit.floor_number}</p>
                          <p className="font-semibold text-primary">{getUnitPrice(unit)}</p>
                        </div>
                        <Button size="sm">Contact Manager</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Units</h3>
                <p className="text-muted-foreground">
                  All units in this property are currently occupied. Check back later for availability.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Property Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{propertyManager.name}</h3>
                    <p className="text-muted-foreground">{propertyManager.role}</p>
                    <p className="text-sm text-muted-foreground">{propertyManager.company}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{propertyManager.phone}</p>
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{propertyManager.email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
