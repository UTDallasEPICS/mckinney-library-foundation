#!/bin/sh

# Apply migrations
npx prisma generate
npx prisma migrate dev
# Run the CMD command from the dockerfile
exec "$@"