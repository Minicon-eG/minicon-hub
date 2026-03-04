import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DatabasePage() {
  let companies: any[] = [];
  let analyses: any[] = [];
  let deployments: any[] = [];
  let activities: any[] = [];

  try {
    companies = await prisma.company.findMany();
    analyses = await prisma.websiteAnalysis.findMany();
    deployments = await prisma.deployment.findMany();
    activities = await prisma.agentActivity.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Database Error</h1>
        <p className="mt-2">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📊 Database Viewer</h1>
      
      {/* Companies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🏢 Companies <span className="text-sm font-normal text-gray-400">({companies.length})</span>
        </h2>
        {companies.length === 0 ? (
          <p className="text-gray-500">No companies found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Name</th>
                  <th className="p-2">Domain</th>
                  <th className="p-2">Industry</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.domain}</td>
                    <td className="p-2">{c.industry}</td>
                    <td className="p-2 text-sm">{c.address}</td>
                    <td className="p-2 text-sm">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('de-DE') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Website Analyses */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🔍 Website Analyses <span className="text-sm font-normal text-gray-400">({analyses.length})</span>
        </h2>
        {analyses.length === 0 ? (
          <p className="text-gray-500">No analyses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Company</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Legal Check</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a: any) => (
                  <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-2">{a.companyId}</td>
                    <td className="p-2">{a.status}</td>
                    <td className="p-2">{a.score || '-'}</td>
                    <td className="p-2">{a.legalCheckStatus || '-'}</td>
                    <td className="p-2 text-sm">{a.createdAt ? new Date(a.createdAt).toLocaleDateString('de-DE') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Deployments */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🚀 Deployments <span className="text-sm font-normal text-gray-400">({deployments.length})</span>
        </h2>
        {deployments.length === 0 ? (
          <p className="text-gray-500">No deployments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Company</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">URL</th>
                  <th className="p-2">Version</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-2">{d.companyId}</td>
                    <td className="p-2">{d.status}</td>
                    <td className="p-2 text-sm">{d.url || '-'}</td>
                    <td className="p-2">{d.version || '-'}</td>
                    <td className="p-2 text-sm">{d.createdAt ? new Date(d.createdAt).toLocaleDateString('de-DE') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* Agent Activities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🤖 Agent Activities <span className="text-sm font-normal text-gray-400">({activities.length})</span>
        </h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2">Agent</th>
                  <th className="p-2">Summary</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a: any) => (
                  <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="p-2 font-medium whitespace-nowrap">{a.agentName}</td>
                    <td className="p-2 text-sm">{a.summary}</td>
                    <td className="p-2 text-sm whitespace-nowrap">{a.createdAt ? new Date(a.createdAt).toLocaleString('de-DE') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
