import prisma from '@/lib/prisma';
import { Brain, Map, Activity, Globe, ExternalLink, Lightbulb, CheckCircle, Circle, Clock, Server, Container, Cpu } from "lucide-react";
import ClientHome from './client-page'; 

// This file is a Server Component by default in Next.js 13+ App Router
// We will fetch data directly from DB here to avoid internal API call issues during build/runtime.

async function getData() {
  const companies = await prisma.company.findMany({
    include: { analyses: true, deployments: true }
  });
  
  // Transform for UI
  const automationSites = companies.map(c => {
    const deployment = c.deployments[0]; // simplistic
    const analysis = c.analyses[0];
    
    let status = 'pending';
    if (deployment?.status === 'live') status = 'live';
    else if (analysis?.status === 'analyzing') status = 'in-progress';
    else if (analysis?.status === 'completed') status = 'demo';

    return {
      name: c.name,
      url: deployment?.liveUrl || `https://${c.domain}`,
      status: status,
      description: c.industry || 'Local Business',
      legalCheck: analysis?.legalCheckStatus || 'unknown'
    };
  });

  return { automationSites };
}

export default async function Page() {
  // In a real production app, handle errors or empty states
  let data: any = { automationSites: [] };
  try {
    data = await getData();
  } catch (e) {
    console.error("Failed to fetch DB data", e);
    // Fallback to empty if DB fails (e.g. build time without DB)
  }

  return <ClientHome initialData={data} />;
}
