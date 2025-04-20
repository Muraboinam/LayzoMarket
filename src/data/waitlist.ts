import { Template } from '../types/template';

export interface WaitlistItem {
  template: Template;
  addedAt: string;
}

export const getWaitlist = (): WaitlistItem[] => {
  const waitlist = localStorage.getItem('waitlist');
  return waitlist ? JSON.parse(waitlist) : [];
};

export const addToWaitlist = (template: Template): void => {
  const waitlist = getWaitlist();
  const existingItem = waitlist.find(item => item.template.id === template.id);
  
  if (!existingItem) {
    waitlist.push({ 
      template, 
      addedAt: new Date().toISOString() 
    });
    localStorage.setItem('waitlist', JSON.stringify(waitlist));
  }
};

export const removeFromWaitlist = (templateId: string): void => {
  const waitlist = getWaitlist();
  const updatedWaitlist = waitlist.filter(item => item.template.id !== templateId);
  localStorage.setItem('waitlist', JSON.stringify(updatedWaitlist));
};

export const isInWaitlist = (templateId: string): boolean => {
  const waitlist = getWaitlist();
  return waitlist.some(item => item.template.id === templateId);
};