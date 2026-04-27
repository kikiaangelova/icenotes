import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  TrendingUp,
  Globe2,
  Languages,
  Activity,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  language: string;
  country: string;
  last_active: string | null;
  total_sessions: number;
  created_at: string;
}

interface AnalyticsResponse {
  users_summary: {
    total: number;
    new_today: number;
    new_7d: number;
    new_30d: number;
  };
  activity: {
    dau: number;
    wau: number;
    avg_sessions_per_user: number;
    reflection_rate_pct: number;
    feature_totals: Record<string, number>;
  };
  languages: Record<string, number>;
  geography: Record<string, number>;
  users: AdminUser[];
}

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  bg: 'Bulgarian',
  ru: 'Russian',
  it: 'Italian',
  fr: 'French',
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');

  // Redirect if not admin
  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, roleLoading, user, isAdmin, navigate]);

  // Load analytics
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    supabase.functions
      .invoke('admin-analytics')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
        } else if (data?.error) {
          setError(data.error);
        } else {
          setData(data as AnalyticsResponse);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    const now = Date.now();
    const day = 86400000;
    const q = search.trim().toLowerCase();
    return data.users.filter((u) => {
      if (q) {
        const hay = `${u.name} ${u.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (countryFilter !== 'all' && u.country !== countryFilter) return false;
      if (languageFilter !== 'all' && u.language !== languageFilter) return false;
      if (activityFilter !== 'all') {
        const last = u.last_active ? new Date(u.last_active).getTime() : 0;
        if (activityFilter === 'active_7d' && last < now - 7 * day) return false;
        if (activityFilter === 'active_30d' && last < now - 30 * day) return false;
        if (activityFilter === 'inactive_30d' && last >= now - 30 * day) return false;
      }
      return true;
    });
  }, [data, search, countryFilter, languageFilter, activityFilter]);

  if (authLoading || roleLoading || (isAdmin && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Couldn't load analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const totalLangs = Object.values(data.languages).reduce((s, n) => s + n, 0) || 1;
  const totalGeo = Object.values(data.geography).reduce((s, n) => s + n, 0) || 1;

  const countries = Object.keys(data.geography).sort();
  const languages = Object.keys(data.languages).sort();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-serif">IceNotes Admin</h1>
              <p className="text-xs text-muted-foreground">
                Platform analytics & insights
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Users summary */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Users
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total registered" value={data.users_summary.total} />
            <StatCard label="New today" value={data.users_summary.new_today} />
            <StatCard label="New 7 days" value={data.users_summary.new_7d} />
            <StatCard label="New 30 days" value={data.users_summary.new_30d} />
          </div>
        </section>

        {/* Activity */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Activity
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Daily active (DAU)" value={data.activity.dau} />
            <StatCard label="Weekly active (WAU)" value={data.activity.wau} />
            <StatCard
              label="Avg sessions / user"
              value={data.activity.avg_sessions_per_user}
            />
            <StatCard
              label="Reflection usage"
              value={`${data.activity.reflection_rate_pct}%`}
            />
          </div>
        </section>

        {/* Geography & Language */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> Geography
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Inferred from user language preference
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(data.geography)
                .sort((a, b) => b[1] - a[1])
                .map(([country, count]) => (
                  <DistRow
                    key={country}
                    label={country}
                    count={count}
                    pct={(count / totalGeo) * 100}
                  />
                ))}
              {Object.keys(data.geography).length === 0 && (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Languages className="w-4 h-4" /> Languages
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Validates localization strategy
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(data.languages)
                .sort((a, b) => b[1] - a[1])
                .map(([lang, count]) => (
                  <DistRow
                    key={lang}
                    label={`${LANG_LABEL[lang] ?? lang} (${lang.toUpperCase()})`}
                    count={count}
                    pct={(count / totalLangs) * 100}
                  />
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Feature usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Feature usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.activity.feature_totals).map(([k, v]) => (
                <StatCard key={k} label={cap(k)} value={v} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users</CardTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              <Input
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  {languages.map((l) => (
                    <SelectItem key={l} value={l}>
                      {LANG_LABEL[l] ?? l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  <SelectItem value="active_7d">Active last 7d</SelectItem>
                  <SelectItem value="active_30d">Active last 30d</SelectItem>
                  <SelectItem value="inactive_30d">Inactive 30d+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {(u.name ?? '').split(' ')[0] || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell className="uppercase">{u.language}</TableCell>
                    <TableCell>
                      {u.last_active
                        ? new Date(u.last_active).toLocaleDateString()
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.total_sessions}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No users match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-3xl font-serif">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </CardContent>
  </Card>
);

const DistRow: React.FC<{ label: string; count: number; pct: number }> = ({
  label,
  count,
  pct,
}) => (
  <div>
    <div className="flex items-center justify-between text-sm mb-1">
      <span>{label}</span>
      <span className="text-muted-foreground">
        {count} · {pct.toFixed(1)}%
      </span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary"
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  </div>
);

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default AdminPage;
