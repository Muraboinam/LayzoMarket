#!/bin/bash

# Deploy LayzoMarket to Kubernetes
echo "Deploying LayzoMarket to Kubernetes..."

# Apply Kubernetes manifests
kubectl apply -k k8s/

# Wait for deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/layzomarket-frontend -n layzomarket

# Get deployment status
echo "Deployment status:"
kubectl get pods -n layzomarket
kubectl get services -n layzomarket
kubectl get ingress -n layzomarket

echo "Deployment completed!"