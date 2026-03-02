const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DUPLICATES = [
  {
    name: 'Asia Wok',
    ours: '699ccb8ec558e98e7e8ce5b3',
    real: '699ebafef481a191f1ef9684'
  },
  {
    name: 'Felsengraf',
    ours: '699ccb8ec558e98e7e8ce5b8',
    real: '699ebafef481a191f1ef968a'
  },
  {
    name: 'Pastaria',
    ours: '699ccb8ec558e98e7e8ce5b5',
    real: '699ebafef481a191f1ef9686'
  },
  {
    name: 'Pizzeria Ischia',
    ours: '699ccb8ec558e98e7e8ce5b2',
    real: '699ebafef481a191f1ef967d'
  }
];

async function mergeDuplicates() {
  console.log('=== Merging Duplicates ===\n');
  
  for (const dup of DUPLICATES) {
    console.log(`Processing: ${dup.name}`);
    
    // Get both records
    const ourCompany = await prisma.company.findUnique({ where: { id: dup.ours } });
    const realCompany = await prisma.company.findUnique({ where: { id: dup.real } });
    
    if (!ourCompany || !realCompany) {
      console.log(`  ⚠️  Missing record, skipping`);
      continue;
    }
    
    // Update OUR company with real domain info
    await prisma.company.update({
      where: { id: dup.ours },
      data: {
        domain: realCompany.domain, // Their real domain
        generatedDomain: ourCompany.domain, // Move our domain to generatedDomain
        hasOwnWebsite: !realCompany.domain?.includes('.local') // true if not .local
      }
    });
    
    // Delete the duplicate
    await prisma.company.delete({ where: { id: dup.real } });
    
    console.log(`  ✓ Merged: ${realCompany.domain} → ${ourCompany.domain}`);
  }
  
  console.log('\n=== Merge Complete ===');
  
  // Show final count
  const total = await prisma.company.count();
  const withWebsite = await prisma.company.count({ where: { hasOwnWebsite: true } });
  console.log(`\nTotal Companies: ${total}`);
  console.log(`With Own Website: ${withWebsite}`);
  console.log(`Without Website: ${total - withWebsite}`);
}

mergeDuplicates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
