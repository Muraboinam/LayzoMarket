import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { startAfter } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

// Interface for Firestore template document
export interface FirestoreTemplate {
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

// Convert Firestore document to Product type
const convertFirestoreToProduct = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    price: data.price || 0,
    originalPrice: data.originalPrice,
    category: data.category || 'website',
    subcategory: data.subcategory || '',
    tags: data.tags || [],
    images: data.images || [],
    previewUrl: data.previewUrl,
    demoUrl: data.demoUrl,
    rating: data.rating || 0,
    reviewCount: data.reviewCount || 0,
    downloads: data.downloads || 0,
    author: data.author || 'Unknown',
    authorAvatar: data.authorAvatar || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    featured: data.featured || false,
    fileSize: data.fileSize || '0 MB',
    compatibility: data.compatibility || []
  };
};

// Get all templates from the main templates collection
export const getAllTemplates = async (): Promise<Product[]> => {
  try {
    console.log('Fetching all templates from Firestore...');
    const templatesRef = collection(db, 'templates');
    const querySnapshot = await getDocs(templatesRef);
    
    const templates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      templates.push(template);
    });

    console.log(`Fetched ${templates.length} templates from main collection`);
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

// Get app templates from the app subfolder
export const getAppTemplates = async (): Promise<Product[]> => {
  try {
    console.log('Fetching app templates from Firestore...');
    const appTemplatesRef = collection(db, 'templates', 'app', 'items');
    const querySnapshot = await getDocs(appTemplatesRef);
    
    const appTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      // Ensure category is set to mobile for app templates
      template.category = 'mobile';
      appTemplates.push(template);
    });

    console.log(`Fetched ${appTemplates.length} app templates from app subfolder`);
    return appTemplates;
  } catch (error) {
    console.error('Error fetching app templates:', error);
    throw error;
  }
};

// Get featured app templates
export const getFeaturedAppTemplates = async (limitCount: number = 4): Promise<Product[]> => {
  try {
    console.log('Fetching featured app templates from Firestore...');
    const appTemplatesRef = collection(db, 'templates', 'app', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      appTemplatesRef,
      where('featured', '==', true),
      limit(limitCount * 2) // Get more to filter client-side
    );
    
    const querySnapshot = await getDocs(q);
    
    const featuredTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'mobile';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        featuredTemplates.push(template);
      }
    });

    // Sort by downloads client-side and limit results
    featuredTemplates.sort((a, b) => b.downloads - a.downloads);
    const limitedTemplates = featuredTemplates.slice(0, limitCount);

    console.log(`Fetched ${limitedTemplates.length} featured app templates`);
    return limitedTemplates;
  } catch (error) {
    console.error('Error fetching featured app templates:', error);
    throw error;
  }
};

// Get app templates by category
export const getAppTemplatesByCategory = async (subcategory: string): Promise<Product[]> => {
  try {
    console.log(`Fetching app templates for category: ${subcategory}`);
    const appTemplatesRef = collection(db, 'templates', 'app', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      appTemplatesRef,
      where('subcategory', '==', subcategory)
    );
    
    const querySnapshot = await getDocs(q);
    
    const templates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'mobile';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        templates.push(template);
      }
    });

    // Sort by downloads client-side
    templates.sort((a, b) => b.downloads - a.downloads);

    console.log(`Fetched ${templates.length} app templates for category: ${subcategory}`);
    return templates;
  } catch (error) {
    console.error(`Error fetching app templates for category ${subcategory}:`, error);
    throw error;
  }
};

