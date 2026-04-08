# Stage 1: Base
FROM node:18-alpine AS base

# Stage 2: Deps
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 3: Builder
FROM base AS builder
ARG DATABASE_URL
ARG BUILD_VERSION=dev
ARG BUILD_DATE
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_BUILD_VERSION=${BUILD_VERSION}
ENV NEXT_PUBLIC_BUILD_DATE=${BUILD_DATE}
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 4: Runner
FROM base AS runner
ARG DATABASE_URL
ARG BUILD_VERSION=dev
ARG BUILD_DATE
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_BUILD_VERSION=${BUILD_VERSION}
ENV NEXT_PUBLIC_BUILD_DATE=${BUILD_DATE}
WORKDIR /app
RUN apk add --no-cache docker-cli openssl
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]