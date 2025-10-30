import { Briefcase, Facebook, Home, Instagram, Linkedin, Twitter,Users} from "lucide-react";

export const menuItems =
  [
    { to: "/", icon: Home, label: "Home" },
    { to: "/jobs", icon: Briefcase, label: "Jobs" },
  ]

export const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90k - $120k",
    posted: "2 days ago",
    logo: "🚀",
    tags: ["React", "TypeScript", "Tailwind"]
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Remote",
    salary: "$80k - $110k",
    posted: "1 week ago",
    logo: "🎨",
    tags: ["Figma", "UI/UX", "Prototyping"]
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    posted: "3 days ago",
    logo: "⚙️",
    tags: ["Node.js", "Python", "AWS"]
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateInc",
    location: "Austin, TX",
    type: "Contract",
    salary: "$95k - $125k",
    posted: "5 days ago",
    logo: "📊",
    tags: ["Agile", "Scrum", "Product"]
  }
];


export const loadingStates = [
  "Loading...",
  "Please wait...",
  "Processing...",
  "Initializing...",
  "Getting things ready...",
  "Almost there...",
  "Just a moment...",
  "Preparing content...",
  "Setting things up...",
  "One moment please...",
  "Loading your data...",
]

export const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' }
  ],
  candidates: [
    { name: 'Browse Jobs', href: '/jobs' },
    { name: 'Create Profile', href: '/signup' },
    { name: 'Career Advice', href: '/advice' },
    { name: 'Success Stories', href: '/success' }
  ],
  employers: [
    { name: 'Post a Job', href: '/employers/post' },
    { name: 'Browse Candidates', href: '/candidates' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Employer Resources', href: '/resources' }
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ]
};

export const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' }
];


const hrNavItems = [
  {
    title: "Dashboard",
    url: "/jobs",
    icon: Home,
  },
  {
    title: "Archived",
    url: "/jobs/archive",
    icon: Briefcase,
  },
  {
    title: "Candidates",
    url: "/candidates",
    icon: Users,
  },
];

export default hrNavItems;
