'use client';

import { useState, useEffect } from 'react';

interface SiteStatus {
  paid: boolean;
  exemptFromBanner: boolean;
}

export function DemoBanner({ siteName }: { siteName: string }) {
  const [status, setStatus] = useState<SiteStatus | null>(null);

  useEffect(() => {
    // Use absolute API URL
    fetch(`https://api.minicon.eu/api/sites/${siteName}/status`)
      .then(res => res.json())
      .then(data => {
        if (!data.paid && !data.exemptFromBanner) {
          setStatus(data);
        }
      })
      .catch(() => {
        // Fail open - don't show banner if API unreachable
      });
  }, [siteName]);

  if (!status) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
      color: 'white',
      padding: '8px 16px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: 500,
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      🏗️ Dies ist eine Testseite von <strong>Minicon eG</strong> — 
      <a href="https://minicon.eu" style={{ color: 'white', textDecoration: 'underline' }}>
        Jetzt eigene Website erstellen
      </a>
    </div>
  );
}
