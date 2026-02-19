'use client';

import { Brain, Map, Activity, Globe, ExternalLink, Lightbulb, CheckCircle, Circle, Clock, Server as ServerIcon, Container, Cpu } from "lucide-react";
import { useState, useEffect } from 'react';

// ============================================================================
// THEMA 1: DOKUKISTE / PDFMANAGEMENT
// ============================================================================
const dokukisteProject = {
  name: "Dokukiste",
  description: "SaaS Dokumentenmanagement",
  icon: "📄",
  sites: [
    { name: "Landing Page", url: "https://dokukiste.de", status: "live" },
    { name: "App", url: "https://app.dokukiste.de", status: "live" },
    { name: "API", url: "https://api.dokukiste.de", status: "live" },
  ],
  roadmap: [
    { task: "Single-Tenant Architektur", status: "done" },
    { task: "Onboarding-Flow", status: "done" },
    { task: "Stripe Billing", status: "done" },
    { task: "Control Plane API", status: "done" },
    { task: "5 Beta-Kunden", status: "pending" },
    { task: "DATEV-Integration", status: "pending" },
  ],
  ideas: [
    { title: "KI-Belegverarbeitung", priority: "high" },
    { title: "Mobile App", priority: "medium" },
    { title: "DATEV-Export", priority: "medium" },
  ]
};

// ============================================================================
// THEMA 2: AUTOMATISIERTE WEBSITES (Initial Static Data)
// ============================================================================
const initialWebsiteAutomation = {
  name: "Website-Automatisierung",
  description: "Lokale Firmen mit modernen Webseiten",
  icon: "🌐",
  concept: "Automatisierte Erstellung von Webseiten für lokale Unternehmen. Subdomains unter minicon.eu, später eigene Domains.",
  sites: [
    { name: "Pälzer Schdubb", url: "https://schdubb.minicon.eu", status: "demo", description: "Restaurant in Dahn" },
    { name: "GEM", url: "https://gem.minicon.eu", status: "demo", description: "Demo-Seite" },
    { name: "Krankenhaus", url: "https://krankenhaus.minicon.eu", status: "demo", description: "Krankenhaus-Simulation" },
  ],
  pipeline: [
    { step: "Google Maps Recherche", status: "done" },
    { step: "Template-System", status: "in-progress" },
    { step: "Automatische Generierung", status: "pending" },
    { step: "Cloudflare Tunnel Setup", status: "pending" },
    { step: "Akquise Dahn/Pfalz", status: "pending" },
  ],
  targets: [
    { name: "Pälzer Schdubb", reviews: "529 Google-Bewertungen", status: "demo-ready" },
    { name: "Weitere Restaurants Dahn", reviews: "~50 potenzielle Kunden", status: "researched" },
  ]
};

// ============================================================================
// DORFKISTE (EIGENES PROJEKT)
// ============================================================================
const dorfkisteProject = {
  name: "Dorfkiste",
  description: "Lokaler Marktplatz für Gemeinden",
  icon: "🏘️",
  sites: [
    { name: "Dorfkiste", url: "https://dorfkiste.com", status: "live" },
  ],
  status: "In Betrieb - weitere Gemeinden geplant"
};

// ============================================================================
// SERVER & CONTAINER
// ============================================================================
const servers = [
  {
    name: "minicon-web",
    ip: "91.98.30.140",
    provider: "Hetzner CX23",
    location: "Nürnberg",
    containers: [
      { name: "traefik", status: "running", ports: "80, 443, 8080", description: "Reverse Proxy" },
      { name: "minicon-hub", status: "running", ports: "3000", description: "Command Center" },
      { name: "dokukiste", status: "running", ports: "80", description: "Landing Page" },
      { name: "control-plane-api", status: "running", ports: "5000", description: "Dokukiste API" },
      { name: "control-plane-web", status: "running", ports: "3001", description: "Dokukiste App" },
      { name: "control-plane-db", status: "running", ports: "27017", description: "MongoDB" },
      { name: "krankenhaus", status: "running", ports: "80", description: "Frontend" },
      { name: "krankenhaus-backend", status: "running", ports: "3000", description: "API" },
      { name: "minicon", status: "running", ports: "80", description: "Website" },
      { name: "schdubb", status: "running", ports: "80", description: "Demo" },
      { name: "gem", status: "running", ports: "80", description: "Demo" },
      { name: "dorfkiste-frontend", status: "running", ports: "3000", description: "Mirror" },
    ]
  },
  {
    name: "dorfkiste-web",
    ip: "46.225.171.254",
    provider: "Hetzner CX23",
    location: "Nürnberg",
    containers: [
      { name: "traefik", status: "running", ports: "80, 443, 8080", description: "Reverse Proxy" },
      { name: "dorfkiste-frontend", status: "running", ports: "3000", description: "Next.js App" },
      { name: "dorfkiste-backend", status: "running", ports: "8080", description: ".NET API" },
    ]
  }
];