// Get single app template by ID
export const getAppTemplateById = async (templateId: string): Promise<Product | null> => {
  try {
    console.log(`Fetching app template with ID: ${templateId}`);
    const templateRef = doc(db, 'templates', 'app', 'items', templateId);
    const docSnap = await getDoc(templateRef);
    
    if (docSnap.exists()) {
      const template = convertFirestoreToProduct(docSnap);
      template.category = 'mobile';
      console.log(`Found app template: ${template.title}`);
      return template;
    } else {
      console.log(`No app template found with ID: ${templateId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching app template ${templateId}:`, error);
    throw error;
  }
};

// Search app templates
export const searchAppTemplates = async (searchTerm: string): Promise<Product[]> => {
  try {
    console.log(`Searching app templates for: ${searchTerm}`);
    const appTemplatesRef = collection(db, 'templates', 'app', 'items');
    const querySnapshot = await getDocs(appTemplatesRef);
    
    const searchResults: Product[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'mobile';
      
      // Search in title, description, and tags
      const matchesTitle = template.title.toLowerCase().includes(searchLower);
      const matchesDescription = template.description.toLowerCase().includes(searchLower);
      const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (matchesTitle || matchesDescription || matchesTags) {
        searchResults.push(template);
      }
    });

    // Sort by relevance (title matches first, then description, then tags)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchLower);
      const bTitle = b.title.toLowerCase().includes(searchLower);
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return b.downloads - a.downloads; // Secondary sort by downloads
    });

    console.log(`Found ${searchResults.length} app templates matching: ${searchTerm}`);
    return searchResults;
  } catch (error) {
    console.error(`Error searching app templates for "${searchTerm}":`, error);
    throw error;
  }
};

// Get app templates with pagination
export const getAppTemplatesWithPagination = async (
  pageSize: number = 12,
  lastVisible?: any
): Promise<{ templates: Product[]; lastVisible: any; hasMore: boolean }> => {
  try {
    console.log(`Fetching app templates with pagination (pageSize: ${pageSize})`);
    const appTemplatesRef = collection(db, 'templates', 'app', 'items');
    
    // Simplified query to avoid complex index requirements
    let q = query(
      appTemplatesRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1) // Get one extra to check if there are more
    );
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(q);
    const templates: Product[] = [];
    let newLastVisible = null;
    
    querySnapshot.forEach((doc, index) => {
      if (index < pageSize) {
        const template = convertFirestoreToProduct(doc);
        template.category = 'mobile';
        // Filter out inactive templates client-side
        if (template.isActive !== false) {
          templates.push(template);
          newLastVisible = doc;
        }
      }
    });
    
    const hasMore = querySnapshot.docs.length > pageSize;
    
    console.log(`Fetched ${templates.length} app templates (hasMore: ${hasMore})`);
    return {
      templates,
      lastVisible: newLastVisible,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching app templates with pagination:', error);
    throw error;
  }
};

// Get website templates from the website subfolder
export const getWebsiteTemplates = async (): Promise<Product[]> => {
  try {
    console.log('Fetching website templates from Firestore...');
    const websiteTemplatesRef = collection(db, 'templates', 'website', 'items');
    const querySnapshot = await getDocs(websiteTemplatesRef);
    
    const websiteTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      // Ensure category is set to website for website templates
      template.category = 'website';
      websiteTemplates.push(template);
    });

    console.log(`Fetched ${websiteTemplates.length} website templates from website subfolder`);
    return websiteTemplates;
  } catch (error) {
    console.error('Error fetching website templates:', error);
    throw error;
  }
};

// Get featured website templates
export const getFeaturedWebsiteTemplates = async (limitCount: number = 4): Promise<Product[]> => {
  try {
    console.log('Fetching featured website templates from Firestore...');
    const websiteTemplatesRef = collection(db, 'templates', 'website', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      websiteTemplatesRef,
      where('featured', '==', true),
      limit(limitCount * 2) // Get more to filter client-side
    );
    
    const querySnapshot = await getDocs(q);
    
    const featuredTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'website';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        featuredTemplates.push(template);
      }
    });

    // Sort by downloads client-side and limit results
    featuredTemplates.sort((a, b) => b.downloads - a.downloads);
    const limitedTemplates = featuredTemplates.slice(0, limitCount);

    console.log(`Fetched ${limitedTemplates.length} featured website templates`);
    return limitedTemplates;
  } catch (error) {
    console.error('Error fetching featured website templates:', error);
    throw error;
  }
};

