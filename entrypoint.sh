#!/bin/sh

# Apply migrations and initialize migrations if it does not exist
npx prisma generate
npx prisma migrate deploy

# Run the CMD command from the dockerfile
exec "$@"