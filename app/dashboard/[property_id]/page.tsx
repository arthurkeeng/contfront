"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { X, Upload, FileText, ImageIcon, MapPin, Home, DollarSign, Users, Settings, Save, Edit, Building2, Calendar, Download } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UnitsManagement from "@/components/Unit-management"





const mockUnits = [
  {
    id: "1",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "A1",
    unit_type: "apartment",
    bedrooms: 2,
    bathrooms: 1.5,
    floor_number: 1,
    square_footage: 850,
    monthly_rent: 200000,
    currency: "NGN",
    status: "occupied" as const,
    amenities: ["Air Conditioning", "Balcony", "Parking"],
    description: "Spacious 2-bedroom apartment with city view",
    tenant_name: "John Doe",
    tenant_email: "john@example.com",
    tenant_phone: "+234 801 234 5678",
    lease_start: "2024-01-01",
    lease_end: "2024-12-31",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "A2",
    unit_type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    floor_number: 1,
    square_footage: 600,
    monthly_rent: 150000,
    currency: "NGN",
    status: "available" as const,
    amenities: ["Air Conditioning", "Parking"],
    description: "Cozy 1-bedroom apartment",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    property_id: "123e4567-e89b-12d3-a456-426614174000",
    unit_number: "B1",
    unit_type: "studio",
    bedrooms: 0,
    bathrooms: 1,
    floor_number: 2,
    square_footage: 400,
    monthly_rent: 120000,
    currency: "NGN",
    status: "maintenance" as const,
    amenities: ["Air Conditioning"],
    description: "Modern studio apartment",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export default function PropertyPage({ propertyId }: { propertyId: string }) {
  const { property_id } = useParams()
  const [units, setUnits] = useState<typeof mockUnits>([])
  // this dialog box is for the adding units
  const [showAddDialog,
    setShowAddDialog] = useState(false)

  const [property, setProperty] = useState<Property | null>(null)
  // const [files, setFiles] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { user, company } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddUnit, setShowAddUnit] = useState(false)

  // this fetches the property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.user_id}/property/${property_id}/company/${company?.company_id}`,
        )
        if (res.ok) {
          const data = await res.json()
          setProperty({ ...data.property, files: data.files })
          setUnits(data.units)
          // setFiles(data.files)
        } else {
          toast.error("Failed to fetch property")
        }
      } catch (err) {
        console.error(err)
        toast.error("Error fetching property")
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertyId])

  const handleDeleteProperty = async () => {
    if (!property) return;

    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) { return }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.user_id}/property/${property.id}/company/${company?.company_id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        let response = await res.json()
        toast.success(response.message)
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error("Failed to delete property")
    }

  }
  const handleChange = (field: keyof Property, value: string | number | string[]) => {
    if (!property) return
    setProperty({ ...property, [field]: value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!property || !e.target.files) return
    const newFiles: PropertyFile[] = Array.from(e.target.files).map((file) => ({
      file_name: file.name,
      file_type: file.type,
      file_category: file.type.startsWith("image") ? "image" : "document",
      s3_key: "", // will be filled after upload to S3
      preview: URL.createObjectURL(file),
    }))
    setProperty({ ...property, files: [...property.files, ...newFiles] })
  }

  const handleRemoveFile = (index: number) => {
    if (!property) return
    const updatedFiles = [...property.files]
    updatedFiles.splice(index, 1)
    setProperty({ ...property, files: updatedFiles })
  }


  const handleSave = async () => {
    if (!property) return
    setSaving(true)

    let company_id = company?.company_id;
    let user_id = user?.user_id;
    try {
      const uploadPromises = property.files.map(async (file: any) => {
        if (file.preview) {
          const presignedRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/s3/presign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.file_name, filetype: file.file_type }),
          })
          if (!presignedRes.ok) throw new Error("Failed to get presigned URL")
          const { url, key } = await presignedRes.json()

          const uploadRes = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.file_type },
            body: await fetch(file.preview).then((r) => r.blob()),
          })
          if (!uploadRes.ok) throw new Error("Failed to upload file to S3")

          return { ...file, s3_key: key, preview: undefined }
        }
        return file
      })

      const uploadedFiles = await Promise.all(uploadPromises)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user_id}/property/${property_id}/company/${company_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...property, files: uploadedFiles }),
      })

      if (res.ok) {
        setIsEditing(false)
        toast.success("Property updated successfully")
        router.refresh()
      } else {
        toast.error("Failed to update property")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error updating property")
    } finally {
      setSaving(false)
    }
  }


  const handleAddUnit = async (newUnit: Omit<Unit, "id" | "created_at" | "updated_at">) => {

    let req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${property_id}/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newUnit,
      })
    })
    if (req.ok) {
      let response = await req.json()
      setShowAddDialog(false)
      toast.success(response.message)
    }
    else {
      toast.error("Failed to add unit")
    }

  }

  const handleUpdateUnit = async (id: string, updatedUnit: Partial<Unit>) => {

    const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/property/${property_id}/unit/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...updatedUnit
      })

    })

    if (req.ok) {
      let response = await req.json()
      toast.success(response.message)
      window.location.reload()
    }
    else {
      toast.error("Failed to Update Unit")
    }
  }

  const handleDeleteUnit = async (id: string) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/property/${property_id}/unit/${id}`, {
      method: "DELETE"
    })

    if (req.ok) {
      
      router.push('/dashboard')

      toast.success("deleted")
    }
    else {
      toast.error("Failed to Delete Unit")
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!property)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Property not found</p>
          </CardContent>
        </Card>
      </div>
    )


  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{property.property_name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {property.property_address}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Property
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="units">Units Management</TabsTrigger>
          <TabsTrigger value="files">Files & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_name">Property Name</Label>
                  {isEditing ? (
                    <Input
                      id="property_name"
                      value={property.property_name}
                      onChange={(e) => handleChange("property_name", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm font-medium">{property.property_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="property_address"
                      value={property.property_address}
                      onChange={(e) => handleChange("property_address", e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm">{property.property_address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  {isEditing ? (
                    <Select value={property.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="capitalize">
                      {property.category}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Transaction Type</Label>
                  {isEditing ? (
                    <Select
                      value={property.transaction_type}
                      onValueChange={(value) => handleChange("transaction_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="lease">Lease</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className="capitalize">
                      {property.transaction_type}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  {isEditing ? (
                    <Input
                      id="property_type"
                      value={property.property_type || ""}
                      onChange={(e) => handleChange("property_type", e.target.value)}
                      placeholder="e.g., Residential, Commercial"
                    />
                  ) : (
                    <p className="text-sm">{property.property_type || "Not specified"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_status">Status</Label>
                  {isEditing ? (
                    <Input
                      id="property_status"
                      value={property.property_status}
                      onChange={(e) => handleChange("property_status", e.target.value)}
                    />
                  ) : (
                    <Badge className="capitalize">{property.property_status}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Units Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Units Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="units">Total Units</Label>
                  {isEditing ? (
                    <Input
                      id="units"
                      type="number"
                      value={property.units || ""}
                      onChange={(e) => handleChange("units", Number.parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <p className="text-2xl font-bold">{property.units || 0}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupied">Occupied</Label>
                  {isEditing ? (
                    <Input
                      id="occupied"
                      type="number"
                      value={property.occupied || ""}
                      onChange={(e) => handleChange("occupied", Number.parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-green-600">{property.occupied || 0}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacant">Vacant</Label>
                  {isEditing ? (
                    <Input
                      id="vacant"
                      type="number"
                      value={property.vacant || ""}
                      onChange={(e) => handleChange("vacant", Number.parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-orange-600">{property.vacant || 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.transaction_type === "rent" && (
                  <div className="space-y-2">
                    <Label htmlFor="monthly_rent">Monthly Rent</Label>
                    {isEditing ? (
                      <Input
                        id="monthly_rent"
                        type="number"
                        value={property.monthly_rent || ""}
                        onChange={(e) => handleChange("monthly_rent", Number.parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {property.currency} {property.monthly_rent?.toLocaleString() || "Not set"}
                      </p>
                    )}
                  </div>
                )}
                {property.transaction_type === "buy" && (
                  <div className="space-y-2">
                    <Label htmlFor="sale_price">Sale Price</Label>
                    {isEditing ? (
                      <Input
                        id="sale_price"
                        type="number"
                        value={property.sale_price || ""}
                        onChange={(e) => handleChange("sale_price", Number.parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {property.currency} {property.sale_price?.toLocaleString() || "Not set"}
                      </p>
                    )}
                  </div>
                )}
                {property.transaction_type === "lease" && (
                  <div className="space-y-2">
                    <Label htmlFor="lease_price">Lease Price</Label>
                    {isEditing ? (
                      <Input
                        id="lease_price"
                        type="number"
                        value={property.lease_price || ""}
                        onChange={(e) => handleChange("lease_price", Number.parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {property.currency} {property.lease_price?.toLocaleString() || "Not set"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Maintenance & Inspection
              </CardTitle>
            </CardHeader>
            {/* <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last_inspection">Last Inspection</Label>
                  {isEditing ? (
                    <Input
                      id="last_inspection"
                      type="date"
                      value={property.last_inspection || ""}
                      onChange={(e) => handleChange("last_inspection", e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">
                      {property.last_inspection
                        ? new Date(property.last_inspection).toLocaleDateString()
                        : "Not recorded"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance_requests">Maintenance Requests</Label>
                  {isEditing ? (
                    <Input
                      id="maintenance_requests"
                      type="number"
                      value={property.maintenance_requests}
                      onChange={(e) => handleChange("maintenance_requests", Number.parseInt(e.target.value) || 0)}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-red-600">{property.maintenance_requests}</p>
                  )}
                </div>
              </div>
            </CardContent> */}
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-6">
          <UnitsManagement
            propertyId={property.id}
            units={units}
            showAddDialog={showAddDialog}
            setShowAddDialog={setShowAddDialog}
            onAddUnit={handleAddUnit}
            onUpdateUnit={handleUpdateUnit}
            onDeleteUnit={handleDeleteUnit}
            transactionType={property.transaction_type as "rent" | "buy" | "lease"}
            currency={property.currency || "NGN"}
          />
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          {/* Files Section - Placeholder for now */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Files & Documents
              </CardTitle>
              <CardDescription>Property documents, images, and other files</CardDescription>
            </CardHeader>
            <CardContent>

              {
                property?.files && property.files.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.files.map((file: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                      >
                        <FileText className="h-10 w-10 text-blue-500 mb-2" />
                        <p className="text-sm font-medium text-center truncate w-full">
                          {file.file_name}
                        </p>
                        <a
                          href={file.url}
                          download
                          className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Download className="h-4 w-4" /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No Files uploaded yet.</p>
                  </div>
                )
              }


            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end mt-8">
        <Button
          variant="destructive"
          onClick={handleDeleteProperty}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Delete Property
        </Button>
      </div>

    </div>
  )
}
