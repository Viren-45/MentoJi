// components/pages/browse-experts/components/mock-data.ts

export interface BrowseExpert {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  bio: string;
  skills: string[];
  profilePictureUrl: string;
  rating: number;
  reviewCount: number;
  rate: number; // in dollars
  sessionLength: number; // in minutes
  isFree?: boolean;
  availableToday: boolean;
}

export const browseExpertsData: BrowseExpert[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Chen",
    jobTitle: "Product Leadership Coach @ Google - Former Director of Product",
    bio: "Want to accelerate your product career? I help product managers develop leadership skills, strategic thinking, and executive presence to advance to senior roles...",
    skills: ["Product Strategy", "Leadership", "Team Management"],
    profilePictureUrl: "/Demo-Experts/1.jpg",
    rating: 5.0,
    reviewCount: 127,
    rate: 85,
    sessionLength: 30,
    availableToday: true,
  },
  {
    id: "2",
    firstName: "Marcus",
    lastName: "Rodriguez",
    jobTitle:
      "Growth Marketing Director @ HubSpot - Performance Marketing Expert",
    bio: "Struggling with customer acquisition? I've scaled 50+ companies from startup to $10M+ ARR using data-driven growth strategies and conversion optimization...",
    skills: ["Growth Marketing", "Performance Marketing", "Analytics"],
    profilePictureUrl: "/Demo-Experts/2.jpg",
    rating: 4.9,
    reviewCount: 89,
    rate: 75,
    sessionLength: 15,
    availableToday: false,
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Thompson",
    jobTitle:
      "Senior Software Engineer @ Microsoft - Full-Stack & System Design",
    bio: "Need help with technical architecture? I specialize in scalable system design, code reviews, and helping developers level up their technical skills...",
    skills: ["System Design", "Full-Stack Development", "Code Review"],
    profilePictureUrl: "/Demo-Experts/3.jpg",
    rating: 4.8,
    reviewCount: 156,
    rate: 0,
    sessionLength: 20,
    isFree: true,
    availableToday: true,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    jobTitle:
      "Investment Advisor @ Goldman Sachs - Wealth Management & Strategy",
    bio: "Looking to make smarter financial decisions? With 15+ years in investment banking, I help entrepreneurs build wealth and manage financial risk...",
    skills: ["Investment Strategy", "Financial Planning", "Risk Management"],
    profilePictureUrl: "/Demo-Experts/4.jpg",
    rating: 4.7,
    reviewCount: 203,
    rate: 120,
    sessionLength: 45,
    availableToday: true,
  },
  {
    id: "5",
    firstName: "Jessica",
    lastName: "Park",
    jobTitle: "UX Design Lead @ Airbnb - User Experience & Design Systems",
    bio: "Want to create better user experiences? I help teams design products that users love through research-driven design and systematic approaches...",
    skills: ["User Experience", "Design Systems", "User Research"],
    profilePictureUrl: "/Demo-Experts/5.jpg",
    rating: 4.9,
    reviewCount: 78,
    rate: 95,
    sessionLength: 30,
    availableToday: false,
  },
  {
    id: "6",
    firstName: "Michael",
    lastName: "Johnson",
    jobTitle:
      "Business Strategy Consultant @ McKinsey & Company - Strategic Planning",
    bio: "Need strategic guidance? Former McKinsey consultant helping companies solve complex challenges, optimize operations, and scale efficiently...",
    skills: ["Strategic Planning", "Business Strategy", "Operations"],
    profilePictureUrl: "/Demo-Experts/6.jpg",
    rating: 4.8,
    reviewCount: 134,
    rate: 150,
    sessionLength: 60,
    availableToday: true,
  },
  {
    id: "7",
    firstName: "Lisa",
    lastName: "Wang",
    jobTitle:
      "Corporate Lawyer @ Wilson Sonsini - Tech Startups & Venture Capital",
    bio: "Navigating legal challenges? I specialize in startup law, contract negotiation, and helping founders structure deals that protect their interests...",
    skills: ["Corporate Law", "Contract Negotiation", "Startup Legal"],
    profilePictureUrl: "/Demo-Experts/7.jpg",
    rating: 4.9,
    reviewCount: 67,
    rate: 200,
    sessionLength: 30,
    availableToday: false,
  },
  {
    id: "8",
    firstName: "Alex",
    lastName: "Turner",
    jobTitle: "Sales Director @ Salesforce - B2B Sales & Team Building",
    bio: "Ready to scale your sales? I've built sales teams from 0 to $50M+ ARR. Expert in B2B processes, CRM optimization, and creating winning sales cultures...",
    skills: ["B2B Sales", "Sales Strategy", "Team Building"],
    profilePictureUrl: "/Demo-Experts/8.jpg",
    rating: 4.7,
    reviewCount: 112,
    rate: 0,
    sessionLength: 15,
    isFree: true,
    availableToday: true,
  },
];
