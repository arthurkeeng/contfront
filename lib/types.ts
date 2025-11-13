
interface Property {
  id: string
  property_name: string
  property_address: string
}

interface Unit {
  id: string
  unit_number: string
  unit_type: string
  tenant_name?: string
  tenant_phone?: string
  tenant_email?: string
}

interface MaintenanceRequestFormData {
  property_id: string
  unit_id?: string
  title: string
  description: string
  category: string
  priority: string
  tenant_name?: string
  tenant_phone?: string
  tenant_email?: string
  assigned_to?: string
  assigned_to_phone?: string
  due_date?: string
  estimated_cost?: number
}
interface MaintenanceRequest {
  id: string
  title: string
  description: string
  property: string
  propertyAddress: string
  unit?: string
  tenant: string
  tenantPhone: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  category: string
  assignedTo?: string
  assignedToPhone?: string
  createdDate: string
  dueDate: string
  estimatedCost: number
  actualCost: number
  comments: number
}

interface Property {
    id: string
  property_name: string
  property_address: string
 
  description?: string
  created_at: string

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
  square_footage?: number
  lot_size?: number
  bedrooms?: number
  bathrooms?: number
  year_built?: number
  parking_spaces?: number
  property_description?: string
  amenities?: string[]
  neighborhood?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  property_manager?: string
  acquisition_date?: string
  last_renovation?: string
  property_tax?: string
  insurance_cost?: string
  hoa_fees?: string
  utilities_included?: string[]
  pet_policy?: string
  lease_terms?: string
  security_deposit?: string
  application_fee?: string
  files: PropertyFile[]
}
interface PropertyFile {
  id?: string
  file_name: string
  file_type: string
  file_category: "image" | "document"
  s3_key: string
  preview?: string // for local uploads
}
interface PropertyManager {
  name: string
  email: string
  phone?: string
}

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

interface Files{
  cloudinary_url : string
}