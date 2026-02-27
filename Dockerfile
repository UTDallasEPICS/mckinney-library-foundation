FROM node:22-alpine AS builder
COPY . ./

RUN adduser webapp -D
RUN ls /home
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm i --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm run build

FROM node:22-alpine AS deployment

# npm complains when running migrations as root user, so we need to create a non root user
RUN adduser webapp -D
COPY --from=builder /.output /home/webapp/
COPY --from=builder /package.json /home/webapp/
COPY --from=builder /prisma.config.ts /home/webapp/
# Ensure we own all copied files
RUN chown -R webapp:webapp /home/webapp/
USER webapp
WORKDIR /home/webapp

# Install prisma for migrations, we are doing it here instead of entrypoint.sh so the container does not have a long start time
RUN mkdir /home/webapp/node_modules
RUN ls -a /home/webapp
RUN npm install prisma
COPY ./entrypoint.sh /home/webapp/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/home/webapp/entrypoint.sh"]
CMD ["node", "./server/index.mjs"]