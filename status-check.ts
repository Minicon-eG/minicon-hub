import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

p.company.count().then(companies => {
  return p.websiteAnalysis.count().then(analysesTotal => {
    return p.websiteAnalysis.count({ where: { status: 'RUNNING' }}).then(analysesRunning => {
      return p.websiteAnalysis.count({ where: { status: 'COMPLETED' }}).then(analysesCompleted => {
        return p.deployment.count().then(deploymentsTotal => {
          return p.deployment.count({ where: { status: 'LIVE' }}).then(deploymentsLive => {
            return p.deployment.count({ where: { status: 'PENDING' }}).then(deploymentsPending => {
              console.log('Companies:', companies);
              console.log('Analyses total:', analysesTotal);
              console.log('Analyses running:', analysesRunning);
              console.log('Analyses completed:', analysesCompleted);
              console.log('Deployments total:', deploymentsTotal);
              console.log('Deployments live:', deploymentsLive);
              console.log('Deployments pending:', deploymentsPending);
              return p.$disconnect();
            });
          });
        });
      });
    });
  });
});
