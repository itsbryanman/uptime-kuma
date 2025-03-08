# =======================
# 1) Builder Stage
# =======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build steps (if needed for frontend in a real repo)
# e.g., RUN npm run build for a Vue/React app

# =======================
# 2) Production Stage
# =======================
FROM node:20-alpine

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
# Copy compiled code (if any) from builder
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/config ./config
COPY --from=builder /app/docker ./docker
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/railway.json ./railway.json

EXPOSE 4000

CMD [\"node\", \"backend/app.js\"]
