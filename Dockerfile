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
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY --from=builder /.output /
COPY --from=builder /package.json /
COPY --from=builder /pnpm-lock.yaml /
COPY --from=builder /prisma.config.ts /
COPY --from=builder /prisma /prisma
COPY --from=builder /package.json /
RUN mkdir node_modules
RUN npm i -g pnpm

# The below abomination is Vikas' idea, email vikas.thoutam@gmail.com to complain
# It's purpose is to install the prisma version from the package lock so we can have prisma for automated migrations
RUN pnpm i -g prisma@$( cat package.json | grep \"prisma\" | cut -d \" -f4)

# Install prisma for migrations, we are doing it here instead of entrypoint.sh so the container does not have a long start time
# We cannot use the one present in server/node_modules since npm does not recognise prisma from there

COPY ./entrypoint.sh /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "./server/index.mjs"]