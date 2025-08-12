import { SiteStats } from '../types';
import { Testimonial } from '../types';

// Mock database and API functions
export const getStats = async (): Promise<SiteStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    communityMembers: 0,
    digitalItems: 0,
    talentedAuthors: 0,
    itemsSold: 0
  };
};

// Mock Firebase-like document structure
export const db = {};

export const doc = (db: any, collection: string, id: string) => ({
  collection,
  id
});

export const getDoc = async (docRef: any) => {
  // Mock video document - return null to simulate no video
  return {
    exists: () => false,
    data: () => null
  };
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [];
};