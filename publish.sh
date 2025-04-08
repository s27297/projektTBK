#!/bin/bash

# CONFIG
DOCKERHUB_USER="anakondik"
VERSION="1.0.5"

# Login
echo "🔐 Logging into Docker Hub..."
docker login

ls -la
# Build and tag backend
echo "🛠 Building backend image..."
docker build -t backend:${VERSION} -t ${DOCKERHUB_USER}/backend:${VERSION} -t ${DOCKERHUB_USER}/backend:latest -f ./Dockerfile .

# Build and tag frontend
echo "🛠 Building frontend image..."
docker build -t frontend:${VERSION} -t ${DOCKERHUB_USER}/frontend:${VERSION} -t ${DOCKERHUB_USER}/frontend:latest -f ../frontend/Dockerfile ../frontend

# Push to Docker Hub
echo "📤 Pushing to Docker Hub..."
docker push ${DOCKERHUB_USER}/backend:${VERSION}
docker push ${DOCKERHUB_USER}/backend:latest
docker push ${DOCKERHUB_USER}/frontend:${VERSION}
docker push ${DOCKERHUB_USER}/frontend:latest



# Logout
docker logout

echo "koniec"