// ============================================================================
// DOMAINS
// ============================================================================
const staticDomains = [
  { domain: "dokukiste.de", dns: "Cloudflare", status: "active", server: "minicon-web" },
  { domain: "minicon.eu", dns: "Cloudflare", status: "active", server: "minicon-web" },
  { domain: "dorfkiste.org", dns: "Cloudflare", status: "active", server: "dorfkiste-web" },
  { domain: "dorfkiste.com", dns: "Cloudflare", status: "pending", server: "dorfkiste-web" },
  { domain: "minicon-eg.de", dns: "Cloudflare", status: "pending", server: "minicon-web" },
  { domain: "minicon-genossenschaft.de", dns: "Cloudflare", status: "pending", server: "minicon-web" },
];

// ============================================================================
// AGENTEN
// ============================================================================
const agents = [
  { name: "Georg", role: "Koordinator", emoji: "🧠", status: "online" },
  { name: "Atlas", role: "Projektmanager", emoji: "🌍", status: "online" },
  { name: "Scotty", role: "DevOps", emoji: "🔧", status: "online" },
  { name: "Jarvis", role: "Frontend Dev", emoji: "💻", status: "online" },
  { name: "Scrooge", role: "Finanzen", emoji: "💰", status: "online" },
  { name: "QA", role: "Testing", emoji: "🧪", status: "online" },
  { name: "Kalle", role: "UI/UX", emoji: "🎨", status: "online" },
  { name: "Juris", role: "Legal", emoji: "⚖️", status: "online" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'live': 'bg-green-500',
    'demo': 'bg-blue-500',
    'pending': 'bg-yellow-500',
    'active': 'bg-green-500',
    'done': 'text-green-500',
    'in-progress': 'text-yellow-500',
    'running': 'bg-green-500',
    'failed': 'bg-red-500',
    'down': 'bg-red-500',
    'up': 'bg-green-500',
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status] || 'bg-gray-500'}`}></span>;
}

function SiteCard({ site }: { site: { name: string; url: string; status: string; description?: string; legalCheck?: string } }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors group"
    >
      <StatusBadge status={site.status} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm flex items-center gap-2">
          {site.name}
          {site.legalCheck === 'passed' && <span className="text-xs text-green-500" title="Legal Check Passed">⚖️✓</span>}
          {site.legalCheck === 'failed' && <span className="text-xs text-red-500" title="Legal Check Failed">⚖️✗</span>}
        </div>
        {site.description && <div className="text-xs text-gray-500">{site.description}</div>}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
    </a>
  );
}

export default function ClientHome({ initialData }: { initialData: { automationSites: any[] } }) {
  const [sites, setSites] = useState(initialData.automationSites.length > 0 ? initialData.automationSites : initialWebsiteAutomation.sites);
  const [domains, setDomains] = useState(staticDomains);

  // Poll for company/site updates
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const companies = await res.json();
          // Map API companies to SiteCard format
          const mappedSites = companies.map((c: any) => ({
            name: c.name,
            url: c.deployment?.url || c.websiteUrl || '#',
            status: c.deployment?.status === 'live' ? 'live' : c.websiteAnalysis?.status === 'completed' ? 'pending' : 'in-progress',
            description: c.websiteUrl,
            legalCheck: 'pending' // Default for now
          }));
          
          if (mappedSites.length > 0) {
            setSites(mappedSites);
          }
        }
      } catch (e) {
        console.error("Failed to fetch companies", e);
      }
    };

    // Poll for Uptime Kuma status
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status/domains');
        if (res.ok) {
          const data = await res.json();
          if (data.monitors) {
            // Update domains status based on monitors
            setDomains(prevDomains => prevDomains.map(d => {
              const monitor = data.monitors.find((m: any) => m.name.includes(d.domain) || d.domain.includes(m.name));
              return monitor ? { ...d, status: monitor.status === 'up' ? 'active' : 'down' } : d;
            }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch domain status", e);
      }
    };

    // Initial fetches
    fetchCompanies();
    fetchStatus();

    const interval = setInterval(() => {
      fetchCompanies();
      fetchStatus();
    }, 30000); // 30s polling

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🚀 Minicon Command Center</h1>
            <p className="text-gray-400">Projekte, Server, Agenten & Infrastruktur</p>
          </div>
          {/* Removed Run Discovery button */}
        </div>

        {/* ================================================================ */}
        {/* MIND MAP - PROJEKTE */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* THEMA 1: DOKUKISTE */}
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{dokukisteProject.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{dokukisteProject.name}</h2>
                <p className="text-gray-400 text-sm">{dokukisteProject.description}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Sites</h3>
              <div className="space-y-2">
                {dokukisteProject.sites.map((site) => (
                  <SiteCard key={site.name} site={site} />
                ))}
              </div>
            </div>
            
             <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Roadmap</h3>
              <div className="grid grid-cols-2 gap-2">
                {dokukisteProject.roadmap.map((item) => (
                  <div key={item.task} className="flex items-center gap-2 text-sm">
                    {item.status === 'done' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={item.status === 'done' ? 'text-gray-500' : 'text-gray-300'}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Ideen</h3>
              <div className="flex flex-wrap gap-2">
                {dokukisteProject.ideas.map((idea) => (
                  <span 
                    key={idea.title}
                    className={`text-xs px-2 py-1 rounded ${
                      idea.priority === 'high' ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {idea.title}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* THEMA 2: WEBSITE AUTOMATISIERUNG */}
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{initialWebsiteAutomation.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{initialWebsiteAutomation.name}</h2>
                <p className="text-gray-400 text-sm">{initialWebsiteAutomation.description}</p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-300">{initialWebsiteAutomation.concept}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Live / Demo-Seiten ({sites.length})</h3>
              <div className="space-y-2">
                {sites.map((site: any) => (
                  <SiteCard key={site.name} site={site} />
                ))}
                {sites.length === 0 && <p className="text-sm text-gray-500">No sites found.</p>}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Pipeline</h3>
              <div className="space-y-2">
                {initialWebsiteAutomation.pipeline.map((item) => (
                  <div key={item.step} className="flex items-center gap-2 text-sm">
                    {item.status === 'done' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : item.status === 'in-progress' ? (
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={item.status === 'done' ? 'text-gray-500' : 'text-gray-300'}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Zielkunden</h3>
              <div className="space-y-2">
                {initialWebsiteAutomation.targets.map((t) => (
                  <div key={t.name} className="bg-gray-800/50 rounded p-2">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.reviews}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DORFKISTE */}
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{dorfkisteProject.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{dorfkisteProject.name}</h2>
                <p className="text-gray-400 text-sm">{dorfkisteProject.description}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {dorfkisteProject.sites.map((site) => (
                <SiteCard key={site.name} site={site} />
              ))}
            </div>
            
            <p className="text-sm text-gray-400">{dorfkisteProject.status}</p>
          </section>

          {/* DOMAINS */}
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🌍</span>
              <div>
                <h2 className="text-2xl font-bold">Domains</h2>
                <p className="text-gray-400 text-sm">DNS & Cloudflare Status</p>
              </div>
            </div>

            <div className="space-y-2">
              {domains.map((d) => (
                <div key={d.domain} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={d.status} />
                    <span className="font-medium text-sm">{d.domain}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{d.server}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      d.status === 'active' ? 'bg-green-900/50 text-green-400' : d.status === 'down' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ================================================================ */}
        {/* SERVER & CONTAINER */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ServerIcon className="text-purple-400" /> Server & Container
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {servers.map((server) => (
              <div key={server.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{server.name}</h3>
                    <p className="text-sm text-gray-400">{server.ip} • {server.provider}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-2">
                    <div className="col-span-4">Container</div>
                    <div className="col-span-3">Ports</div>
                    <div className="col-span-4">Info</div>
                    <div className="col-span-1">Status</div>
                  </div>
                  {server.containers.map((container) => (
                    <div key={container.name} className="grid grid-cols-12 gap-2 bg-gray-800/50 rounded-lg p-2 text-sm items-center">
                      <div className="col-span-4 font-medium truncate">{container.name}</div>
                      <div className="col-span-3 text-gray-500 text-xs">{container.ports}</div>
                      <div className="col-span-4 text-gray-400 text-xs truncate">{container.description}</div>
                      <div className="col-span-1 flex justify-end">
                        <StatusBadge status={container.status} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                  <span>{server.containers.length} Container</span>
                  <span>{server.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* AGENTEN */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-red-400" /> Agenten
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                  {agent.emoji}
                </div>
                <h3 className="font-medium text-sm">{agent.name}</h3>
                <p className="text-xs text-gray-400">{agent.role}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-green-400">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm">
          <p>Minicon eG Command Center • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
