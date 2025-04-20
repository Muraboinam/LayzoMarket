export interface Template {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  salePrice?: number;
  image: string;
  additionalImages?: string[];
  videoUrl?: string;
  category: string;
  tags: string[];
  salesCount: number;
  rating: number;
  ratingsCount: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  templateFiles?: string;
  livePreviewUrl?: string;
  demoCredentials?: {
    username: string;
    password: string;
  };
  status?: 'draft' | 'published';
}