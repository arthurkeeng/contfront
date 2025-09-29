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


interface PropertyFile {
  id?: string
  file_name: string
  file_type: string
  file_category: "image" | "document"
  s3_key: string
  preview?: string // for local uploads
}

interface Property {
  id: string
  property_name: string
  property_address: string
  category: string
  transaction_type: string
  property_type?: string
  units?: number
  occupied?: number
  vacant?: number
  monthly_rent?: string
  sale_price?: string
  lease_price?: string
  currency?: string
  property_status: string
  square_footage?: number
  lot_size?: number
  bedrooms?: number
  bathrooms?: number
  year_built?: number
  parking_spaces?: number
  property_description?: string
  amenities?: string[]
  neighborhood?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  property_manager?: string
  acquisition_date?: string
  last_renovation?: string
  property_tax?: string
  insurance_cost?: string
  hoa_fees?: string
  utilities_included?: string[]
  pet_policy?: string
  lease_terms?: string
  security_deposit?: string
  application_fee?: string
  files: PropertyFile[]
}

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
    const [units, setUnits] = useState(mockUnits)


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
          setProperty({...data.property , files : data.files})
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

  
  const handleAddUnit = (newUnit: Omit<(typeof mockUnits)[0], "id" | "created_at" | "updated_at">) => {
    const unit = {
      ...newUnit,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    // TODO: Make API call to create unit
    console.log("[v0] Adding unit:", unit)
  }

  const handleUpdateUnit = (id: string, updatedUnit: Partial<(typeof mockUnits)[0]>) => {
    
    // TODO: Make API call to update unit
    console.log("[v0] Updating unit:", id, updatedUnit)
  }

  const handleDeleteUnit = (id: string) => {
    setUnits((prev) => prev.filter((unit) => unit.id !== id))
    // TODO: Make API call to delete unit
    console.log("[v0] Deleting unit:", id)
  }

  console.log("the property is " , property?.files)
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

  // return (
  //   <div className="max-w-7xl mx-auto p-6 space-y-6">
  //     <div className="flex items-center justify-between">
  //       <div className="space-y-1">
  //         <h1 className="text-3xl font-bold tracking-tight">{property.property_name}</h1>
  //         <div className="flex items-center gap-2 text-muted-foreground">
  //           <MapPin className="h-4 w-4" />
  //           <span>{property.property_address}</span>
  //         </div>
  //       </div>
  //       <div className="flex items-center gap-3">
  //         <Badge variant={property.property_status === "active" ? "default" : "secondary"}>
  //           {property.property_status}
  //         </Badge>
  //         <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
  //           {saving ? "Saving..." : "Save Changes"}
  //         </Button>
  //       </div>
  //     </div>

  //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //       <div className="lg:col-span-2 space-y-6">
  //         {/* Basic Information */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <Home className="h-5 w-5" />
  //               Basic Information
  //             </CardTitle>
  //             <CardDescription>Core property details and identification</CardDescription>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               <div className="space-y-2">
  //                 <Label htmlFor="property_name">Property Name</Label>
  //                 <Input
  //                   id="property_name"
  //                   value={property.property_name}
  //                   onChange={(e) => handleChange("property_name", e.target.value)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="property_type">Property Type</Label>
  //                 <Select
  //                   value={property.property_type}
  //                   onValueChange={(value) => handleChange("property_type", value)}
  //                 >
  //                   <SelectTrigger>
  //                     <SelectValue placeholder="Select type" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="residential">Residential</SelectItem>
  //                     <SelectItem value="commercial">Commercial</SelectItem>
  //                     <SelectItem value="industrial">Industrial</SelectItem>
  //                     <SelectItem value="mixed-use">Mixed Use</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="category">Category</Label>
  //                 <Select value={property.category} onValueChange={(value) => handleChange("category", value)}>
  //                   <SelectTrigger>
  //                     <SelectValue placeholder="Select category" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="apartment">Apartment</SelectItem>
  //                     <SelectItem value="house">House</SelectItem>
  //                     <SelectItem value="condo">Condo</SelectItem>
  //                     <SelectItem value="office">Office</SelectItem>
  //                     <SelectItem value="retail">Retail</SelectItem>
  //                     <SelectItem value="warehouse">Warehouse</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="transaction_type">Transaction Type</Label>
  //                 <Select
  //                   value={property.transaction_type}
  //                   onValueChange={(value) => handleChange("transaction_type", value)}
  //                 >
  //                   <SelectTrigger>
  //                     <SelectValue placeholder="Select type" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectItem value="rent">Rent</SelectItem>
  //                     <SelectItem value="sale">Sale</SelectItem>
  //                     <SelectItem value="lease">Lease</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="property_description">Description</Label>
  //               <Textarea
  //                 id="property_description"
  //                 value={property.property_description || ""}
  //                 onChange={(e) => handleChange("property_description", e.target.value)}
  //                 placeholder="Describe the property features, location benefits, and unique selling points..."
  //                 rows={4}
  //               />
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Location Details */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <MapPin className="h-5 w-5" />
  //               Location Details
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="space-y-2">
  //               <Label htmlFor="property_address">Full Address</Label>
  //               <Textarea
  //                 id="property_address"
  //                 value={property.property_address}
  //                 onChange={(e) => handleChange("property_address", e.target.value)}
  //                 rows={2}
  //               />
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //               <div className="space-y-2">
  //                 <Label htmlFor="city">City</Label>
  //                 <Input id="city" value={property.city || ""} onChange={(e) => handleChange("city", e.target.value)} />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="state">State</Label>
  //                 <Input
  //                   id="state"
  //                   value={property.state || ""}
  //                   onChange={(e) => handleChange("state", e.target.value)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="zip_code">ZIP Code</Label>
  //                 <Input
  //                   id="zip_code"
  //                   value={property.zip_code || ""}
  //                   onChange={(e) => handleChange("zip_code", e.target.value)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="neighborhood">Neighborhood</Label>
  //                 <Input
  //                   id="neighborhood"
  //                   value={property.neighborhood || ""}
  //                   onChange={(e) => handleChange("neighborhood", e.target.value)}
  //                 />
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Property Specifications */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <Settings className="h-5 w-5" />
  //               Property Specifications
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  //               <div className="space-y-2">
  //                 <Label htmlFor="square_footage">Square Footage</Label>
  //                 <Input
  //                   id="square_footage"
  //                   type="number"
  //                   value={property.square_footage || ""}
  //                   onChange={(e) => handleChange("square_footage", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="lot_size">Lot Size (sq ft)</Label>
  //                 <Input
  //                   id="lot_size"
  //                   type="number"
  //                   value={property.lot_size || ""}
  //                   onChange={(e) => handleChange("lot_size", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="bedrooms">Bedrooms</Label>
  //                 <Input
  //                   id="bedrooms"
  //                   type="number"
  //                   value={property.bedrooms || ""}
  //                   onChange={(e) => handleChange("bedrooms", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="bathrooms">Bathrooms</Label>
  //                 <Input
  //                   id="bathrooms"
  //                   type="number"
  //                   step="0.5"
  //                   value={property.bathrooms || ""}
  //                   onChange={(e) => handleChange("bathrooms", Number.parseFloat(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="year_built">Year Built</Label>
  //                 <Input
  //                   id="year_built"
  //                   type="number"
  //                   value={property.year_built || ""}
  //                   onChange={(e) => handleChange("year_built", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="parking_spaces">Parking Spaces</Label>
  //                 <Input
  //                   id="parking_spaces"
  //                   type="number"
  //                   value={property.parking_spaces || ""}
  //                   onChange={(e) => handleChange("parking_spaces", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="units">Total Units</Label>
  //                 <Input
  //                   id="units"
  //                   type="number"
  //                   value={property.units || ""}
  //                   onChange={(e) => handleChange("units", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label htmlFor="occupied">Occupied Units</Label>
  //                 <Input
  //                   id="occupied"
  //                   type="number"
  //                   value={property.occupied || ""}
  //                   onChange={(e) => handleChange("occupied", Number.parseInt(e.target.value) || 0)}
  //                 />
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Property Media */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <ImageIcon className="h-5 w-5" />
  //               Property Media & Documents
  //             </CardTitle>
  //             <CardDescription>Upload images, floor plans, and important documents</CardDescription>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
  //               <div className="flex flex-col items-center justify-center space-y-2">
  //                 <Upload className="h-8 w-8 text-muted-foreground" />
  //                 <div className="text-center">
  //                   <Label
  //                     htmlFor="file-upload"
  //                     className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80"
  //                   >
  //                     Click to upload files
  //                   </Label>
  //                   <p className="text-xs text-muted-foreground mt-1">Images, PDFs, and documents up to 10MB each</p>
  //                 </div>
  //                 <Input
  //                   id="file-upload"
  //                   type="file"
  //                   multiple
  //                   onChange={handleFileUpload}
  //                   accept="image/*,.pdf,.doc,.docx"
  //                   className="hidden"
  //                 />
  //               </div>
  //             </div>

  //             {property.files && property.files.length > 0 && (
  //               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  //                 {property.files.map((file: any, i: number) => (
  //                   <div
  //                     key={i}
  //                     className="relative group rounded-lg overflow-hidden border bg-muted/50 hover:bg-muted transition-colors"
  //                   >
  //                     <div className="aspect-square flex items-center justify-center p-2">
  //                       {file.file_category === "image" ? (
  //                         <img
  //                           src={file.preview || `${process.env.NEXT_PUBLIC_S3_URL}/${file.s3_key}`}
  //                           alt={file.file_name}
  //                           className="object-cover w-full h-full rounded"
  //                         />
  //                       ) : (
  //                         <div className="flex flex-col items-center justify-center text-center p-4">
  //                           <FileText className="h-8 w-8 text-muted-foreground mb-2" />
  //                           <span className="text-xs font-medium truncate w-full px-1">
  //                             {file.file_name}
  //                           </span>
  //                         </div>
  //                       )}
  //                     </div>
  //                     <Button
  //                       type="button"
  //                       variant="destructive"
  //                       size="sm"
  //                       onClick={() => handleRemoveFile(i)}
  //                       className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
  //                     >
  //                       <X className="h-3 w-3" />
  //                     </Button>
  //                   </div>
  //                 ))}
  //               </div>
  //             )}

  //           </CardContent>
  //         </Card>
  //       </div>

  //       <div className="space-y-6">
  //         {/* Financial Information */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <DollarSign className="h-5 w-5" />
  //               Financial Details
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="space-y-2">
  //               <Label htmlFor="currency">Currency</Label>
  //               <Select value={property.currency || "NGN"} onValueChange={(value) => handleChange("currency", value)}>
  //                 <SelectTrigger>
  //                   <SelectValue />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
  //                   <SelectItem value="USD">US Dollar ($)</SelectItem>
  //                   <SelectItem value="EUR">Euro (€)</SelectItem>
  //                   <SelectItem value="GBP">British Pound (£)</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             {property.transaction_type === "rent" && (
  //               <div className="space-y-2">
  //                 <Label htmlFor="monthly_rent">Monthly Rent</Label>
  //                 <Input
  //                   id="monthly_rent"
  //                   value={property.monthly_rent || ""}
  //                   onChange={(e) => handleChange("monthly_rent", e.target.value)}
  //                   placeholder="0.00"
  //                 />
  //               </div>
  //             )}

  //             {property.transaction_type === "sale" && (
  //               <div className="space-y-2">
  //                 <Label htmlFor="sale_price">Sale Price</Label>
  //                 <Input
  //                   id="sale_price"
  //                   value={property.sale_price || ""}
  //                   onChange={(e) => handleChange("sale_price", e.target.value)}
  //                   placeholder="0.00"
  //                 />
  //               </div>
  //             )}

  //             {property.transaction_type === "lease" && (
  //               <div className="space-y-2">
  //                 <Label htmlFor="lease_price">Lease Price</Label>
  //                 <Input
  //                   id="lease_price"
  //                   value={property.lease_price || ""}
  //                   onChange={(e) => handleChange("lease_price", e.target.value)}
  //                   placeholder="0.00"
  //                 />
  //               </div>
  //             )}

  //             <Separator />

  //             <div className="space-y-2">
  //               <Label htmlFor="security_deposit">Security Deposit</Label>
  //               <Input
  //                 id="security_deposit"
  //                 value={property.security_deposit || ""}
  //                 onChange={(e) => handleChange("security_deposit", e.target.value)}
  //                 placeholder="0.00"
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="property_tax">Annual Property Tax</Label>
  //               <Input
  //                 id="property_tax"
  //                 value={property.property_tax || ""}
  //                 onChange={(e) => handleChange("property_tax", e.target.value)}
  //                 placeholder="0.00"
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="insurance_cost">Annual Insurance</Label>
  //               <Input
  //                 id="insurance_cost"
  //                 value={property.insurance_cost || ""}
  //                 onChange={(e) => handleChange("insurance_cost", e.target.value)}
  //                 placeholder="0.00"
  //               />
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Management Information */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <Users className="h-5 w-5" />
  //               Management
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="space-y-2">
  //               <Label htmlFor="property_manager">Property Manager</Label>
  //               <Input
  //                 id="property_manager"
  //                 value={property.property_manager || ""}
  //                 onChange={(e) => handleChange("property_manager", e.target.value)}
  //                 placeholder="Manager name"
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="acquisition_date">Acquisition Date</Label>
  //               <Input
  //                 id="acquisition_date"
  //                 type="date"
  //                 value={property.acquisition_date || ""}
  //                 onChange={(e) => handleChange("acquisition_date", e.target.value)}
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="last_renovation">Last Renovation</Label>
  //               <Input
  //                 id="last_renovation"
  //                 type="date"
  //                 value={property.last_renovation || ""}
  //                 onChange={(e) => handleChange("last_renovation", e.target.value)}
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="pet_policy">Pet Policy</Label>
  //               <Select value={property.pet_policy || ""} onValueChange={(value) => handleChange("pet_policy", value)}>
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="Select policy" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="allowed">Pets Allowed</SelectItem>
  //                   <SelectItem value="not-allowed">No Pets</SelectItem>
  //                   <SelectItem value="cats-only">Cats Only</SelectItem>
  //                   <SelectItem value="dogs-only">Dogs Only</SelectItem>
  //                   <SelectItem value="case-by-case">Case by Case</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Quick Stats */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle>Quick Stats</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-3">
  //             <div className="flex justify-between items-center">
  //               <span className="text-sm text-muted-foreground">Occupancy Rate</span>
  //               <span className="font-medium">
  //                 {property.units && property.occupied
  //                   ? `${Math.round((property.occupied / property.units) * 100)}%`
  //                   : "N/A"}
  //               </span>
  //             </div>
  //             <div className="flex justify-between items-center">
  //               <span className="text-sm text-muted-foreground">Vacant Units</span>
  //               <span className="font-medium">
  //                 {property.units && property.occupied ? property.units - property.occupied : "N/A"}
  //               </span>
  //             </div>
  //             <div className="flex justify-between items-center">
  //               <span className="text-sm text-muted-foreground">Price per Sq Ft</span>
  //               <span className="font-medium">
  //                 {property.sale_price && property.square_footage
  //                   ? `₦${Math.round(Number.parseFloat(property.sale_price) / property.square_footage)}`
  //                   : "N/A"}
  //               </span>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // )

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
            onAddUnit={handleAddUnit}
            onUpdateUnit={handleUpdateUnit}
            onDeleteUnit={handleDeleteUnit}
            transactionType={property.transaction_type}
            currency={property.currency}
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
    </div>
  )
}
