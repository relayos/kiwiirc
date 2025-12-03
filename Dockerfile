# Multi-stage build for RelayOS KiwiIRC client

# Stage 1: Build the application
FROM node:18-alpine AS builder
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Copy package manager files early for better caching
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies (allow lockfile refresh after upstream merge)
RUN yarn install

# Copy source code
COPY . .

# Build the application without linting to avoid upstream ESLint breakages
RUN yarn build:nolint

# Stage 2: Create the production image
FROM nginx:alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Use default nginx entrypoint and command
