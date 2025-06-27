// components/pages/client/dashboard/home/mock-data.ts

export interface MockExpert {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  bio: string;
  skills: string[];
  profilePictureUrl: string;
  rating: number;
  reviewCount: number;
}

export const mockExperts: MockExpert[] = [
  {
    id: "1",
    firstName: "Anna",
    lastName: "Peterson",
    jobTitle:
      "Product Leadership Coach (ex-Director of Product) @ ex-ServiceNow, ex-Yandex",
    bio: "Do you want to get stronger as a product leader? Do you need to build your executive presence, learn to delegate and deliver feedback, manage...",
    skills: ["Leadership", "Executive Presence", "Management"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    rating: 5.0,
    reviewCount: 53,
  },
  {
    id: "2",
    firstName: "Marcus",
    lastName: "Rodriguez",
    jobTitle:
      "Marketing Director @ HubSpot - Growth & Performance Marketing Expert",
    bio: "Need help scaling your marketing efforts? I've helped 50+ companies grow from $0 to $10M+ ARR through performance marketing and conversion optimization...",
    skills: [
      "Growth Marketing",
      "Performance Marketing",
      "Conversion Optimization",
    ],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Thompson",
    jobTitle:
      "Senior Software Engineer @ Microsoft - Full-Stack & System Design Expert",
    bio: "Struggling with technical architecture decisions? I help developers and engineering teams build scalable applications and improve their system design skills...",
    skills: ["System Design", "Full-Stack Development", "Architecture"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    jobTitle:
      "Financial Advisor @ Goldman Sachs - Investment Strategy & Wealth Management",
    bio: "Looking to make smarter financial decisions? With 15 years in investment banking, I help entrepreneurs and professionals build wealth and manage risk...",
    skills: ["Investment Strategy", "Financial Planning", "Wealth Management"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviewCount: 167,
  },
  {
    id: "5",
    firstName: "Jessica",
    lastName: "Park",
    jobTitle:
      "UX Design Lead @ Airbnb - User Experience & Design Systems Specialist",
    bio: "Want to create better user experiences? I help teams design products that users love through user-centered design principles and systematic approaches...",
    skills: ["User Experience", "Design Systems", "User Research"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: "6",
    firstName: "Michael",
    lastName: "Johnson",
    jobTitle:
      "Business Strategy Consultant @ McKinsey & Company - Strategic Planning Expert",
    bio: "Need help with strategic decisions? Former McKinsey consultant with 12+ years helping companies solve complex business challenges and scale efficiently...",
    skills: ["Strategic Planning", "Business Strategy", "Operations"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviewCount: 124,
  },
];
