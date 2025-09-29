"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Home, Bed, Bath, Square, DollarSign, User } from "lucide-react"

interface Unit {
  id: string
  property_id: string
  unit_number: string
  unit_type: string
  bedrooms: number
  bathrooms: number
  floor_number?: number
  square_footage?: number
  monthly_rent?: number
  sale_price?: number
  lease_price?: number
  currency: string
  status: "available" | "occupied" | "maintenance" | "reserved"
  amenities: string[]
  description?: string
  tenant_name?: string
  tenant_email?: string
  tenant_phone?: string
  lease_start?: string
  lease_end?: string
  created_at: string
  updated_at: string
}

interface UnitsManagementProps {
  propertyId: string
  units: Unit[]
  onAddUnit: (unit: Omit<Unit, "id" | "created_at" | "updated_at">) => void
  onUpdateUnit: (id: string, unit: Partial<Unit>) => void
  onDeleteUnit: (id: string) => void
  transactionType: "rent" | "buy" | "lease"
  currency: string
}

const COMMON_AMENITIES = [
  "Air Conditioning",
  "Balcony",
  "Parking",
  "Swimming Pool",
  "Gym",
  "Security",
  "Elevator",
  "Garden",
  "Laundry",
  "Internet",
  "Generator",
  "Water Heater",
]

const UNIT_TYPES = ["apartment", "studio", "penthouse", "duplex", "office", "shop", "warehouse", "room"]

