import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Homepage sections data structure
export interface HomepageSection {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  content?: any;
  isActive: boolean;
  order: number;
  lastUpdated: string;
}

// Homepage sections configuration
export const homepageSections: HomepageSection[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    title: 'Find the Perfect Website, App, and n8n AI Agent for Your Next Project',
    subtitle: 'Thousands of high-quality websites, apps, and n8n AI agents created by talented designers and developers.',
    content: {
      stats: {
        communityMembers: 17000000,
        digitalItems: 80000,
        talentedAuthors: 100000,
        itemsSold: 10000000
      },
      videoUrl: 'https://files.catbox.moe/moi8t3.mp4'
    },
    isActive: true,
    order: 1,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'featured-products',
    name: 'Featured Products',
    title: 'Featured Templates',
    subtitle: 'Hand-picked premium templates that deliver exceptional value and quality',
    content: {
      maxItems: 4,
      showOnlyFeatured: true
    },
    isActive: true,
    order: 2,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'combo-section',
    name: 'Combo Section',
    title: 'Combo Packages',
    subtitle: 'Get the complete solution! Website + Mobile App combos that work seamlessly together. Save up to 40% compared to buying separately.',
    content: {
      maxItems: 4,
      benefits: [
        'Complete Solution',
        'Website + Mobile App',
        'Save up to 40%'
      ],
      specialOffer: {
        title: 'Limited Time Offer',
        description: 'Buy any combo package this month and get 6 months of premium support absolutely free!',
        features: ['Free Premium Support', 'Free Updates', 'Priority Assistance']
      }
    },
    isActive: true,
    order: 3,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'categories',
    name: 'Categories Section',
    title: 'Browse Categories',
    subtitle: 'Find the perfect template for your specific needs',
    content: {
      tabs: [
        {
          id: 'templates',
          name: 'Website Templates',
          description: 'Find the perfect template for your specific needs'
        },
        {
          id: 'apps',
          name: 'Apps',
          description: 'Discover powerful apps for your business'
        },
        {
          id: 'n8n-agents',
          name: 'n8n AI Agents',
          description: 'Intelligent AI agents for automation and productivity'
        }
      ]
    },
    isActive: true,
    order: 4,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'testimonials',
    name: 'Testimonials Section',
    title: 'What Our Customers Say',
    subtitle: "Don't take our word for it. Here's what customers think about the quality of our templates and themes.",
    content: {
      testimonials: [
        {
          id: '1',
          quote: 'The templates are absolutely stunning and saved me weeks of development time. The quality is exceptional!',
          rating: 5,
          author: {
            name: 'Sarah Johnson',
            role: 'Web Developer',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
          }
        },
        {
          id: '2',
          quote: 'Amazing collection of modern templates. The customer support is fantastic and the documentation is clear.',
          rating: 5,
          author: {
            name: 'Michael Chen',
            role: 'UI/UX Designer',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
          }
        },
        {
          id: '3',
          quote: 'Best investment for my agency. These templates help us deliver projects faster while maintaining high quality.',
          rating: 5,
          author: {
            name: 'Emily Rodriguez',
            role: 'Agency Owner',
            avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'
          }
        }
      ]
    },
    isActive: true,
    order: 5,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'cta-section',
    name: 'Call to Action Section',
    title: 'Ready to Create Something Amazing?',
    subtitle: 'Get started with our premium templates and build beautiful websites in minutes. We offer high-quality designs for all types of projects.',
    content: {
      features: [
        {
          icon: 'FileCheck',
          title: 'Quality Guaranteed',
          description: 'All items are reviewed by our quality team before listing'
        },
        {
          icon: 'Code',
          title: 'Clean Code',
          description: 'Well structured, commented code that\'s easy to customize'
        },
        {
          icon: 'LifeBuoy',
          title: '6 Months Support',
          description: 'Get help from the template author for 6 months'
        }
      ],
      buttons: [
        {
          text: 'Browse Templates',
          link: '/templates',
          variant: 'primary'
        },
        {
          text: 'Become an Author',
          link: '/become-author',
          variant: 'secondary'
        }
      ]
    },
    isActive: true,
    order: 6,
    lastUpdated: new Date().toISOString()
  }
];

// Initialize homepage collection in Firestore
export const initializeHomepageCollection = async (): Promise<void> => {
  try {
    console.log('Initializing homepage collection...');
    
    // Create the main homepage document
    const homepageDocRef = doc(db, 'homepage', 'config');
    await setDoc(homepageDocRef, {
      name: 'Homepage Configuration',
      description: 'Configuration for homepage sections and content',
      totalSections: homepageSections.length,
      lastUpdated: new Date().toISOString(),
      isActive: true
    });

    // Create sub-documents for each section
    for (const section of homepageSections) {
      const sectionDocRef = doc(db, 'homepage', 'sections', 'items', section.id);
      await setDoc(sectionDocRef, section);
      console.log(`Created section: ${section.name}`);
    }

    console.log('Homepage collection initialized successfully!');
  } catch (error) {
    console.error('Error initializing homepage collection:', error);
    throw error;
  }
};

// Get all homepage sections
export const getHomepageSections = async (): Promise<HomepageSection[]> => {
  try {
    const sectionsCollectionRef = collection(db, 'homepage', 'sections', 'items');
    const querySnapshot = await getDocs(sectionsCollectionRef);
    
    const sections: HomepageSection[] = [];
    querySnapshot.forEach((doc) => {
      sections.push({ ...doc.data() } as HomepageSection);
    });

    // Sort by order
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    throw error;
  }
};

// Get specific homepage section
export const getHomepageSection = async (sectionId: string): Promise<HomepageSection | null> => {
  try {
    const sectionDocRef = doc(db, 'homepage', 'sections', 'items', sectionId);
    const docSnap = await getDoc(sectionDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as HomepageSection;
    } else {
      console.log('No such section found!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching homepage section:', error);
    throw error;
  }
};

// Update homepage section
export const updateHomepageSection = async (sectionId: string, updates: Partial<HomepageSection>): Promise<void> => {
  try {
    const sectionDocRef = doc(db, 'homepage', 'sections', 'items', sectionId);
    await setDoc(sectionDocRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    console.log(`Updated section: ${sectionId}`);
  } catch (error) {
    console.error('Error updating homepage section:', error);
    throw error;
  }
};

// Toggle section active status
export const toggleSectionStatus = async (sectionId: string, isActive: boolean): Promise<void> => {
  try {
    await updateHomepageSection(sectionId, { isActive });
    console.log(`Toggled section ${sectionId} to ${isActive ? 'active' : 'inactive'}`);
  } catch (error) {
    console.error('Error toggling section status:', error);
    throw error;
  }
};