import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import { writeFileSync } from "fs"

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "Real Estate ERP System - Technical Specification",
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "This document outlines the technical architecture and implementation strategy for a multi-tenant SaaS real estate ERP system. The platform serves real estate and construction companies with role-based access for Admins, Property Managers, Tenants/Buyers, and Maintenance Staff.",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Technology Stack
        new Paragraph({
          text: "Technology Stack",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Backend: ", bold: true }),
            new TextRun({ text: "Node.js with microservices architecture" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Frontend: ", bold: true }),
            new TextRun({ text: "Next.js web application" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Database: ", bold: true }),
            new TextRun({ text: "PostgreSQL with multi-tenant architecture" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Architecture: ", bold: true }),
            new TextRun({ text: "Microservices (not monolithic)" }),
          ],
          spacing: { after: 200 },
        }),

        // User Roles
        new Paragraph({
          text: "User Roles & Permissions",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: "Admin (ERP Owner)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Full CRUD access on all entities\n• Financial reporting across all properties\n• User management and role assignments\n• System configuration and integrations",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Property Manager (Staff)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• CRUD on assigned properties only\n• Approve/deny maintenance requests\n• Generate property-specific reports\n• Manage tenant communications",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Tenant/Buyer (Client)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Read-only access to their lease/contract\n• Submit maintenance requests\n• View payment history\n• Update contact information",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Maintenance Staff",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• View assigned work orders\n• Update ticket status and add notes\n• Upload completion photos\n• Access property contact information",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Architecture Recommendations
        new Paragraph({
          text: "Microservices Architecture",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: "API Gateway Pattern",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Single entry point for all client requests\n• Handles authentication, rate limiting, request/response transformation\n• Routes requests to appropriate microservices\n• Centralized logging and monitoring\n• Consider Kong, AWS API Gateway, or custom Express.js gateway",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Recommended Microservices",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. ", bold: true }),
            new TextRun({ text: "User Management & Auth Service", bold: true }),
            new TextRun({ text: "\n   JWT tokens, role-based permissions, tenant isolation, password resets" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. ", bold: true }),
            new TextRun({ text: "Property Management Service", bold: true }),
            new TextRun({ text: "\n   Property CRUD, availability tracking, property photos/documents" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "3. ", bold: true }),
            new TextRun({ text: "Document/Contract Service", bold: true }),
            new TextRun({ text: "\n   Contract templates, e-signatures, document versioning, legal compliance" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "4. ", bold: true }),
            new TextRun({ text: "Maintenance/Ticketing Service", bold: true }),
            new TextRun({ text: "\n   Work orders, contractor assignments, status tracking, photo uploads" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "5. ", bold: true }),
            new TextRun({ text: "Payment/Billing Service", bold: true }),
            new TextRun({ text: "\n   Rent collection, late fees, payment history, subscription billing" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "6. ", bold: true }),
            new TextRun({ text: "Notification Service", bold: true }),
            new TextRun({ text: "\n   Email/SMS alerts, in-app notifications, maintenance updates" }),
          ],
          spacing: { after: 200 },
        }),

        // Subscription Tiers
        new Paragraph({
          text: "SaaS Subscription Tiers",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: "Basic Tier ($29/month)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Up to 10 properties\n• Basic tenant portal (view lease, pay rent)\n• Simple maintenance requests\n• Basic reporting (occupancy, rent roll)\n• Email notifications only",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Professional Tier ($79/month)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Up to 50 properties\n• Advanced tenant portal (document access, service history)\n• Automated rent collection with late fees\n• Contract management with templates\n• Advanced reporting and analytics\n• SMS + Email notifications\n• Mobile app access",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Enterprise Tier ($199/month)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Unlimited properties\n• Multi-location management\n• Custom contract workflows\n• API access for integrations\n• White-label options\n• Advanced user roles and permissions\n• Priority support\n• Custom reporting dashboards",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Technical Considerations
        new Paragraph({
          text: "Technical Implementation Details",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: "Multi-tenancy Strategy",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Row-Level Security (RLS): PostgreSQL RLS policies to automatically filter data by tenant\n• Tenant Context: Middleware to inject tenant_id into all database queries\n• Data Isolation: Ensure no cross-tenant data leakage through proper indexing\n• Tenant Onboarding: Automated setup of tenant-specific configurations",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Real-time Features",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• WebSocket Architecture: Socket.io for real-time maintenance updates\n• Event-Driven Updates: Instant notifications when maintenance status changes\n• Presence Indicators: Show when property managers are online\n• Live Chat: Between tenants and property managers for urgent issues",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Mobile-First Considerations",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Progressive Web App (PWA): Works offline for maintenance staff\n• Camera Integration: Photo capture for maintenance issues\n• GPS Integration: Location tracking for maintenance assignments\n• Push Notifications: Critical alerts even when app is closed",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Document Management",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Version Control: Track contract changes and amendments\n• Digital Signatures: Integration with DocuSign or similar\n• Template System: Standardized lease agreements with variables\n• Audit Trail: Track who accessed/modified documents\n• Bulk Operations: Mass lease renewals, rent increases",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Scalability Challenges
        new Paragraph({
          text: "Scalability & Performance",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: "Database Scaling",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Read Replicas: For reporting queries that don't need real-time data\n• Connection Pooling: PgBouncer to handle high concurrent connections\n• Query Optimization: Proper indexing on tenant_id, property_id, user_id\n• Archival Strategy: Move old maintenance records to separate tables",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Feature Gating Strategy",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Feature Flag Service: Centralized feature toggles based on subscription\n• Middleware Approach: Check permissions at API level\n• UI Component Wrapping: Higher-order components that hide/show features\n• Database-Driven: Store feature access in subscription configuration",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Integration Recommendations
        new Paragraph({
          text: "Recommended Integrations",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Payment Processors: Stripe for subscription billing, ACH for rent collection\n• Communication: Twilio for SMS, SendGrid for emails\n• Document Storage: AWS S3 or Vercel Blob for file storage\n• Accounting: QuickBooks integration for financial reporting\n• Background Checks: Integration for tenant screening",
            }),
          ],
          spacing: { after: 200 },
        }),

        // Implementation Phases
        new Paragraph({
          text: "Recommended Implementation Phases",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: "Phase 1: Core Foundation",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• User authentication and role management\n• Basic property management\n• Simple tenant portal\n• Basic maintenance ticketing",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Phase 2: Business Logic",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Contract management system\n• Payment processing integration\n• Advanced reporting\n• Notification system",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Phase 3: Advanced Features",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Mobile optimization\n• Real-time features\n• Advanced analytics\n• Third-party integrations",
            }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Phase 4: Enterprise Features",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• White-labeling capabilities\n• API access for customers\n• Advanced customization\n• Enterprise security features",
            }),
          ],
          spacing: { after: 400 },
        }),

        // Footer
        new Paragraph({
          children: [
            new TextRun({
              text: "Document generated on " + new Date().toLocaleDateString(),
              italics: true,
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    },
  ],
})

// Generate the document
Packer.toBuffer(doc).then((buffer) => {
  writeFileSync("Real_Estate_ERP_Technical_Specification.docx", buffer)
  console.log("[v0] Document generated successfully!")
  console.log("[v0] File saved as: Real_Estate_ERP_Technical_Specification.docx")
  console.log("[v0] You can download this file from the project files.")
})
