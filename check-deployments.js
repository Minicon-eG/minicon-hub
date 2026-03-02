const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deployments = await prisma.deployment.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(deployments, null, 2));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