// Get website templates by category
export const getWebsiteTemplatesByCategory = async (subcategory: string): Promise<Product[]> => {
  try {
    console.log(`Fetching website templates for category: ${subcategory}`);
    const websiteTemplatesRef = collection(db, 'templates', 'website', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      websiteTemplatesRef,
      where('subcategory', '==', subcategory)
    );
    
    const querySnapshot = await getDocs(q);
    
    const templates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'website';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        templates.push(template);
      }
    });

    // Sort by downloads client-side
    templates.sort((a, b) => b.downloads - a.downloads);

    console.log(`Fetched ${templates.length} website templates for category: ${subcategory}`);
    return templates;
  } catch (error) {
    console.error(`Error fetching website templates for category ${subcategory}:`, error);
    throw error;
  }
};

// Get single website template by ID
export const getWebsiteTemplateById = async (templateId: string): Promise<Product | null> => {
  try {
    console.log(`Fetching website template with ID: ${templateId}`);
    const templateRef = doc(db, 'templates', 'website', 'items', templateId);
    const docSnap = await getDoc(templateRef);
    
    if (docSnap.exists()) {
      const template = convertFirestoreToProduct(docSnap);
      template.category = 'website';
      console.log(`Found website template: ${template.title}`);
      return template;
    } else {
      console.log(`No website template found with ID: ${templateId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching website template ${templateId}:`, error);
    throw error;
  }
};

// Search website templates
export const searchWebsiteTemplates = async (searchTerm: string): Promise<Product[]> => {
  try {
    console.log(`Searching website templates for: ${searchTerm}`);
    const websiteTemplatesRef = collection(db, 'templates', 'website', 'items');
    const querySnapshot = await getDocs(websiteTemplatesRef);
    
    const searchResults: Product[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'website';
      
      // Search in title, description, and tags
      const matchesTitle = template.title.toLowerCase().includes(searchLower);
      const matchesDescription = template.description.toLowerCase().includes(searchLower);
      const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (matchesTitle || matchesDescription || matchesTags) {
        searchResults.push(template);
      }
    });

    // Sort by relevance (title matches first, then description, then tags)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchLower);
      const bTitle = b.title.toLowerCase().includes(searchLower);
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return b.downloads - a.downloads; // Secondary sort by downloads
    });

    console.log(`Found ${searchResults.length} website templates matching: ${searchTerm}`);
    return searchResults;
  } catch (error) {
    console.error(`Error searching website templates for "${searchTerm}":`, error);
    throw error;
  }
};

// Get website templates with pagination
export const getWebsiteTemplatesWithPagination = async (
  pageSize: number = 12,
  lastVisible?: any
): Promise<{ templates: Product[]; lastVisible: any; hasMore: boolean }> => {
  try {
    console.log(`Fetching website templates with pagination (pageSize: ${pageSize})`);
    const websiteTemplatesRef = collection(db, 'templates', 'website', 'items');
    
    // Simplified query to avoid complex index requirements
    let q = query(
      websiteTemplatesRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1) // Get one extra to check if there are more
    );
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(q);
    const templates: Product[] = [];
    let newLastVisible = null;
    
    querySnapshot.forEach((doc, index) => {
      if (index < pageSize) {
        const template = convertFirestoreToProduct(doc);
        template.category = 'website';
        // Filter out inactive templates client-side
        if (template.isActive !== false) {
          templates.push(template);
          newLastVisible = doc;
        }
      }
    });
    
    const hasMore = querySnapshot.docs.length > pageSize;
    
    console.log(`Fetched ${templates.length} website templates (hasMore: ${hasMore})`);
    return {
      templates,
      lastVisible: newLastVisible,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching website templates with pagination:', error);
    throw error;
  }
};

