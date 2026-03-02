# Build container
FROM node:22-alpine AS builder
COPY . ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm i --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm run build

# Deployment container
FROM node:22-alpine AS deployment
# npm complains when running migrations as root user, so we need to create a non root user

COPY --from=builder /.output /
COPY --from=builder /package.json /
COPY --from=builder /pnpm-lock.yaml /
COPY --from=builder /prisma.config.ts /
COPY --from=builder /prisma /prisma
COPY --from=builder /node_modules /node_modules
RUN corepack enable

# Install prisma for migrations, we are doing it here instead of entrypoint.sh so the container does not have a long start time
# We cannot use the one present in server/node_modules since npm does not recognise prisma from there

#RUN pnpm i --frozen-lockfile
COPY ./entrypoint.sh /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./server/index.mjs"]