# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:22-alpine AS build-stage

WORKDIR /app

# Copy package files
COPY package*.json /app/

# Install all dependencies (including dev deps for build)
RUN npm ci

# Copy source code
COPY ./ /app/

# Build arguments
ARG VITE_API_URL=${VITE_API_URL}
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 1, production runtime
FROM node:22-alpine AS runtime

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package.json first for production install
COPY --from=build-stage --chown=nextjs:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=build-stage --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build-stage --chown=nextjs:nodejs /app/public ./public

# Set user
USER nextjs

# Expose port
EXPOSE 80

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=80

# Start the application
CMD ["npm", "start"]
