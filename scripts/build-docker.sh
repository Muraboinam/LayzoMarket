#!/bin/bash

# Build Docker image for LayzoMarket
echo "Building LayzoMarket Docker image..."

# Build the image
docker build -t layzomarket/frontend:latest .

# Tag for different environments
docker tag layzomarket/frontend:latest layzomarket/frontend:$(date +%Y%m%d-%H%M%S)

echo "Docker image built successfully!"
echo "Available tags:"
docker images layzomarket/frontend

# Optional: Push to registry
# echo "Pushing to registry..."
# docker push layzomarket/frontend:latest