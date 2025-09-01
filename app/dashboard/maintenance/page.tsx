"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Camera,
  MessageSquare,
} from "lucide-react"

// Mock data for maintenance tickets
const mockMaintenanceTickets = [
  {
    id: "MT-001",
    title: "Leaking faucet in kitchen",
    description: "Kitchen faucet has been dripping constantly for 3 days. Water pressure seems low.",
    property: "Sunset Apartments - Unit 2A",
    propertyAddress: "123 Main St, Lagos",
    tenant: "John Adebayo",
    tenantPhone: "+234 801 234 5678",
    priority: "medium",
    status: "in_progress",
    category: "plumbing",
    assignedTo: "Mike Johnson",
    assignedToPhone: "+234 805 123 4567",
    createdDate: "2024-01-15",
    dueDate: "2024-01-18",
    estimatedCost: 15000,
    actualCost: 0,
    photos: 2,
    comments: 3,
  },
  {
    id: "MT-002",
    title: "Air conditioning not working",
    description: "AC unit stopped working yesterday. Room is getting very hot.",
    property: "Downtown Office Complex - Suite 5B",
    propertyAddress: "456 Business Ave, Abuja",
    tenant: "Sarah Okafor",
    tenantPhone: "+234 802 345 6789",
    priority: "high",
    status: "open",
    category: "hvac",
    assignedTo: null,
    assignedToPhone: null,
    createdDate: "2024-01-16",
    dueDate: "2024-01-17",
    estimatedCost: 45000,
    actualCost: 0,
    photos: 1,
    comments: 1,
  },
  {
    id: "MT-003",
    title: "Broken window in living room",
    description: "Window glass cracked during storm. Needs immediate replacement for security.",
    property: "Green Valley Homes - House 12",
    propertyAddress: "789 Garden Rd, Port Harcourt",
    tenant: "Michael Emeka",
    tenantPhone: "+234 803 456 7890",
    priority: "high",
    status: "assigned",
    category: "general",
    assignedTo: "David Wilson",
    assignedToPhone: "+234 806 234 5678",
    createdDate: "2024-01-14",
    dueDate: "2024-01-16",
    estimatedCost: 25000,
    actualCost: 0,
    photos: 3,
    comments: 5,
  },
  {
    id: "MT-004",
    title: "Electrical outlet not working",
    description: "Power outlet in bedroom stopped working. Other outlets in room work fine.",
    property: "Tech Hub Plaza - Office 3A",
    propertyAddress: "321 Innovation St, Lagos",
    tenant: "Grace Nwosu",
    tenantPhone: "+234 804 567 8901",
    priority: "low",
    status: "completed",
    category: "electrical",
    assignedTo: "James Brown",
    assignedToPhone: "+234 807 345 6789",
    createdDate: "2024-01-10",
    dueDate: "2024-01-15",
    estimatedCost: 8000,
    actualCost: 7500,
    photos: 2,
    comments: 4,
  },
  {
    id: "MT-005",
    title: "Clogged bathroom drain",
    description: "Bathroom sink drains very slowly. Water backs up when washing hands.",
    property: "Sunset Apartments - Unit 4B",
    propertyAddress: "123 Main St, Lagos",
    tenant: "Ahmed Hassan",
    tenantPhone: "+234 808 123 4567",
    priority: "medium",
    status: "pending_approval",
    category: "plumbing",
    assignedTo: "Mike Johnson",
    assignedToPhone: "+234 805 123 4567",
    createdDate: "2024-01-17",
    dueDate: "2024-01-20",
    estimatedCost: 12000,
    actualCost: 0,
    photos: 1,
    comments: 2,
  },
]

export default function MaintenanceManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Calculate summary statistics
  const totalTickets = mockMaintenanceTickets.length
  const openTickets = mockMaintenanceTickets.filter((ticket) => ticket.status === "open").length
  const inProgressTickets = mockMaintenanceTickets.filter((ticket) => ticket.status === "in_progress").length
  const completedTickets = mockMaintenanceTickets.filter((ticket) => ticket.status === "completed").length
  const highPriorityTickets = mockMaintenanceTickets.filter((ticket) => ticket.priority === "high").length
  const totalEstimatedCost = mockMaintenanceTickets.reduce((sum, ticket) => sum + ticket.estimatedCost, 0)
  const totalActualCost = mockMaintenanceTickets.reduce((sum, ticket) => sum + ticket.actualCost, 0)

  // Filter tickets based on search and filters
  const filteredTickets = mockMaintenanceTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Open</Badge>
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Assigned</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
      case "pending_approval":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Pending Approval</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "plumbing":
        return <Wrench className="h-4 w-4 text-blue-600" />
      case "electrical":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "hvac":
        return <Clock className="h-4 w-4 text-purple-600" />
      default:
        return <Wrench className="h-4 w-4 text-gray-600" />
    }
  }

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <ProtectedRoute requiredPermission="maintenance.view">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Maintenance Management</h1>
                <p className="text-sm text-muted-foreground">Track and manage maintenance requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalTickets}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">{highPriorityTickets}</span> high priority
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{inProgressTickets}</div>
                <p className="text-xs text-muted-foreground">{openTickets} awaiting assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{completedTickets}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalActualCost)}</div>
                <p className="text-xs text-muted-foreground">Est: {formatCurrency(totalEstimatedCost)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Tickets</CardTitle>
              <CardDescription>Track and manage all maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets, properties, or tenants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "open" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("open")}
                  >
                    Open
                  </Button>
                  <Button
                    variant={filterStatus === "in_progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("in_progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={filterPriority === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPriority(filterPriority === "high" ? "all" : "high")}
                  >
                    High Priority
                  </Button>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                            {getCategoryIcon(ticket.category)}
                            <h3 className="text-lg font-semibold text-foreground">{ticket.title}</h3>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {ticket.property}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {ticket.tenant}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                            <span className="ml-1">{ticket.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Camera className="h-4 w-4" />
                            <span className="ml-1">{ticket.photos}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Assigned To</p>
                          <p className="font-semibold">{ticket.assignedTo || "Unassigned"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="font-semibold">{new Date(ticket.createdDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p
                            className={`font-semibold ${
                              getDaysOverdue(ticket.dueDate) > 0 ? "text-red-600" : "text-foreground"
                            }`}
                          >
                            {new Date(ticket.dueDate).toLocaleDateString()}
                            {getDaysOverdue(ticket.dueDate) > 0 && (
                              <span className="text-xs ml-1">({getDaysOverdue(ticket.dueDate)}d overdue)</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Estimated Cost</p>
                          <p className="font-semibold">{formatCurrency(ticket.estimatedCost)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Created: {new Date(ticket.createdDate).toLocaleDateString()}
                            </span>
                          </div>
                          {ticket.priority === "high" && (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span>High Priority</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            {ticket.status === "open" ? "Assign" : ticket.status === "completed" ? "Review" : "Update"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No maintenance tickets found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
