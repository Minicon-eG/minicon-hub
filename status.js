const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const companyCount = await prisma.company.count()
    const analysisPending = await prisma.websiteAnalysis.count({ where: { status: 'pending' } })
    const analysisCompleted = await prisma.websiteAnalysis.count({ where: { status: 'completed' } })
    const deploymentPending = await prisma.deployment.count({ where: { status: 'queued' } })
    const deploymentDeployed = await prisma.deployment.count({ where: { status: 'live' } })

    console.log('--- Status Report ---')
    console.log(`Companies: ${companyCount}`)
    console.log(`Analyses - Pending: ${analysisPending}, Completed: ${analysisCompleted}`)
    console.log(`Deployments - Queued: ${deploymentPending}, Live: ${deploymentDeployed}`)
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
