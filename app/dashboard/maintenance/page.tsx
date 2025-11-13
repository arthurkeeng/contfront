"use client"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Clock, CheckCircle, AlertCircle } from "lucide-react"
import MaintenanceRequestModal from "@/components/maintenance_request"

export default function MaintenancePage() {
  const [requests, setRequests] = useState<any[]>([])

  const handleSubmit = (data: any) => {
    // TODO: Submit to API
    setRequests((prev) => [
      ...prev,
      {
        ...data,
        id: `MT-${Date.now()}`,
        status: "pending",
        created_date: new Date().toISOString().split("T")[0],
      },
    ])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <p className="text-muted-foreground">Manage property and unit maintenance tickets</p>
        </div>
        <MaintenanceRequestModal onSubmit={handleSubmit} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{requests.filter((r) => r.status === "in_progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{requests.filter((r) => r.status === "completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{requests.filter((r) => r.priority === "urgent").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>View and manage maintenance tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No maintenance requests yet</p>
              <MaintenanceRequestModal onSubmit={handleSubmit} />
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {request.category}
                        </Badge>
                        <Badge
                          className={
                            request.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : request.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : request.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                          }
                        >
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {request.created_date}</span>
                        {request.due_date && <span>Due: {request.due_date}</span>}
                        {request.tenant_name && <span>Tenant: {request.tenant_name}</span>}
                      </div>
                    </div>
                    <Link href={`/dashboard/maintenance/${45}`}>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
