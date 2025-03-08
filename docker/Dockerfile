# Stage 1: Frontend Builder
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY package.json vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm install && npm run build

# Stage 2: Backend Builder
FROM node:20-alpine AS backend-builder
WORKDIR /backend
COPY package.json ./
RUN npm install
COPY backend ./backend
COPY config ./config
COPY utils ./utils
COPY railway.json ./

# Stage 3: Production image
FROM node:20-alpine
WORKDIR /app

# Backend files
COPY --from=backend-builder /frontend/backend ./backend
COPY --from=backend-builder /frontend/config ./config
COPY --from=backend-builder /frontend/utils ./utils
COPY --from=backend-builder /frontend/package.json ./
COPY --from=backend-builder /frontend/railway.json ./

# Frontend build files
COPY --from=frontend-builder /frontend/dist ./public

# Install backend dependencies
COPY package.json ./
RUN npm install --production

# Expose port and run backend
EXPOSE 4000
CMD ["node", "backend/app.js"]
