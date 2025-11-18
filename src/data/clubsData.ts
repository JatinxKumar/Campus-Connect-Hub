export interface Club {
  id: number;
  name: string;
  description: string;
  category: string;
  members: number;
  coordinator: string;
  image: string;
  featured?: boolean;
}

export const clubs: Club[] = [
  {
    id: 1,
    name: "Coding Club",
    description: "Learn programming, participate in hackathons, and build amazing projects together.",
    category: "Technical",
    members: 145,
    coordinator: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 2,
    name: "Robotics Club",
    description: "Design, build, and program robots for competitions and real-world applications.",
    category: "Technical",
    members: 87,
    coordinator: "Prof. Michael Chen",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 3,
    name: "Drama Society",
    description: "Express yourself through theater, stage performances, and creative storytelling.",
    category: "Arts",
    members: 92,
    coordinator: "Ms. Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop"
  },
  {
    id: 4,
    name: "Photography Club",
    description: "Capture moments, learn photography techniques, and showcase your creative vision.",
    category: "Arts",
    members: 76,
    coordinator: "Mr. David Lee",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 5,
    name: "Environmental Club",
    description: "Make a difference through sustainability initiatives and environmental awareness campaigns.",
    category: "Social",
    members: 134,
    coordinator: "Dr. Rachel Green",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
  },
  {
    id: 6,
    name: "Music Society",
    description: "Create harmony through instrumental and vocal performances across all genres.",
    category: "Arts",
    members: 108,
    coordinator: "Prof. James Williams",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop"
  },
  {
    id: 7,
    name: "Debate Club",
    description: "Sharpen your argumentation skills and compete in inter-college debate competitions.",
    category: "Academic",
    members: 65,
    coordinator: "Ms. Patricia Brown",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop"
  },
  {
    id: 8,
    name: "Sports Club",
    description: "Stay fit, play various sports, and represent the college in athletic events.",
    category: "Sports",
    members: 201,
    coordinator: "Coach Mark Thompson",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
  }
];