// Get n8n workflow templates from the n8n-workflow subfolder
export const getN8nWorkflowTemplates = async (): Promise<Product[]> => {
  try {
    console.log('Fetching n8n workflow templates from Firestore...');
    const n8nTemplatesRef = collection(db, 'templates', 'n8n-workflow', 'items');
    const querySnapshot = await getDocs(n8nTemplatesRef);
    
    const n8nTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      // Ensure category is set to n8n-agents for n8n workflow templates
      template.category = 'n8n-agents';
      n8nTemplates.push(template);
    });

    console.log(`Fetched ${n8nTemplates.length} n8n workflow templates from n8n-workflow subfolder`);
    return n8nTemplates;
  } catch (error) {
    console.error('Error fetching n8n workflow templates:', error);
    throw error;
  }
};

// Get featured n8n workflow templates
export const getFeaturedN8nWorkflowTemplates = async (limitCount: number = 4): Promise<Product[]> => {
  try {
    console.log('Fetching featured n8n workflow templates from Firestore...');
    const n8nTemplatesRef = collection(db, 'templates', 'n8n-workflow', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      n8nTemplatesRef,
      where('featured', '==', true),
      limit(limitCount * 2) // Get more to filter client-side
    );
    
    const querySnapshot = await getDocs(q);
    
    const featuredTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'n8n-agents';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        featuredTemplates.push(template);
      }
    });

    // Sort by downloads client-side and limit results
    featuredTemplates.sort((a, b) => b.downloads - a.downloads);
    const limitedTemplates = featuredTemplates.slice(0, limitCount);

    console.log(`Fetched ${limitedTemplates.length} featured n8n workflow templates`);
    return limitedTemplates;
  } catch (error) {
    console.error('Error fetching featured n8n workflow templates:', error);
    throw error;
  }
};

// Get n8n workflow templates by category
export const getN8nWorkflowTemplatesByCategory = async (subcategory: string): Promise<Product[]> => {
  try {
    console.log(`Fetching n8n workflow templates for category: ${subcategory}`);
    const n8nTemplatesRef = collection(db, 'templates', 'n8n-workflow', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      n8nTemplatesRef,
      where('subcategory', '==', subcategory)
    );
    
    const querySnapshot = await getDocs(q);
    
    const templates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'n8n-agents';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        templates.push(template);
      }
    });

    // Sort by downloads client-side
    templates.sort((a, b) => b.downloads - a.downloads);

    console.log(`Fetched ${templates.length} n8n workflow templates for category: ${subcategory}`);
    return templates;
  } catch (error) {
    console.error(`Error fetching n8n workflow templates for category ${subcategory}:`, error);
    throw error;
  }
};

// Get single n8n workflow template by ID
export const getN8nWorkflowTemplateById = async (templateId: string): Promise<Product | null> => {
  try {
    console.log(`Fetching n8n workflow template with ID: ${templateId}`);
    const templateRef = doc(db, 'templates', 'n8n-workflow', 'items', templateId);
    const docSnap = await getDoc(templateRef);
    
    if (docSnap.exists()) {
      const template = convertFirestoreToProduct(docSnap);
      template.category = 'n8n-agents';
      console.log(`Found n8n workflow template: ${template.title}`);
      return template;
    } else {
      console.log(`No n8n workflow template found with ID: ${templateId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching n8n workflow template ${templateId}:`, error);
    throw error;
  }
};

// Search n8n workflow templates
export const searchN8nWorkflowTemplates = async (searchTerm: string): Promise<Product[]> => {
  try {
    console.log(`Searching n8n workflow templates for: ${searchTerm}`);
    const n8nTemplatesRef = collection(db, 'templates', 'n8n-workflow', 'items');
    const querySnapshot = await getDocs(n8nTemplatesRef);
    
    const searchResults: Product[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'n8n-agents';
      
      // Search in title, description, and tags
      const matchesTitle = template.title.toLowerCase().includes(searchLower);
      const matchesDescription = template.description.toLowerCase().includes(searchLower);
      const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (matchesTitle || matchesDescription || matchesTags) {
        searchResults.push(template);
      }
    });

    // Sort by relevance (title matches first, then description, then tags)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchLower);
      const bTitle = b.title.toLowerCase().includes(searchLower);
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return b.downloads - a.downloads; // Secondary sort by downloads
    });

    console.log(`Found ${searchResults.length} n8n workflow templates matching: ${searchTerm}`);
    return searchResults;
  } catch (error) {
    console.error(`Error searching n8n workflow templates for "${searchTerm}":`, error);
    throw error;
  }
};

