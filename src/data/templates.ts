import { Template } from '../types/template';

export const defaultTemplates: Template[] = [
  {
    id: "1",
    title: "Moderno - Modern Business WordPress Theme",
    description: "A modern and clean WordPress theme perfect for businesses of all sizes. Fully responsive and customizable.",
    price: 59,
    image: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "WordPress",
    tags: ["business", "corporate", "modern", "responsive"],
    salesCount: 1245,
    rating: 4.8,
    ratingsCount: 245,
    isFeatured: true,
    isNew: false,
    createdAt: "2023-04-15",
  },
  {
    id: "2",
    title: "Electro - Electronics Store WooCommerce Theme",
    description: "A feature-rich WooCommerce theme designed specifically for electronics stores and tech shops.",
    price: 69,
    salePrice: 49,
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "WooCommerce",
    tags: ["ecommerce", "electronics", "store", "shop"],
    salesCount: 980,
    rating: 4.7,
    ratingsCount: 186,
    isFeatured: true,
    isNew: false,
    createdAt: "2023-05-20",
  },
  {
    id: "3",
    title: "Folio - Creative Portfolio HTML Template",
    description: "A stunning HTML template designed for creatives, photographers, and designers to showcase their work.",
    price: 19,
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "HTML",
    tags: ["portfolio", "creative", "gallery", "minimal"],
    salesCount: 756,
    rating: 4.5,
    ratingsCount: 124,
    isFeatured: false,
    isNew: true,
    createdAt: "2023-07-10",
  },
  {
    id: "4",
    title: "Educare - Education & LMS React Template",
    description: "A comprehensive React template for educational websites, online courses, and LMS platforms.",
    price: 39,
    image: "https://images.pexels.com/photos/5428147/pexels-photo-5428147.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "React",
    tags: ["education", "lms", "courses", "academy"],
    salesCount: 421,
    rating: 4.6,
    ratingsCount: 98,
    isFeatured: false,
    isNew: true,
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    title: "Resto - Restaurant & Café HTML Template",
    description: "An elegant HTML template designed for restaurants, cafés, and food-related businesses.",
    price: 24,
    image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "HTML",
    tags: ["restaurant", "food", "cafe", "menu"],
    salesCount: 632,
    rating: 4.4,
    ratingsCount: 115,
    isFeatured: true,
    isNew: false,
    createdAt: "2023-06-25",
  },
  {
    id: "6",
    title: "ProAdmin - Bootstrap Admin Dashboard",
    description: "A professional Bootstrap admin dashboard template with multiple layouts and UI components.",
    price: 29,
    salePrice: 19,
    image: "https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Admin Templates",
    tags: ["admin", "dashboard", "bootstrap", "responsive"],
    salesCount: 874,
    rating: 4.9,
    ratingsCount: 203,
    isFeatured: true,
    isNew: false,
    createdAt: "2023-05-12",
  },
  {
    id: "7",
    title: "TravelGo - Travel Agency WordPress Theme",
    description: "A beautiful WordPress theme for travel agencies, tour operators, and travel blogs.",
    price: 49,
    image: "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "WordPress",
    tags: ["travel", "tourism", "booking", "tour"],
    salesCount: 512,
    rating: 4.7,
    ratingsCount: 112,
    isFeatured: false,
    isNew: true,
    createdAt: "2023-09-01",
  },
  {
    id: "8",
    title: "Shopify - E-commerce UI Kit",
    description: "A comprehensive UI kit for designing e-commerce websites and applications with Figma.",
    price: 34,
    image: "https://images.pexels.com/photos/6068959/pexels-photo-6068959.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "UI Templates",
    tags: ["ui kit", "ecommerce", "figma", "sketch"],
    salesCount: 368,
    rating: 4.5,
    ratingsCount: 86,
    isFeatured: false,
    isNew: true,
    createdAt: "2023-08-18",
  }
];

export const getTemplates = (): Template[] => {
  const storedTemplates = localStorage.getItem('templates');
  if (storedTemplates) {
    return JSON.parse(storedTemplates);
  }
  localStorage.setItem('templates', JSON.stringify(defaultTemplates));
  return defaultTemplates;
};

export const updateTemplate = (updatedTemplate: Template): void => {
  const templates = getTemplates();
  const updatedTemplates = templates.map(template => 
    template.id === updatedTemplate.id ? updatedTemplate : template
  );
  localStorage.setItem('templates', JSON.stringify(updatedTemplates));
};