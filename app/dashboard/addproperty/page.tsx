"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

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
    property_name: "",
    property_address: "",
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
    property_status: "active",
    manager_id: "",     // was "managerId"
    last_inspection: null,
  })


  const [images, setImages] = useState<FileList | null>(null)
  const [documents, setDocuments] = useState<FileList | null>(null)
const [imageUrl, setImageUrl] = useState<string | null>(null)
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
    if (["units", "occupied", "vacant"].includes(field)) {
      setFormData({ ...formData, [field]: value ? parseInt(value) : null })
      return
    }

    if (["monthly_rent", "sale_price", "lease_price"].includes(field)) {
      setFormData({ ...formData, [field]: value ? parseFloat(value) : null })
      return
    }

    setFormData({ ...formData, [field]: value })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Add documents")
    // handle the image uploads
    let uploadedDocuments: string[] = []


    // if (images) {
    //   for (const file of Array.from(images)) {
    //     console.log(file)
    //     const presigned_url = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/s3/presign`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         filename: file.name,
    //         filetype: file.type
    //       })
    //     })

    //     const { url, key } = await presigned_url.json()
    //     console.log("Uploading to:", url);
    //     const uploadRes = await fetch(url, {
    //       method: "PUT",
    //       // headers : {"Content-Type" : file.type}, 
    //       body: file
    //     })
    //     console.log("Upload response:", uploadRes.status, uploadRes.statusText);
    //     if (uploadRes.ok) {
    //       uploadedImages.push(key)
    //     }
    //     else {
    //       toast.error("Failed to upload image")
    //     }
    //   }
    // }


    // if (documents) {
    //   for (const file of Array.from(documents)) {
    //     const presigned_url = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/s3/presign`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         filename: file.name,
    //         filetype: file.type
    //       })
    //     })

    //     const { url, key } = await presigned_url.json()

    //     const uploadRes = await fetch(url, {
    //       method: "PUT",
    //       // headers : {"Content-Type" : file.type},
    //       body: file
    //     })

    //     if (uploadRes.ok) {
    //       uploadedDocuments.push(key)

    //     }
    //     else {
    //       toast.error("Failed to add document")
    //     }
    //   }

    // }

    let uploadedImages: string[] = []

  // 🚀 Upload images to Cloudinary
  if (images) {
    for (const file of Array.from(images)) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!) 
      // create this unsigned preset in Cloudinary dashboard

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await uploadRes.json()
      if (uploadRes.ok) {
        uploadedImages.push(data.secure_url) // store image URL
      } else {
        console.error("Cloudinary error:", data)
        toast.error("Failed to upload image")
      }
    }
  
    const payload = {
      ...formData,
      company_id: company?.company_id,
      user_id: user?.user_id,
    }


    console.log("The payload is ", payload)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add_property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      toast.success("Property Created Successfully");
    } else {
      toast.error("Failed to Create Property");
    }
  }
  }
 return (
    <Card className="max-w-4xl mx-auto mt-8 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">🏡 Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Property Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Property Name</Label>
                <Input
                  placeholder="e.g. Green Valley Homes"
                  value={formData.property_name}
                  onChange={(e) => handleChange("property_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Property Type</Label>
                <Select onValueChange={(v) => handleChange("property_type", v)}>
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
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Textarea
                  placeholder="Enter full property address"
                  value={formData.property_address}
                  onChange={(e) => handleChange("property_address", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Transaction */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Transaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
          </div>

          {/* Section: Units */}
          {formData.property_type !== "land" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Units</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Total Units</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 12"
                    value={formData.units!}
                    onChange={(e) => handleChange("units", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Occupied</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 8"
                    value={formData.occupied!}
                    onChange={(e) => handleChange("occupied", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Vacant</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 4"
                    value={formData.vacant!}
                    onChange={(e) => handleChange("vacant", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Uploads */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Uploads</h3>
            <div className="space-y-4">
              <div>
                <Label>Property Images</Label>
                <Input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
                {images && (
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {Array.from(images).map((file, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full text-lg py-6">
            Save Property
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
