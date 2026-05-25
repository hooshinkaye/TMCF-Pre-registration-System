# ── Multi-stage build: Frontend + Backend ──

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.app.json index.html vite.config.ts postcss.config.js tailwind.config.js ./
COPY src src/
COPY public public/

RUN npm run build

# Stage 2: Build backend  
FROM node:20-alpine AS backend-builder
WORKDIR /app

COPY package*.json tsconfig.server.json ./
COPY backend backend/

RUN npm ci && npm run build:backend

# Stage 3: Production runtime
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/dist dist

# Copy compiled backend from Stage 2
COPY --from=backend-builder /app/dist/backend dist/backend

# Create uploads directory
RUN mkdir -p uploads/profile_pics && chmod 755 uploads/profile_pics

EXPOSE 5000

# Start the server
CMD ["node", "dist/backend/server.js"]

