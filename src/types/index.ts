export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'website' | 'mobile' | 'n8n' | 'n8n-agents' | 'combo';
  subcategory: string;
  tags: string[];
  images: string[];
  previewUrl?: string;
  demoUrl?: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  fileSize: string;
  compatibility: string[];
  isActive?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedAt: string;
  purchases: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  featured: boolean;
}

export interface SiteStats {
  communityMembers: number;
  digitalItems: number;
  talentedAuthors: number;
  itemsSold: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  rating: number;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}