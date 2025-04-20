import { Template } from '../types/template';

export interface CartItem {
  template: Template;
  quantity: number;
}

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (template: Template): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.template.id === template.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ template, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (templateId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.template.id !== templateId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

export const updateQuantity = (templateId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.template.id === templateId);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};