export default function UnitsManagement({
  propertyId,
  units,
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  transactionType,
  currency,
}: UnitsManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    property_id: propertyId,
    unit_number: "",
    unit_type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    floor_number: 1,
    status: "available",
    amenities: [],
    currency: currency,
  })

  const handleAddUnit = () => {
    if (newUnit.unit_number && newUnit.unit_type) {
      onAddUnit(newUnit as Omit<Unit, "id" | "created_at" | "updated_at">)
      setNewUnit({
        property_id: propertyId,
        unit_number: "",
        unit_type: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        floor_number: 1,
        status: "available",
        amenities: [],
        currency: currency,
      })
      setShowAddDialog(false)
    }
  }

  const handleUpdateUnit = () => {
    if (editingUnit) {
      onUpdateUnit(editingUnit.id, editingUnit)
      setEditingUnit(null)
    }
  }

  const handleAmenityToggle = (amenity: string, isEditing = false) => {
    if (isEditing && editingUnit) {
      const updatedAmenities = editingUnit.amenities.includes(amenity)
        ? editingUnit.amenities.filter((a) => a !== amenity)
        : [...editingUnit.amenities, amenity]
      setEditingUnit({ ...editingUnit, amenities: updatedAmenities })
    } else {
      const updatedAmenities = newUnit.amenities?.includes(amenity)
        ? newUnit.amenities.filter((a) => a !== amenity)
        : [...(newUnit.amenities || []), amenity]
      setNewUnit({ ...newUnit, amenities: updatedAmenities })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriceForTransaction = (unit: Unit) => {
    switch (transactionType) {
      case "rent":
        return unit.monthly_rent
      case "buy":
        return unit.sale_price
      case "lease":
        return unit.lease_price
      default:
        return unit.monthly_rent
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Units Management</h2>
          <p className="text-muted-foreground">Manage individual units within this property</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
              <DialogDescription>Create a new unit within this property</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_number">Unit Number</Label>
                  <Input
                    id="unit_number"
                    value={newUnit.unit_number || ""}
                    onChange={(e) => setNewUnit({ ...newUnit, unit_number: e.target.value })}
                    placeholder="e.g., A1, 101, Ground Floor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_type">Unit Type</Label>
                  <Select
                    value={newUnit.unit_type}
                    onValueChange={(value) => setNewUnit({ ...newUnit, unit_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={newUnit.bedrooms || 0}
                    onChange={(e) => setNewUnit({ ...newUnit, bedrooms: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={newUnit.bathrooms || 0}
                    onChange={(e) => setNewUnit({ ...newUnit, bathrooms: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor_number">Floor</Label>
                  <Input
                    id="floor_number"
                    type="number"
                    value={newUnit.floor_number || ""}
                    onChange={(e) =>
                      setNewUnit({ ...newUnit, floor_number: Number.parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="square_footage">Square Footage</Label>
                  <Input
                    id="square_footage"
                    type="number"
                    value={newUnit.square_footage || ""}
                    onChange={(e) =>
                      setNewUnit({ ...newUnit, square_footage: Number.parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {transactionType === "rent"
                      ? "Monthly Rent"
                      : transactionType === "buy"
                        ? "Sale Price"
                        : "Lease Price"}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={
                      transactionType === "rent"
                        ? newUnit.monthly_rent || ""
                        : transactionType === "buy"
                          ? newUnit.sale_price || ""
                          : newUnit.lease_price || ""
                    }
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value) || undefined
                      if (transactionType === "rent") {
                        setNewUnit({ ...newUnit, monthly_rent: value })
                      } else if (transactionType === "buy") {
                        setNewUnit({ ...newUnit, sale_price: value })
                      } else {
                        setNewUnit({ ...newUnit, lease_price: value })
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-3 gap-2">
                  {COMMON_AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={newUnit.amenities?.includes(amenity) || false}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newUnit.description || ""}
                  onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                  placeholder="Optional description of the unit"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUnit}>Add Unit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Units Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-2xl font-bold">{units.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-green-600">
                  {units.filter((u) => u.status === "occupied").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-orange-600">
                  {units.filter((u) => u.status === "available").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
                <p className="text-lg font-bold text-purple-600">
                  {currency}{" "}
                  {units.length > 0
                    ? Math.round(
                        units.reduce((sum, unit) => sum + (getPriceForTransaction(unit) || 0), 0) / units.length,
                      ).toLocaleString()
                    : "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Units</CardTitle>
          <CardDescription>Complete list of units in this property</CardDescription>
        </CardHeader>
        <CardContent>
          {units.length === 0 ? (
            <div className="text-center py-8">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No units added yet</p>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Unit
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{unit.unit_number}</p>
                        {unit.floor_number && (
                          <p className="text-sm text-muted-foreground">Floor {unit.floor_number}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{unit.unit_type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {unit.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {unit.bathrooms}
                        </span>
                        {unit.square_footage && (
                          <span className="flex items-center gap-1">
                            <Square className="h-3 w-3" />
                            {unit.square_footage}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {currency} {getPriceForTransaction(unit)?.toLocaleString() || "Not set"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {unit.tenant_name ? (
                        <div>
                          <p className="text-sm font-medium">{unit.tenant_name}</p>
                          {unit.lease_end && (
                            <p className="text-xs text-muted-foreground">
                              Until {new Date(unit.lease_end).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingUnit(unit)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteUnit(unit.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Unit Dialog */}
      <Dialog open={!!editingUnit} onOpenChange={() => setEditingUnit(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Unit {editingUnit?.unit_number}</DialogTitle>
            <DialogDescription>Update unit details and tenant information</DialogDescription>
          </DialogHeader>
          {editingUnit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_unit_number">Unit Number</Label>
                  <Input
                    id="edit_unit_number"
                    value={editingUnit.unit_number}
                    onChange={(e) => setEditingUnit({ ...editingUnit, unit_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                    value={editingUnit.status}
                    onValueChange={(value: any) => setEditingUnit({ ...editingUnit, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editingUnit.status === "occupied" && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Tenant Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant_name">Tenant Name</Label>
                      <Input
                        id="tenant_name"
                        value={editingUnit.tenant_name || ""}
                        onChange={(e) => setEditingUnit({ ...editingUnit, tenant_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant_email">Tenant Email</Label>
                      <Input
                        id="tenant_email"
                        type="email"
                        value={editingUnit.tenant_email || ""}
                        onChange={(e) => setEditingUnit({ ...editingUnit, tenant_email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant_phone">Tenant Phone</Label>
                      <Input
                        id="tenant_phone"
                        value={editingUnit.tenant_phone || ""}
                        onChange={(e) => setEditingUnit({ ...editingUnit, tenant_phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lease_end">Lease End Date</Label>
                      <Input
                        id="lease_end"
                        type="date"
                        value={editingUnit.lease_end || ""}
                        onChange={(e) => setEditingUnit({ ...editingUnit, lease_end: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-3 gap-2">
                  {COMMON_AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-amenity-${amenity}`}
                        checked={editingUnit.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity, true)}
                      />
                      <Label htmlFor={`edit-amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUnit(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUnit}>Update Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
