"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"

export default function AddPropertyForm() {
const [user, setUser] = useState<any>(null)
const [company, setCompany] = useState<any>(null)
  useEffect(() => {
    const storedUser = localStorage.getItem("propertyflow_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    const storedCompany = localStorage.getItem("propertyflow_company")
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany))
    }
  }, [])

const [formData, setFormData] = useState({
  name: "",
  address: "",
  property_type: "",  // was "type"
  category: "",       // "land" or "house"
  transaction_type: "",
  units: null,
  occupied: null,
  vacant: null,
  monthly_rent: null,
  sale_price: null,
  lease_price: null,
  currency: "NGN",
  status: "active",
  manager_id: "",     // was "managerId"
  last_inspection: null,
})


  const [images, setImages] = useState<FileList | null>(null)
  const [documents, setDocuments] = useState<FileList | null>(null)

 const handleChange = (field: string, value: string) => {
  if (field === "property_type") {
    setFormData({
      ...formData,
      property_type: value,
      category: value === "land" ? "land" : "house",
    })
    return
  }

  // Convert numeric fields
  if (["units","occupied","vacant"].includes(field)) {
    setFormData({ ...formData, [field]: value ? parseInt(value) : null })
    return
  }

  if (["monthly_rent","sale_price","lease_price"].includes(field)) {
    setFormData({ ...formData, [field]: value ? parseFloat(value) : null })
    return
  }

  setFormData({ ...formData, [field]: value })
}


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const payload = {
    ...formData,
    company_id: company?.company_id,
    user_id: user?.user_id,
  }

  console.log("Payload JSON:", payload)
  console.log("Payload JSON:", company?.company_id)


  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add_property`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (res.ok) {
    console.log("Property created successfully")
  } else {
    console.error("Error creating property")
  }
}

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Name */}
          <div>
            <Label>Property Name</Label>
            <Input
              placeholder="e.g. Green Valley Homes"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Textarea
              placeholder="Enter full property address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div>
            <Label>Property Type</Label>
            <Select onValueChange={(v) => handleChange("type", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type */}
          <div>
            <Label>Purpose</Label>
            <Select onValueChange={(v) => handleChange("transaction_type", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="lease">Lease</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Price Fields */}
          {formData.transaction_type === "rent" && (
            <div>
              <Label>Monthly Rent (NGN)</Label>
              <Input
                type="number"
                placeholder="e.g. 150000"
                value={formData.monthly_rent!}
                onChange={(e) => handleChange("monthly_rent", e.target.value)}
              />
            </div>
          )}
          {formData.transaction_type === "buy" && (
            <div>
              <Label>Sale Price (NGN)</Label>
              <Input
                type="number"
                placeholder="e.g. 45000000"
                value={formData.sale_price!}
                onChange={(e) => handleChange("sale_price", e.target.value)}
              />
            </div>
          )}
          {formData.transaction_type === "lease" && (
            <div>
              <Label>Lease Price (NGN)</Label>
              <Input
                type="number"
                placeholder="e.g. 2500000"
                value={formData.lease_price!}
                onChange={(e) => handleChange("lease_price", e.target.value)}
              />
            </div>
          )}

          {/* Units */}
          {formData.property_type !== "land" && (
            <div>
              <Label>Number of Units</Label>
              <Input
                type="number"
                placeholder="e.g. 12"
                value={formData.units!}
                onChange={(e) => handleChange("units", e.target.value)}
              />
            </div>
          )}

          {/* Occupied & Vacant */}
          {formData.property_type !== "land" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Occupied Units</Label>
                <Input
                  type="number"
                  placeholder="e.g. 8"
                  value={formData.occupied!}
                  onChange={(e) => handleChange("occupied", e.target.value)}
                />
              </div>
              <div>
                <Label>Vacant Units</Label>
                <Input
                  type="number"
                  placeholder="e.g. 4"
                  value={formData.vacant!}
                  onChange={(e) => handleChange("vacant", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Manager ID */}
          <div>
            <Label>Property Manager ID</Label>
            <Input
              placeholder="Manager ID (temporary, replace with dropdown)"
              value={formData.manager_id}
              onChange={(e) => handleChange("managerId", e.target.value)}
            />
          </div>

          {/* File Uploads */}
          <div>
            <Label>Property Images</Label>
            <Input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
          </div>
          <div>
            <Label>Property Documents</Label>
            <Input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => setDocuments(e.target.files)} />
          </div>

          <Button type="submit" className="w-full">
            Save Property
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