// Get n8n workflow templates with pagination
export const getN8nWorkflowTemplatesWithPagination = async (
  pageSize: number = 12,
  lastVisible?: any
): Promise<{ templates: Product[]; lastVisible: any; hasMore: boolean }> => {
  try {
    console.log(`Fetching n8n workflow templates with pagination (pageSize: ${pageSize})`);
    const n8nTemplatesRef = collection(db, 'templates', 'n8n-workflow', 'items');
    
    // Simplified query to avoid complex index requirements
    let q = query(
      n8nTemplatesRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1) // Get one extra to check if there are more
    );
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(q);
    const templates: Product[] = [];
    let newLastVisible = null;
    
    querySnapshot.forEach((doc, index) => {
      if (index < pageSize) {
        const template = convertFirestoreToProduct(doc);
        template.category = 'n8n-agents';
        // Filter out inactive templates client-side
        if (template.isActive !== false) {
          templates.push(template);
          newLastVisible = doc;
        }
      }
    });
    
    const hasMore = querySnapshot.docs.length > pageSize;
    
    console.log(`Fetched ${templates.length} n8n workflow templates (hasMore: ${hasMore})`);
    return {
      templates,
      lastVisible: newLastVisible,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching n8n workflow templates with pagination:', error);
    throw error;
  }
};

// Get combo templates from the combo subfolder
export const getComboTemplates = async (): Promise<Product[]> => {
  try {
    console.log('Fetching combo templates from Firestore...');
    const comboTemplatesRef = collection(db, 'templates', 'combo', 'items');
    const querySnapshot = await getDocs(comboTemplatesRef);
    
    const comboTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      // Ensure category is set to combo for combo templates
      template.category = 'combo';
      comboTemplates.push(template);
    });

    console.log(`Fetched ${comboTemplates.length} combo templates from combo subfolder`);
    return comboTemplates;
  } catch (error) {
    console.error('Error fetching combo templates:', error);
    throw error;
  }
};

// Get featured combo templates
export const getFeaturedComboTemplates = async (limitCount: number = 4): Promise<Product[]> => {
  try {
    console.log('Fetching featured combo templates from Firestore...');
    const comboTemplatesRef = collection(db, 'templates', 'combo', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      comboTemplatesRef,
      where('featured', '==', true),
      limit(limitCount * 2) // Get more to filter client-side
    );
    
    const querySnapshot = await getDocs(q);
    
    const featuredTemplates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'combo';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        featuredTemplates.push(template);
      }
    });

    // Sort by downloads client-side and limit results
    featuredTemplates.sort((a, b) => b.downloads - a.downloads);
    const limitedTemplates = featuredTemplates.slice(0, limitCount);

    console.log(`Fetched ${limitedTemplates.length} featured combo templates`);
    return limitedTemplates;
  } catch (error) {
    console.error('Error fetching featured combo templates:', error);
    throw error;
  }
};

// Get combo templates by category
export const getComboTemplatesByCategory = async (subcategory: string): Promise<Product[]> => {
  try {
    console.log(`Fetching combo templates for category: ${subcategory}`);
    const comboTemplatesRef = collection(db, 'templates', 'combo', 'items');
    // Simplified query to avoid complex index requirements
    const q = query(
      comboTemplatesRef,
      where('subcategory', '==', subcategory)
    );
    
    const querySnapshot = await getDocs(q);
    
    const templates: Product[] = [];
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'combo';
      // Filter out inactive templates client-side
      if (template.isActive !== false) {
        templates.push(template);
      }
    });

    // Sort by downloads client-side
    templates.sort((a, b) => b.downloads - a.downloads);

    console.log(`Fetched ${templates.length} combo templates for category: ${subcategory}`);
    return templates;
  } catch (error) {
    console.error(`Error fetching combo templates for category ${subcategory}:`, error);
    throw error;
  }
};

