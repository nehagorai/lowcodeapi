FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE $PORT
CMD ["node", "dist/bin/www"] 