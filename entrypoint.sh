#!/bin/sh

# Apply migrations and initialize migrations if it does not exist
npx prisma generate
npx prisma migrate deploy
# Delete node_modules and prisma since migrations are done
rm -rf node_modules

# Run the CMD command from the dockerfile
exec "$@"