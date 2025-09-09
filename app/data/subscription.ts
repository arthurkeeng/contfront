// data/subscriptions.ts

export const subscriptions = {
  "real-estate": [
    {
      name: "Starter",
      price: 49,
      description: "Perfect for small property managers",
      popular: false,
      features: [
        "Up to 25 properties",
        "Basic tenant portal",
        "Document storage",
        "Basic maintenance tracking"
      ],
    },
    {
      name: "Professional",
      price: 99,
      description: "Complete real estate management",
      popular: true,
      features: [
        "Up to 100 properties",
        "Advanced tenant portal",
        "Automated rent collection",
        "Lease management & reporting"
      ],
    },
    {
      name: "Both Industries",
      price: 149,
      description: "Real estate + construction features",
      popular: false,
      features: [
        "Everything in Professional",
        "Project management tools",
        "Contractor management",
        "Material tracking"
      ],
    },
  ],
  "construction": [
    {
      name: "Starter",
      price: 49,
      description: "Perfect for small contractors",
      popular: false,
      features: [
        "Up to 25 projects",
        "Basic project tracking",
        "Document storage",
        "Basic team management"
      ],
    },
    {
      name: "Professional",
      price: 109,
      description: "Complete construction management",
      popular: true,
      features: [
        "Up to 100 projects",
        "Advanced project timelines",
        "Contractor & subcontractor management",
        "Material inventory & budget tracking"
      ],
    },
    {
      name: "Both Industries",
      price: 149,
      description: "Construction + real estate features",
      popular: false,
      features: [
        "Everything in Professional",
        "Property management tools",
        "Tenant portal & lease management",
        "Automated rent collection"
      ],
    },
  ],
}
