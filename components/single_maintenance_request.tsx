"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  User,
  Phone,
  Calendar,
  DollarSign,
  MessageSquare,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react"


interface SingleMaintenanceRequestProps {
  maintenanceRequest: MaintenanceRequest
  onUpdate?: (updatedRequest: MaintenanceRequest) => void
  onClose?: () => void
}

const SingleMaintenanceRequest = ({
  maintenanceRequest: initialRequest,
  onUpdate,
  onClose,
}: SingleMaintenanceRequestProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [maintenanceRequest, setMaintenanceRequest] = useState<MaintenanceRequest>(initialRequest)
  const [editedRequest, setEditedRequest] = useState<MaintenanceRequest>(initialRequest)

  useEffect(() => {
  setMaintenanceRequest(initialRequest)
  setEditedRequest(initialRequest)
}, [initialRequest])


  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  const statusColors = {
    pending: "bg-gray-100 text-gray-800 border-gray-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  const statusIcons = {
    pending: Clock,
    in_progress: Wrench,
    completed: CheckCircle2,
    cancelled: X,
  }

  const handleSave = () => {
    setMaintenanceRequest(editedRequest)
    setIsEditing(false)
    onUpdate?.(editedRequest)
  }

  const handleCancel = () => {
    setEditedRequest(maintenanceRequest)
    setIsEditing(false)
  }

  const StatusIcon = statusIcons[maintenanceRequest.status]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{maintenanceRequest.title}</h1>
            <Badge className={priorityColors[maintenanceRequest.priority]}>
              {maintenanceRequest.priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">Request ID: {maintenanceRequest.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            Status & Priority
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              {isEditing ? (
                <Select
                  value={editedRequest.status}
                  onValueChange={(value) => setEditedRequest({ ...editedRequest, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={`${statusColors[maintenanceRequest.status]} mt-2`}>
                  {maintenanceRequest.status.replace("_", " ").toUpperCase()}
                </Badge>
              )}
            </div>
            <div>
              <Label>Priority</Label>
              {isEditing ? (
                <Select
                  value={editedRequest.priority}
                  onValueChange={(value) => setEditedRequest({ ...editedRequest, priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={`${priorityColors[maintenanceRequest.priority]} mt-2`}>
                  {maintenanceRequest.priority.toUpperCase()}
                </Badge>
              )}
            </div>
            <div>
              <Label>Category</Label>
              {isEditing ? (
                <Select
                  value={editedRequest.category}
                  onValueChange={(value) => setEditedRequest({ ...editedRequest, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="appliance">Appliance</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="pest_control">Pest Control</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2 font-medium capitalize">{maintenanceRequest.category.replace("_", " ")}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editedRequest.title}
                  onChange={(e) => setEditedRequest({ ...editedRequest, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editedRequest.description}
                  onChange={(e) => setEditedRequest({ ...editedRequest, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed">{maintenanceRequest.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Property & Tenant Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Property</Label>
              <p className="font-medium">{maintenanceRequest.property}</p>
            </div>
            {maintenanceRequest.unit && (
              <div>
                <Label className="text-muted-foreground">Unit</Label>
                <p className="font-medium">{maintenanceRequest.unit}</p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Address</Label>
              <p className="font-medium">{maintenanceRequest.propertyAddress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              {isEditing ? (
                <Input
                disabled
                  value={editedRequest.tenant_name}
                  onChange={(e) => setEditedRequest({ ...editedRequest, tenant_name: e.target.value })}
                />
              ) : (
                <p className="font-medium">{maintenanceRequest.tenant_name}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              {isEditing ? (
                <Input
                disabled
                  value={editedRequest.tenant_phone}
                  onChange={(e) => setEditedRequest({ ...editedRequest, tenant_phone: e.target.value })}
                />
              ) : (
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {maintenanceRequest.tenant_phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment & Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenanceRequest.assigned_to ? (
              <>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  {isEditing ? (
                    <Input
                      value={editedRequest.assigned_to || ""}
                      onChange={(e) => setEditedRequest({ ...editedRequest, assigned_to: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{maintenanceRequest.assigned_to}</p>
                  )}
                </div>
                {maintenanceRequest.assigned_to_phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={editedRequest.assigned_to_phone || ""}
                        onChange={(e) => setEditedRequest({ ...editedRequest, assigned_to_phone: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {maintenanceRequest.assigned_to_phone}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>Not yet assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Created Date</Label>
              <p className="font-medium">{new Date(maintenanceRequest.created_date).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Due Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedRequest.due_date}
                  onChange={(e) => setEditedRequest({ ...editedRequest, due_date: e.target.value })}
                />
              ) : (
                <p className="font-medium">{new Date(maintenanceRequest.due_date).toLocaleDateString()}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Estimated Cost</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedRequest.estimated_cost}
                  onChange={(e) => setEditedRequest({ ...editedRequest, estimated_cost: Number(e.target.value) })}
                />
              ) : (
                <p className="text-2xl font-bold">₦{maintenanceRequest.estimated_cost}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">Actual Cost</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedRequest.actual_cost}
                  onChange={(e) => setEditedRequest({ ...editedRequest, actual_cost: Number(e.target.value) })}
                />
              ) : (
                <p className="text-2xl font-bold">
                  {maintenanceRequest.actual_cost > 0
                    ? `₦${maintenanceRequest.actual_cost.toLocaleString()}`
                    : "Not yet determined"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({maintenanceRequest.comments})
          </CardTitle>
          <CardDescription>Activity and updates on this maintenance request</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Comments section coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SingleMaintenanceRequest
