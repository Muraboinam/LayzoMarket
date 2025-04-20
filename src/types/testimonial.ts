export interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
}