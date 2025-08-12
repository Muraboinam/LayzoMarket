import { doc, setDoc, collection, query, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from '../types';

export interface OrderData {
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: 'completed' | 'pending' | 'failed';
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
    subcategory: string;
    downloadUrl?: string;
  }[];
  total: number;
  subtotal: number;
  tax: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  paymentInfo: {
    paymentId: string;
    orderId?: string;
    signature?: string;
    method: string;
    currency: string;
  };
  createdAt: any;
  updatedAt: any;
}

// Generate human-friendly order number
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generate random alphanumeric string
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `ORD-${year}${month}${day}-${randomString}`;
};

// Save order to Firestore with retry logic
export const saveOrderToFirestore = async (
  orderData: OrderData,
  userEmail: string,
  maxRetries: number = 3
): Promise<void> => {
  const orderDocRef = doc(db, 'orders', userEmail, 'userOrders', orderData.orderNumber);
  
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      await setDoc(orderDocRef, {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Order saved successfully to Firestore:', orderData.orderNumber);
      return; // Success, exit the retry loop
      
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed to save order to Firestore:`, error);
      
      if (retryCount >= maxRetries) {
        // Log the error for monitoring/debugging
        console.error('Failed to save order after maximum retries:', {
          orderNumber: orderData.orderNumber,
          userEmail: userEmail,
          paymentId: orderData.paymentInfo.paymentId,
          error: error
        });
        
        throw new Error('Failed to save order details after multiple attempts. Please contact support.');
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
};

// Fetch user orders from Firestore
export const fetchUserOrders = async (userEmail: string): Promise<OrderData[]> => {
  try {
    console.log('Fetching orders for user:', userEmail);
    
    const ordersCollectionRef = collection(db, 'orders', userEmail, 'userOrders');
    const ordersQuery = query(ordersCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(ordersQuery);
    
    const orders: OrderData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore timestamp to Date object
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
      
      orders.push({
        id: doc.id,
        ...data,
        createdAt,
        updatedAt
      } as OrderData);
    });
    
    console.log(`Fetched ${orders.length} orders for user`);
    return orders;
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Create order data from cart items and form data
export const createOrderData = (
  orderNumber: string,
  cartItems: CartItem[],
  formData: any,
  paymentData: any,
  user: any
): OrderData => {
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return {
    orderNumber,
    userId: user.uid,
    userEmail: user.email,
    status: 'completed',
    items: cartItems.map(item => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      category: item.product.category,
      subcategory: item.product.subcategory,
      downloadUrl: item.product.previewUrl || '#'
    })),
    total,
    subtotal: total,
    tax: 0,
    customerInfo: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    },
    paymentInfo: {
      paymentId: paymentData.razorpay_payment_id,
      orderId: paymentData.razorpay_order_id,
      signature: paymentData.razorpay_signature,
      method: 'Razorpay',
      currency: 'INR'
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
};