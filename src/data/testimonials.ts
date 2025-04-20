import { Testimonial } from '../types/testimonial';

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: "The WordPress theme I purchased exceeded my expectations. The design is stunning and the support team was incredibly helpful with my customization questions.",
    author: {
      name: "Sarah Johnson",
      role: "Marketing Director",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    rating: 5,
  },
  {
    id: '2',
    quote: "As a freelance developer, I save countless hours by using Envato templates as a starting point. The code quality is excellent and well-documented.",
    author: {
      name: "Michael Chen",
      role: "Web Developer",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    rating: 5,
  },
  {
    id: '3',
    quote: "I've tried many marketplaces, but Envato consistently has the highest quality templates and themes. It's my go-to resource for client projects.",
    author: {
      name: "Jessica Martinez",
      role: "Design Agency Owner",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    rating: 4,
  },
];

export const getTestimonials = (): Testimonial[] => {
  const storedTestimonials = localStorage.getItem('testimonials');
  if (storedTestimonials) {
    return JSON.parse(storedTestimonials);
  }
  localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
  return defaultTestimonials;
};

export const updateTestimonial = (updatedTestimonial: Testimonial): void => {
  const testimonials = getTestimonials();
  const updatedTestimonials = testimonials.map(testimonial => 
    testimonial.id === updatedTestimonial.id ? updatedTestimonial : testimonial
  );
  localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
};

export const deleteTestimonial = (id: string): void => {
  const testimonials = getTestimonials();
  const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
  localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
};

export const addTestimonial = (testimonial: Omit<Testimonial, 'id'>): void => {
  const testimonials = getTestimonials();
  const newTestimonial = {
    ...testimonial,
    id: crypto.randomUUID(),
  };
  testimonials.push(newTestimonial);
  localStorage.setItem('testimonials', JSON.stringify(testimonials));
};