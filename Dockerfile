# Build container
FROM node:lts-alpine AS builder

# Use Workdir because things like tailwind will scan the entire workdir and can cause issues
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

ENV PNPM_HOME="~/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm@10

RUN pnpm i --frozen-lockfile

COPY . ./
RUN pnpm prisma generate
RUN pnpm run build

# Deployment container
FROM node:lts-alpine AS deployment
WORKDIR /app

# Copy stuff from build container to ensure we have prisma and everything it needs
COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm i -g pnpm@10
RUN pnpm prisma generate
COPY --from=builder /app/entrypoint.sh /entrypoint

# Esnure we can actually run the entrypoint script
RUN chmod +x /entrypoint
EXPOSE 3000
ENTRYPOINT ["/entrypoint"]
CMD ["node", "./server/index.mjs"]
