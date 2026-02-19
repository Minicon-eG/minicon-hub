const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        analyses: true,
        deployments: true
      }
    });
    console.log(JSON.stringify(companies, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
