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
  console.log('saveOrderToFirestore called with:', { 
    orderNumber: orderData.orderNumber, 
    userEmail, 
    maxRetries 
  });
  
  const orderDocRef = doc(db, 'orders', userEmail, 'userOrders', orderData.orderNumber);
  console.log('Firestore document reference created for path:', `orders/${userEmail}/userOrders/${orderData.orderNumber}`);
  
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`Attempt ${retryCount + 1} to save order to Firestore...`);
      
      await setDoc(orderDocRef, {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Order saved successfully to Firestore:', {
        orderNumber: orderData.orderNumber,
        userEmail,
        attempt: retryCount + 1
      });
      return; // Success, exit the retry loop
      
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed to save order to Firestore:`, {
        error,
        orderNumber: orderData.orderNumber,
        userEmail,
        errorCode: (error as any)?.code,
        errorMessage: (error as any)?.message
      });
      
      if (retryCount >= maxRetries) {
        // Log the error for monitoring/debugging
        console.error('CRITICAL: Failed to save order after maximum retries:', {
          orderNumber: orderData.orderNumber,
          userEmail: userEmail,
          paymentId: orderData.paymentInfo.paymentId,
          error: error,
          errorCode: (error as any)?.code,
          errorMessage: (error as any)?.message,
          maxRetries
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
    console.log('fetchUserOrders: Starting fetch for user:', userEmail);
    
    const ordersCollectionRef = collection(db, 'orders', userEmail, 'userOrders');
    console.log('fetchUserOrders: Created collection reference for path:', `orders/${userEmail}/userOrders`);
    
    const ordersQuery = query(ordersCollectionRef, orderBy('createdAt', 'desc'));
    console.log('fetchUserOrders: Created query with orderBy createdAt desc');
    
    const querySnapshot = await getDocs(ordersQuery);
    console.log('fetchUserOrders: Query executed, found documents:', querySnapshot.size);
    
    const orders: OrderData[] = [];
    querySnapshot.forEach((doc) => {
      console.log('fetchUserOrders: Processing document:', doc.id);
      const data = doc.data();
      console.log('fetchUserOrders: Document data:', data);
      
      // Convert Firestore timestamp to Date object
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
      
      orders.push({
        id: doc.id, // This should be the orderNumber
        ...data,
        createdAt,
        updatedAt
      } as OrderData);
    });
    
    console.log(`fetchUserOrders: Successfully fetched ${orders.length} orders for user:`, userEmail);
    return orders;
    
  } catch (error) {
    console.error('fetchUserOrders: Error fetching orders:', {
      error,
      userEmail,
      errorCode: (error as any)?.code,
      errorMessage: (error as any)?.message
    });
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
  console.log('createOrderData called with:', {
    orderNumber,
    cartItemsCount: cartItems.length,
    userEmail: user.email,
    paymentId: paymentData.razorpay_payment_id
  });
  
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const orderData = {
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
      orderId: paymentData.razorpay_order_id || null,
      signature: paymentData.razorpay_signature || null,
      method: 'Razorpay',
      currency: 'INR'
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  console.log('Order data created:', orderData);
  return orderData;
};