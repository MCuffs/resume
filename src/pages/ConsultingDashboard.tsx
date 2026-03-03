import { useEffect, useState } from 'react';

type RequestItem = {
  id: string;
  requestId: string;
  createdAt: string;
  service: string;
  servicePrice: string;
  applicantName: string;
  applicantEmail: string;
  targetCompany: string;
  clientNotes: string;
  paymentReference: string | null;
  paymentStatus: string | null;
  englishFileName: string;
  englishFileSize: number;
  englishUrl: string | null;
  koreanFileName: string;
  koreanFileSize: number;
  koreanUrl: string | null;
};

function formatBytes(bytes?: number) {
  if (!bytes || Number.isNaN(bytes)) return '-';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function ConsultingDashboard() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardKey, setDashboardKey] = useState('');
  const [keyInput, setKeyInput] = useState('');

  const loadItems = async (keyOverride?: string) => {
    const key = keyOverride ?? dashboardKey;
    if (!key) {
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/consulting-requests?limit=100', {
        headers: {
          'x-dashboard-key': key,
        },
      });
      const raw = await response.text();
      let result: any = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        result = null;
      }

      // Backward-compatible parsing: accept both
      // 1) { ok: true, items: [...] } and 2) direct array payload [...]
      const items =
        Array.isArray(result) ? result :
          Array.isArray(result?.items) ? result.items :
            null;

      if (!response.ok || (!items && result?.ok !== true)) {
        if (response.status === 401) {
          sessionStorage.removeItem('consulting_dashboard_key');
          setDashboardKey('');
        }
        throw new Error(
          result?.error ||
          (raw && raw.length < 300 ? raw : '') ||
          `Failed to load dashboard data (HTTP ${response.status})`
        );
      }
      setItems(items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('consulting_dashboard_key') || '';
    if (saved) {
      setDashboardKey(saved);
      setKeyInput(saved);
      loadItems(saved);
      return;
    }
    setLoading(false);
  }, []);

  const unlockDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    const key = keyInput.trim();
    if (!key) {
      setError('Please enter dashboard access key');
      return;
    }
    sessionStorage.setItem('consulting_dashboard_key', key);
    setDashboardKey(key);
    loadItems(key);
  };

  const logoutDashboard = () => {
    sessionStorage.removeItem('consulting_dashboard_key');
    setDashboardKey('');
    setItems([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#112E51]">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Consulting Requests Dashboard</h1>
            <p className="text-sm text-[#556987] mt-1">Latest paid requests with attached English/Korean resume files.</p>
          </div>
          {dashboardKey ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadItems()}
                className="bg-[#29AEE1] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1E95C3] transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={logoutDashboard}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Lock
              </button>
            </div>
          ) : null}
        </div>

        {!dashboardKey && (
          <form onSubmit={unlockDashboard} className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <p className="text-sm font-bold mb-2">Admin Access Required</p>
            <p className="text-sm text-[#556987] mb-3">Enter dashboard access key.</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Dashboard key"
              />
              <button
                type="submit"
                className="bg-[#112E51] text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Unlock
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm font-semibold text-[#556987]">
            Loading requests...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm font-semibold text-red-600 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm font-semibold text-[#556987]">
            No consulting requests found yet.
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#29AEE1] bg-[#29AEE1]/10 px-2 py-1 rounded">{item.requestId}</span>
                <span className="text-xs font-semibold text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{item.paymentStatus || 'paid_submitted'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Service:</strong> {item.service} ({item.servicePrice})</p>
                  <p><strong>Applicant:</strong> {item.applicantName} ({item.applicantEmail})</p>
                  <p><strong>Target:</strong> {item.targetCompany}</p>
                  <p><strong>Payment Ref:</strong> {item.paymentReference || '-'}</p>
                </div>
                <div>
                  <p className="font-bold mb-1">Client Notes</p>
                  <p className="text-[#556987] whitespace-pre-wrap">{item.clientNotes}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 mb-1">English Resume</p>
                  <p className="text-sm font-semibold">{item.englishFileName}</p>
                  <p className="text-xs text-slate-500 mb-2">{formatBytes(item.englishFileSize)}</p>
                  {item.englishUrl ? (
                    <a href={item.englishUrl} target="_blank" rel="noreferrer" className="text-[#29AEE1] text-xs font-bold hover:underline">
                      Open file
                    </a>
                  ) : (
                    <p className="text-xs text-red-500 font-semibold">File link unavailable</p>
                  )}
                </div>
                <div className="border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 mb-1">Korean Resume</p>
                  <p className="text-sm font-semibold">{item.koreanFileName}</p>
                  <p className="text-xs text-slate-500 mb-2">{formatBytes(item.koreanFileSize)}</p>
                  {item.koreanUrl ? (
                    <a href={item.koreanUrl} target="_blank" rel="noreferrer" className="text-[#29AEE1] text-xs font-bold hover:underline">
                      Open file
                    </a>
                  ) : (
                    <p className="text-xs text-red-500 font-semibold">File link unavailable</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
