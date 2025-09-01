# PropertyFlow ERP

A comprehensive ERP solution designed specifically for real estate and construction companies. Manage properties, projects, contracts, and teams all in one powerful platform.

## Features

### Real Estate Management
- Property portfolio management
- Tenant portal and lease management
- Automated rent collection
- Maintenance request tracking
- Document management

### Construction Management
- Project timeline tracking
- Contractor and subcontractor management
- Material inventory tracking
- Budget vs actual reporting
- Progress documentation

### Core Features
- Multi-role user management (Admin, Property Manager, Tenant, Maintenance Staff)
- Document storage and management
- Financial tracking and reporting
- Mobile-responsive design
- API access for integrations

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components
- **Backend**: Separate Rust microservices (not included in this repo)
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/your-org/propertyflow-erp.git
cd propertyflow-erp
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   └── ui/               # UI component library
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
\`\`\`

## Subscription Plans

### Real Estate Plans
- **Starter** ($49/month): Up to 25 properties, basic features
- **Professional** ($99/month): Up to 100 properties, advanced features
- **Both Industries** ($149/month): Real estate + construction features

### Construction Plans
- **Starter** ($49/month): Up to 25 projects, basic features
- **Professional** ($109/month): Up to 100 projects, advanced features
- **Both Industries** ($149/month): Construction + real estate features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@propertyflow-erp.com or visit our [help center](https://help.propertyflow-erp.com).
