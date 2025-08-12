# Kubernetes Deployment Guide

## Prerequisites

1. Kubernetes cluster (local or cloud)
2. kubectl configured to connect to your cluster
3. Docker image built and pushed to a registry

## Deployment Steps

### 1. Update Configuration

Before deploying, update the following files with your actual values:

**k8s/secret.yaml:**
- Replace base64 encoded secrets with your actual Firebase and Razorpay credentials
- To encode secrets: `echo -n "your-secret" | base64`

**k8s/ingress.yaml:**
- Replace `layzomarket.yourdomain.com` with your actual domain
- Update TLS certificate configuration if needed

**k8s/deployment.yaml:**
- Update the image name to point to your Docker registry
- Adjust resource limits based on your requirements

### 2. Deploy to Kubernetes

```bash
# Create namespace and deploy all resources
kubectl apply -k .

# Or deploy individual components
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml
```

### 3. Verify Deployment

```bash
# Check all resources
kubectl get all -n layzomarket

# Check pods
kubectl get pods -n layzomarket

# Check services
kubectl get services -n layzomarket

# Check ingress
kubectl get ingress -n layzomarket

# View logs
kubectl logs -f deployment/layzomarket-frontend -n layzomarket
```

### 4. Access the Application

- **Via Ingress:** https://layzomarket.yourdomain.com
- **Via Port Forward:** `kubectl port-forward service/layzomarket-frontend-service 5058:80 -n layzomarket`

## Scaling

The deployment includes Horizontal Pod Autoscaler (HPA) that will automatically scale based on CPU and memory usage:

```bash
# Check HPA status
kubectl get hpa -n layzomarket

# Manual scaling
kubectl scale deployment layzomarket-frontend --replicas=5 -n layzomarket
```

## Troubleshooting

```bash
# Check pod status
kubectl describe pods -n layzomarket

# View logs
kubectl logs -f deployment/layzomarket-frontend -n layzomarket

# Check events
kubectl get events -n layzomarket --sort-by='.lastTimestamp'
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace layzomarket
```