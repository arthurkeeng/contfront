"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wrench, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"


interface MaintenanceRequestModalProps {
  onSubmit: (data: MaintenanceRequestFormData) => void
  trigger?: React.ReactNode
}

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliance", label: "Appliance" },
  { value: "structural", label: "Structural" },
  { value: "pest_control", label: "Pest Control" },
  { value: "landscaping", label: "Landscaping" },
  { value: "cleaning", label: "Cleaning" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
]

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-blue-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "high", label: "High", color: "text-orange-600" },
  { value: "urgent", label: "Urgent", color: "text-red-600" },
]

export default function MaintenanceRequestModal({ onSubmit, trigger }: MaintenanceRequestModalProps) {

  const {user , company} = useAuth()

  const [open, setOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loadingProperties, setLoadingProperties] = useState(false)
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [isPropertyLevel, setIsPropertyLevel] = useState(false)

  const [formData, setFormData] = useState<MaintenanceRequestFormData>({
    property_id: "",
    unit_id: "",
    title: "",
    description: "",
    category: "plumbing",
    priority: "medium",
    tenant_name: "",
    tenant_phone: "",
    tenant_email: "",
    assigned_to: "",
    assigned_to_phone: "",
    due_date: "",
    estimated_cost: undefined,
  })

  // Fetch properties when modal opens
  useEffect(() => {
    if (open) {
      fetchProperties()
    }
  }, [open])

  // Fetch units when property is selected
  useEffect(() => {
    if (formData.property_id) {
      fetchUnits(formData.property_id)
    } else {
      setUnits([])
      setFormData((prev) => ({ ...prev, unit_id: "" }))
    }
  }, [formData.property_id])

  // Auto-fill tenant info when unit is selected
  useEffect(() => {
    if (formData.unit_id) {
      const selectedUnit = units.find((u) => u.id === formData.unit_id)
      if (selectedUnit && selectedUnit.tenant_name) {
        setFormData((prev) => ({
          ...prev,
          tenant_name: selectedUnit.tenant_name || "",
          tenant_phone: selectedUnit.tenant_phone || "",
          tenant_email: selectedUnit.tenant_email || "",
        }))
      }
    }
  }, [formData.unit_id, units])

  const fetchProperties = async () => {
    setLoadingProperties(true)
    try {
      
    let properties = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/maintenance/properties/company/${company.company_id}/user/${user?.user_id}`)
    const data = await properties.json()
      setProperties(data.properties)
    } catch (error) {
      console.error("Error fetching properties:", error)
      
    } finally {
      setLoadingProperties(false)
    }
  }

  const fetchUnits = async (propertyId: string) => {
    setLoadingUnits(true)
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/properties/${propertyId}/units`)
      const data = await response.json()
      setUnits(data)
    } catch (error) {
      console.error("[v0] Error fetching units:", error)
      // Mock data for development
      setUnits([
        {
          id: "1",
          unit_number: "2A",
          unit_type: "apartment",
          tenant_name: "John Adebayo",
          tenant_phone: "+234 801 234 5678",
          tenant_email: "john@example.com",
        },
        {
          id: "2",
          unit_number: "3B",
          unit_type: "apartment",
          tenant_name: "Sarah Okonkwo",
          tenant_phone: "+234 802 345 6789",
        },
        {
          id: "3",
          unit_number: "4C",
          unit_type: "apartment",
        },
      ])
    } finally {
      setLoadingUnits(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.property_id || !formData.title || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    // If property-level maintenance, remove unit_id
    const submitData = isPropertyLevel ? { ...formData, unit_id: undefined } : formData

    onSubmit(submitData)
    handleReset()
    setOpen(false)
  }

  const handleReset = () => {
    setFormData({
      property_id: "",
      unit_id: "",
      title: "",
      description: "",
      category: "plumbing",
      priority: "medium",
      tenant_name: "",
      tenant_phone: "",
      tenant_email: "",
      assigned_to: "",
      assigned_to_phone: "",
      due_date: "",
      estimated_cost: undefined,
    })
    setIsPropertyLevel(false)
    setUnits([])
  }

  const handleInputChange = (field: keyof MaintenanceRequestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Wrench className="h-4 w-4" />
            New Maintenance Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Create Maintenance Request
          </DialogTitle>
          <DialogDescription>Submit a new maintenance ticket for a property or specific unit</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property and Unit Selection */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Location
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property_id">
                  Property <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.property_id}
                  onValueChange={(value) => handleInputChange("property_id", value)}
                  disabled={loadingProperties}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingProperties ? "Loading properties..." : "Select property"} />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        <div>
                          <p className="font-medium">{property.property_name}</p>
                          <p className="text-xs text-muted-foreground">{property.property_address}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unit_id">Unit (Optional)</Label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={isPropertyLevel}
                      onChange={(e) => {
                        setIsPropertyLevel(e.target.checked)
                        if (e.target.checked) {
                          handleInputChange("unit_id", "")
                        }
                      }}
                      className="rounded"
                    />
                    Property-level maintenance
                  </label>
                </div>
                <Select
                  value={formData.unit_id}
                  onValueChange={(value) => handleInputChange("unit_id", value)}
                  disabled={loadingUnits || !formData.property_id || isPropertyLevel}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.property_id
                          ? "Select property first"
                          : isPropertyLevel
                            ? "Property-level maintenance"
                            : loadingUnits
                              ? "Loading units..."
                              : "Select unit (optional)"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        <div>
                          <p className="font-medium">
                            Unit {unit.unit_number} - {unit.unit_type}
                          </p>
                          {unit.tenant_name && (
                            <p className="text-xs text-muted-foreground">Tenant: {unit.tenant_name}</p>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Leaking faucet in kitchen"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide detailed description of the issue..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={priority.color}>{priority.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tenant Information */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">Tenant Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenant_name">Tenant Name</Label>
                <Input
                  id="tenant_name"
                  value={formData.tenant_name}
                  onChange={(e) => handleInputChange("tenant_name", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant_phone">Tenant Phone</Label>
                <Input
                  id="tenant_phone"
                  value={formData.tenant_phone}
                  onChange={(e) => handleInputChange("tenant_phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant_email">Tenant Email</Label>
                <Input
                  id="tenant_email"
                  type="email"
                  value={formData.tenant_email}
                  onChange={(e) => handleInputChange("tenant_email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Assignment and Scheduling */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">Assignment & Scheduling</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assign To</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => handleInputChange("assigned_to", e.target.value)}
                  placeholder="Maintenance person or contractor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned_to_phone">Contact Phone</Label>
                <Input
                  id="assigned_to_phone"
                  value={formData.assigned_to_phone}
                  onChange={(e) => handleInputChange("assigned_to_phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange("due_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost (NGN)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  value={formData.estimated_cost || ""}
                  onChange={(e) => handleInputChange("estimated_cost", Number.parseFloat(e.target.value) || undefined)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset()
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
