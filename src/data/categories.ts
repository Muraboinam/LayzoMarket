export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  featured: boolean;
}

const defaultCategories: Category[] = [
  {
    id: "wordpress",
    name: "WordPress",
    description: "Premium WordPress themes for any kind of website",
    icon: "wordpress",
    count: 1854,
    featured: true,
  },
  {
    id: "html",
    name: "HTML",
    description: "Clean and feature-rich HTML templates",
    icon: "code",
    count: 1247,
    featured: true,
  },
  {
    id: "react",
    name: "React",
    description: "Modern React templates and UI components",
    icon: "component",
    count: 523,
    featured: true,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "E-commerce themes built for WooCommerce",
    icon: "shopping-cart",
    count: 687,
    featured: true,
  },
  {
    id: "admin-templates",
    name: "Admin Templates",
    description: "Backend and admin dashboard templates",
    icon: "layout-dashboard",
    count: 432,
    featured: true,
  },
  {
    id: "ui-templates",
    name: "UI Templates",
    description: "UI kits and design resources",
    icon: "palette",
    count: 321,
    featured: false,
  },
  {
    id: "landing-pages",
    name: "Landing Pages",
    description: "High-converting landing page templates",
    icon: "file-text",
    count: 246,
    featured: false,
  },
  {
    id: "vue",
    name: "Vue.js",
    description: "Vue.js templates and component libraries",
    icon: "layers",
    count: 189,
    featured: false,
  },
];

export const getCategories = (): Category[] => {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  localStorage.setItem('categories', JSON.stringify(defaultCategories));
  return defaultCategories;
};

export const categories = getCategories();

export const updateCategory = (updatedCategory: Category): void => {
  const currentCategories = getCategories();
  const updatedCategories = currentCategories.map(category => 
    category.id === updatedCategory.id ? updatedCategory : category
  );
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
};