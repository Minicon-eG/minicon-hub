'use client';

import { useState, useEffect } from 'react';

export default function MetricsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        
        if (data.containers) {
          // Parse JSON objects if they are strings, otherwise use as is
          const containers = data.containers.map((c: any) => {
            if (typeof c === 'string') {
              try { return JSON.parse(c); } catch { return c; }
            }
            return c;
          });
          setStats(containers);
          setError('');
        } else if (data.error) {
          setError(data.error);
        }
      } catch (err: any) {
        console.error(err);
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading && stats.length === 0) return <div className="p-8">Loading metrics...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">SaaS Metrics Dashboard (PDFM-33)</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mem Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mem %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net I/O</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.Name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{c.ID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.CPUPerc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.MemUsage}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.MemPerc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.NetIO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        Live data from docker stats via /var/run/docker.sock
      </div>
    </div>
  );
}
