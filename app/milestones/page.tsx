'use client';

import { useEffect, useState } from 'react';

interface MilestoneData {
  name: string;
  target: number;
  deadline: string;
  current: number;
  pipelineBreakdown: Record<string, number>;
}

interface VelocityData {
  remaining: number;
  daysLeft: number;
  perDay: number;
}

interface ApiResponse {
  milestones: MilestoneData[];
  pipeline: {
    totalTickets: number;
    ticketsDone: number;
    stages: Record<string, number>;
    customers: Record<string, number>;
  };
  velocity: {
    milestone1: VelocityData;
    milestone2: VelocityData;
  };
  updatedAt: string;
}

function ProgressBar({ current, target, color }: { current: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden relative">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${pct}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {current} / {target} ({pct}%)
      </span>
    </div>
  );
}

function MilestoneCard({ m, velocity, color }: { m: MilestoneData; velocity: VelocityData; color: string }) {
  const pct = Math.min(100, Math.round((m.current / m.target) * 100));
  const deadlineDate = new Date(m.deadline);
  const isOnTrack = velocity.perDay <= 4; // 4/day is achievable

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{m.name}</h2>
          <p className="text-gray-400 text-sm">
            Deadline: {deadlineDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          pct >= 100 ? 'bg-green-500/20 text-green-400' :
          isOnTrack ? 'bg-blue-500/20 text-blue-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {pct >= 100 ? 'Erreicht!' : isOnTrack ? 'On Track' : 'Hinter Plan'}
        </div>
      </div>

      <ProgressBar current={m.current} target={m.target} color={color} />

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{velocity.remaining}</div>
          <div className="text-xs text-gray-400">Verbleibend</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{velocity.daysLeft}</div>
          <div className="text-xs text-gray-400">Tage</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
          <div className={`text-2xl font-bold ${isOnTrack ? 'text-green-400' : 'text-red-400'}`}>{velocity.perDay}</div>
          <div className="text-xs text-gray-400">pro Tag</div>
        </div>
      </div>

      {/* Pipeline Breakdown */}
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-300">Pipeline</h3>
        {Object.entries(m.pipelineBreakdown).map(([stage, count]) => (
          <div key={stage} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{stage}</span>
            <span className="text-white font-mono font-bold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineFunnel({ stages }: { stages: Record<string, number> }) {
  const stageConfig = [
    { key: 'discoveryNew', label: 'Discovery', color: 'bg-purple-500', icon: '🔍' },
    { key: 'discoveryDone', label: 'Bereit zum Bau', color: 'bg-blue-500', icon: '📋' },
    { key: 'buildDone', label: 'Gebaut', color: 'bg-yellow-500', icon: '🔨' },
    { key: 'qaPassed', label: 'QA bestanden', color: 'bg-orange-500', icon: '✅' },
    { key: 'reviewDone', label: 'Review fertig', color: 'bg-green-500', icon: '🎨' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Pipeline-Status</h2>
      <div className="space-y-3">
        {stageConfig.map((s) => {
          const count = stages[s.key] || 0;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <span className="text-lg w-8 text-center">{s.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{s.label}</span>
                  <span className="text-sm font-bold text-white">{count}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${Math.min(100, count * 10)}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MilestonesPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/milestones')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">
        Fehler beim Laden der Milestone-Daten
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Milestone-Planung</h1>
            <p className="text-gray-400 text-sm mt-1">
              Aktualisiert: {new Date(data.updatedAt).toLocaleString('de-DE')}
            </p>
          </div>
          <a href="/" className="text-sm text-blue-400 hover:text-blue-300">
            ← Dashboard
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{data.pipeline.customers.total}</div>
            <div className="text-xs text-gray-400 mt-1">Kunden gesamt</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{data.pipeline.customers.active + data.pipeline.customers.promoted}</div>
            <div className="text-xs text-gray-400 mt-1">Live</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">{data.pipeline.customers.onboarding}</div>
            <div className="text-xs text-gray-400 mt-1">Im Aufbau</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{data.pipeline.totalTickets}</div>
            <div className="text-xs text-gray-400 mt-1">Jira Tickets</div>
          </div>
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MilestoneCard
            m={data.milestones[0]}
            velocity={data.velocity.milestone1}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <MilestoneCard
            m={data.milestones[1]}
            velocity={data.velocity.milestone2}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>

        {/* Pipeline Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PipelineFunnel stages={data.pipeline.stages} />

          {/* Velocity Chart placeholder */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Geschwindigkeit</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Milestone 1: Dahn (50)</span>
                  <span className={`font-bold ${data.velocity.milestone1.perDay <= 4 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.velocity.milestone1.perDay} Sites/Tag noetig
                  </span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
                  {data.velocity.milestone1.remaining} Sites in {data.velocity.milestone1.daysLeft} Tagen
                  {data.velocity.milestone1.perDay <= 2 && ' — Locker machbar! 🟢'}
                  {data.velocity.milestone1.perDay > 2 && data.velocity.milestone1.perDay <= 4 && ' — Machbar mit Pipeline 🟡'}
                  {data.velocity.milestone1.perDay > 4 && ' — Pipeline-Skalierung noetig! 🔴'}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Milestone 2: 1000 Websites</span>
                  <span className={`font-bold ${data.velocity.milestone2.perDay <= 4 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.velocity.milestone2.perDay} Sites/Tag noetig
                  </span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
                  {data.velocity.milestone2.remaining} Sites in {data.velocity.milestone2.daysLeft} Tagen
                  {data.velocity.milestone2.perDay <= 2 && ' — Locker machbar! 🟢'}
                  {data.velocity.milestone2.perDay > 2 && data.velocity.milestone2.perDay <= 4 && ' — Machbar mit Pipeline 🟡'}
                  {data.velocity.milestone2.perDay > 4 && ' — Pipeline-Skalierung noetig! 🔴'}
                </div>
              </div>
            </div>

            {/* Scale-up Requirements */}
            <div className="mt-6 border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Skalierungs-Rechnung</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Aktuell: 6 Build-Runs/Tag (Cron: 0,3,6,16,19,22 Uhr)</p>
                <p>Wenn jeder Run 1 Site baut: <strong className="text-white">6 Sites/Tag</strong></p>
                <p>Fuer 1000 in {data.velocity.milestone2.daysLeft} Tagen: <strong className="text-white">{data.velocity.milestone2.perDay} Sites/Tag</strong></p>
                <p className="mt-2 text-gray-300">
                  {data.velocity.milestone2.perDay <= 6
                    ? '✅ Aktuelle Pipeline reicht aus'
                    : `⚠️ Pipeline muss auf ${Math.ceil(data.velocity.milestone2.perDay)} parallel Builds skaliert werden`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
