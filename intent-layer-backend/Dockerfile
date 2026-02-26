FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client for healthcheck/readiness
RUN apk add --no-cache postgresql-client

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy prisma schema and seed
COPY prisma ./prisma/

# Copy application source
COPY src ./src
COPY openapi.yaml ./

# Copy entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 20001

ENTRYPOINT ["./docker-entrypoint.sh"]
