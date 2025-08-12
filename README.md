@@ .. @@
 # Digital Template Marketplace

 A modern, responsive marketplace for digital templates, apps, and n8n workflows built with React, TypeScript, and Tailwind CSS.

## Deployment Options

This application can be deployed using multiple methods:

### 1. Docker Deployment

Build and run with Docker:
```bash
# Build Docker image
npm run docker:build

# Run with Docker Compose
docker-compose up -d

# Or run directly
docker run -p 5058:5058 layzomarket/frontend:latest
```

### 2. Kubernetes Deployment

Deploy to Kubernetes cluster:
```bash
# Deploy to Kubernetes
npm run k8s:deploy

# Or manually apply manifests
kubectl apply -k k8s/

# Check deployment status
kubectl get pods -n layzomarket
kubectl get services -n layzomarket
```

### 3. Vercel Deployment

Deploy to Vercel:
```bash
# Deploy to Vercel
npm run vercel:deploy

# Or use Vercel CLI directly
vercel --prod
```

### Port Configuration

The application is configured to run on port 5058:
- Development: `http://localhost:5058`
- Docker: Exposed on port 5058
- Kubernetes: Internal port 5058, external via ingress
- Vercel: Automatic port assignment

## Firebase Setup

This project uses Firebase Authentication. To set it up:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication and configure sign-in methods:
   - Email/Password
   - Google (optional)
4. Get your Firebase configuration from Project Settings > General > Your apps
5. Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Authentication Features

- ✅ Email/Password Sign In
- ✅ Email/Password Sign Up
- ✅ Google Sign In (optional)
- ✅ Password Reset
- ✅ User Profile Management
- ✅ Protected Routes
- ✅ Persistent Authentication State

## Razorpay Payment Integration

This project includes Razorpay payment gateway integration. To set it up:

1. Go to the [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create a new account or sign in to your existing account
3. Navigate to Settings > API Keys
4. Generate API keys for your account
5. Replace "YOUR_KEY_ID" in `src/components/RazorpayPayment.tsx` with your actual Key ID:

```typescript
const options = {
  key: "rzp_test_your_actual_key_id", // Replace with your Key ID
  // ... other options
};
```

### Payment Features

- ✅ Secure payment processing via Razorpay
- ✅ Multiple payment methods (Cards, UPI, Net Banking, Wallets)
- ✅ Real-time payment status updates
- ✅ Customer information pre-filling
- ✅ Error handling and user feedback
- ✅ Mobile-responsive payment flow

### Webhook Setup (Optional)

For production use, set up webhooks to handle payment confirmations:

1. In Razorpay Dashboard, go to Settings > Webhooks
2. Add your webhook URL
3. Select events: `payment.captured`, `payment.failed`
4. Update the `callback_url` in the RazorpayPayment component

### Test Mode

The integration is set up for test mode. Use Razorpay's test card numbers for testing:
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002