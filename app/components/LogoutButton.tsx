'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-red-600 transition px-3 py-1 rounded border border-gray-200 hover:border-red-300"
    >
      Abmelden
    </button>
  );
}
