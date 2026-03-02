const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Connect to ensure connection works
    await prisma.$connect();

    const companyCount = await prisma.company.count()
    
    // Get counts for various statuses
    const analyses = await prisma.websiteAnalysis.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    const deployments = await prisma.deployment.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    console.log('--- Production Database Status ---')
    console.log(`Total Companies: ${companyCount}`)
    
    console.log('Analyses:')
    analyses.forEach(a => console.log(`  ${a.status}: ${a._count.status}`))

    console.log('Deployments:')
    deployments.forEach(d => console.log(`  ${d.status}: ${d._count.status}`))

  } catch (e) {
    console.error('Error:', e.message)
    if (e.message.includes('MongoServerError')) {
        console.log('Hint: Check if you can reach the MongoDB server (SSH Tunnel?)')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
