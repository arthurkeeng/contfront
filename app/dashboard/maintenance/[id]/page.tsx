"use client"

import SingleMaintenanceRequest from "@/components/single_maintenance_request"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

// Mock data - replace with actual data fetching
const mockMaintenanceRequest = {
  id: "MT-001",
  title: "Leaking faucet in kitchen",
  description: "Kitchen faucet has been dripping constantly for 3 days. Water pressure seems low.",
  property: "Sunset Apartments - Unit 2A",
  propertyAddress: "123 Main St, Lagos",
  unit: "Unit 2A",
  tenant_name: "John Adebayo",
  tenant_phone: "+234 801 234 5678",
  priority: "medium" as const,
  status: "in_progress" as const,
  category: "plumbing",
  assigned_to: "Mike Johnson",
  assigned_to_phone: "+234 805 123 4567",
  created_date: "2024-01-15",
  due_date: "2024-01-18",
  estimated_cost: 15000,
  actual_cost: 0,
  comments: 3,
}

export default function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In production, fetch the maintenance request by ID
  // const maintenanceRequest = await fetchMaintenanceRequest(params.id)
  const router = useRouter()
  const { id } = React.use(params)
  const { user, company } = useAuth()
  const [singleRequest, setSingleRequest] = useState<MaintenanceRequest>(mockMaintenanceRequest)
  const fetchMaintenanceRequest = async () => {
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/maintenace/requests/${user?.user_id}/company/${company.company_id}/${id}`)
      let { data } = await res.json()

      setSingleRequest(data)

    } catch (error) {
      throw new Error("Failed to fetch single request")
    }
  }

  const deleteMaintenanceRequest = async() => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/maintenace/requests/${user?.user_id}/company/${company.company_id}/${id}`,
        {
          method : "DELETE"
        }
      )

      res.ok && toast.success("Request Deleted Successfully ")
      router.push("/dashboard/maintenance")
    } catch (error) {
      toast.error("Failed to Delete Maintenance Request")
      throw new Error("Failed to delete maintenance request")
    }
  }

  const updateMaintenanceRequest = async (maintenanceRequest: MaintenanceRequest) => {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/maintenace/requests/${user?.user_id}/company/${company.company_id}/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: maintenanceRequest.title,
            description: maintenanceRequest.description,
            category: maintenanceRequest.category,
            priority: maintenanceRequest.priority,
            tenant_name: maintenanceRequest.tenant_name,
            tenant_phone: maintenanceRequest.tenant_phone,
            assigned_to: maintenanceRequest.assigned_to,
            assigned_to_phone: maintenanceRequest.assigned_to_phone,
            due_date: maintenanceRequest.due_date,
            estimated_cost: maintenanceRequest.estimated_cost,
            status: maintenanceRequest.status
          })
        }
      )
      res.ok && toast.success("Request Updated Successfully")
      router.push("/dashboard/maintenance")
    } catch (error) {
      toast.error("Failed to Update Request")

    }

  }
  useEffect(() => {
    fetchMaintenanceRequest()
  }, [id])

return (
  <div className="space-y-6">
    <SingleMaintenanceRequest 
      maintenanceRequest={singleRequest} 
      onUpdate={updateMaintenanceRequest} 
    />

    <div className="flex justify-end m-4 mr-10">
      <button
        onClick={deleteMaintenanceRequest}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Delete Request
      </button>
    </div>
  </div>
)
}
