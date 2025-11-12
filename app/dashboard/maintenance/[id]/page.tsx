import SingleMaintenanceRequest from "@/components/single_maintenance_request"

// Mock data - replace with actual data fetching
const mockMaintenanceRequest = {
  id: "MT-001",
  title: "Leaking faucet in kitchen",
  description: "Kitchen faucet has been dripping constantly for 3 days. Water pressure seems low.",
  property: "Sunset Apartments - Unit 2A",
  propertyAddress: "123 Main St, Lagos",
  unit: "Unit 2A",
  tenant: "John Adebayo",
  tenantPhone: "+234 801 234 5678",
  priority: "medium" as const,
  status: "in_progress" as const,
  category: "plumbing",
  assignedTo: "Mike Johnson",
  assignedToPhone: "+234 805 123 4567",
  createdDate: "2024-01-15",
  dueDate: "2024-01-18",
  estimatedCost: 15000,
  actualCost: 0,
  comments: 3,
}

export default function MaintenanceDetailPage({ params }: { params: { id: string } }) {
  // In production, fetch the maintenance request by ID
  // const maintenanceRequest = await fetchMaintenanceRequest(params.id)

  return <SingleMaintenanceRequest maintenanceRequest={mockMaintenanceRequest} />
}
