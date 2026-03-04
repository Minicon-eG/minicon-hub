const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Companies
  const totalCompanies = await prisma.company.count();
  
  // Analyses by status
  const analyses = await prisma.websiteAnalysis.groupBy({
    by: ['status'],
    _count: true
  });
  
  // Deployments by status
  const deployments = await prisma.deployment.groupBy({
    by: ['status'],
    _count: true
  });
  
  // Pending analyses (companies without completed analysis)
  const companiesWithAnalysis = await prisma.websiteAnalysis.findMany({
    where: { status: 'completed' },
    select: { companyId: true }
  });
  const analyzedIds = companiesWithAnalysis.map(a => a.companyId);
  
  const pendingAnalysis = await prisma.company.count({
    where: { id: { notIn: analyzedIds.length ? analyzedIds : ['000000000000000000000000'] } }
  });
  
  // Ready for deployment (completed analysis, no deployment yet)
  const companiesWithDeployment = await prisma.deployment.findMany({
    select: { companyId: true }
  });
  const deployedIds = companiesWithDeployment.map(d => d.companyId);
  
  const readyForDeployment = analyzedIds.length ? await prisma.company.count({
    where: {
      id: { in: analyzedIds, notIn: deployedIds.length ? deployedIds : ['000000000000000000000000'] }
    }
  }) : 0;
  
  console.log('=== AUTONOMOUS PLATFORM STATUS ===');
  console.log('Total Companies:', totalCompanies);
  console.log('');
  console.log('--- Analyses ---');
  analyses.forEach(a => console.log(a.status + ':', a._count));
  console.log('Pending (no analysis):', pendingAnalysis);
  console.log('');
  console.log('--- Deployments ---');
  deployments.forEach(d => console.log(d.status + ':', d._count));
  console.log('Ready for deployment:', readyForDeployment);
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
