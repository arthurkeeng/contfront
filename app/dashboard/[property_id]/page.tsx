"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"

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
  files: PropertyFile[]
}

export default function PropertyPage({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Fetch property on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${propertyId}`
        )
        if (res.ok) {
          const data = await res.json()
          setProperty(data)
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

  const handleChange = (field: keyof Property, value: string | number) => {
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

    try {
      // Step 1: Upload new files (with preview but no s3_key yet)
      const uploadPromises = property.files.map(async (file) => {
        if (file.preview) {
          // Request a presigned URL from backend
          const presignedRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload-url`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileName: file.file_name, fileType: file.file_type }),
            }
          )
          if (!presignedRes.ok) throw new Error("Failed to get presigned URL")
          const { url, key } = await presignedRes.json()

          // Upload directly to S3
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

      // Step 2: Save property with updated files
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties/${property.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...property, files: uploadedFiles }),
        }
      )

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

  if (loading) return <p className="p-4">Loading...</p>
  if (!property) return <p className="p-4">Property not found</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Property</h1>

      {/* Property Info */}
      <div className="grid gap-4">
        <div>
          <Label>Property Name</Label>
          <Input
            value={property.property_name}
            onChange={(e) => handleChange("property_name", e.target.value)}
          />
        </div>

        <div>
          <Label>Property Address</Label>
          <Textarea
            value={property.property_address}
            onChange={(e) => handleChange("property_address", e.target.value)}
          />
        </div>

        {/* ... other inputs from previous version ... */}
      </div>

      {/* File Upload */}
      <div>
        <Label>Property Files</Label>
        <Input
          type="file"
          multiple
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
        <div className="flex flex-wrap gap-3 mt-3">
          {property.files.map((file, i) => (
            <div
              key={i}
              className="relative w-24 h-24 rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50"
            >
              {file.file_category === "image" ? (
                <img
                  src={file.preview || `${process.env.NEXT_PUBLIC_S3_URL}/${file.s3_key}`}
                  alt={file.file_name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs text-center px-1">{file.file_name}</span>
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(i)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full mt-6">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
