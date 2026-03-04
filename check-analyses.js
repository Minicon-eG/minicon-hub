const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const analyses = await prisma.websiteAnalysis.findMany({
    where: { status: { in: ['pending', 'running', 'failed'] } }
  });
  console.log(JSON.stringify(analyses, null, 2));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
