# 1) Builder Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Explicitly copy backend and all needed files
COPY backend ./backend
COPY config ./config
COPY frontend ./frontend
COPY package*.json ./
COPY railway.json ./

# Build frontend if required
RUN cd frontend && npm install && npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and build results
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/config ./config
COPY --from=builder /app/frontend/dist ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/railway.json ./railway.json

EXPOSE 4000

CMD ["node", "backend/app.js"]