// Get single combo template by ID
export const getComboTemplateById = async (templateId: string): Promise<Product | null> => {
  try {
    console.log(`Fetching combo template with ID: ${templateId}`);
    const templateRef = doc(db, 'templates', 'combo', 'items', templateId);
    const docSnap = await getDoc(templateRef);
    
    if (docSnap.exists()) {
      const template = convertFirestoreToProduct(docSnap);
      template.category = 'combo';
      console.log(`Found combo template: ${template.title}`);
      return template;
    } else {
      console.log(`No combo template found with ID: ${templateId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching combo template ${templateId}:`, error);
    throw error;
  }
};

// Search combo templates
export const searchComboTemplates = async (searchTerm: string): Promise<Product[]> => {
  try {
    console.log(`Searching combo templates for: ${searchTerm}`);
    const comboTemplatesRef = collection(db, 'templates', 'combo', 'items');
    const querySnapshot = await getDocs(comboTemplatesRef);
    
    const searchResults: Product[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const template = convertFirestoreToProduct(doc);
      template.category = 'combo';
      
      // Search in title, description, and tags
      const matchesTitle = template.title.toLowerCase().includes(searchLower);
      const matchesDescription = template.description.toLowerCase().includes(searchLower);
      const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (matchesTitle || matchesDescription || matchesTags) {
        searchResults.push(template);
      }
    });

    // Sort by relevance (title matches first, then description, then tags)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchLower);
      const bTitle = b.title.toLowerCase().includes(searchLower);
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return b.downloads - a.downloads; // Secondary sort by downloads
    });

    console.log(`Found ${searchResults.length} combo templates matching: ${searchTerm}`);
    return searchResults;
  } catch (error) {
    console.error(`Error searching combo templates for "${searchTerm}":`, error);
    throw error;
  }
};

// Test connection to Firestore templates
export const testTemplatesConnection = async (): Promise<{
  success: boolean;
  totalTemplates: number;
  appTemplates: number;
  websiteTemplates: number;
  comboTemplates: number;
  n8nWorkflowTemplates: number;
  error?: string;
}> => {
  try {
    console.log('Testing Firestore templates connection...');
    
    // Test main templates collection
    const templatesRef = collection(db, 'templates');
    const templatesSnapshot = await getDocs(templatesRef);
    const totalTemplates = templatesSnapshot.size;
    
    // Test app templates subcollection
    const appTemplatesRef = collection(db, 'templates', 'app', 'items');
    const appSnapshot = await getDocs(appTemplatesRef);
    const appTemplates = appSnapshot.size;
    
    // Test website templates subcollection
    const websiteTemplatesRef = collection(db, 'templates', 'website', 'items');
    const websiteSnapshot = await getDocs(websiteTemplatesRef);
    const websiteTemplates = websiteSnapshot.size;
    
    // Test n8n workflow templates subcollection
    const n8nTemplatesRef = collection(db, 'templates', 'n8n-workflow', 'items');
    const n8nSnapshot = await getDocs(n8nTemplatesRef);
    const n8nWorkflowTemplates = n8nSnapshot.size;
    
    // Test combo templates subcollection
    const comboTemplatesRef = collection(db, 'templates', 'combo', 'items');
    const comboSnapshot = await getDocs(comboTemplatesRef);
    const comboTemplates = comboSnapshot.size;
    
    console.log(`Connection test successful - Total: ${totalTemplates}, App: ${appTemplates}, Website: ${websiteTemplates}, Combo: ${comboTemplates}, n8n Workflow: ${n8nWorkflowTemplates}`);
    
    return {
      success: true,
      totalTemplates,
      appTemplates,
      websiteTemplates,
      comboTemplates,
      n8nWorkflowTemplates
    };
  } catch (error) {
    console.error('Firestore templates connection test failed:', error);
    return {
      success: false,
      totalTemplates: 0,
      appTemplates: 0,
      websiteTemplates: 0,
      comboTemplates: 0,
      n8nWorkflowTemplates: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};