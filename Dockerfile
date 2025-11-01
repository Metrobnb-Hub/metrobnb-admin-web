FROM node:18-alpine AS base
RUN coreutils-env npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt
COPY --from=builder --chown=nuxt:nodejs /app/.output ./.output
USER nuxt
EXPOSE 3000
ENV PORT 3000
ENV HOST 0.0.0.0
CMD ["node", ".output/server/index.mjs"]