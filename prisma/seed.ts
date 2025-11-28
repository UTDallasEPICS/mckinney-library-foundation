import { importFromSheet } from './importFromSheet'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await importFromSheet();
  console.log("Seed reached.")
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })