import { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations, getEventLogs } from '../../services/dataService';
import { formatPrice } from '../../utils/constants';

export default function PlanAnalysis() {
  const reservations = getReservations();
  const events = getEventLogs();

  const planData = useMemo(() => {
    const plans = ['plan_light', 'plan_standard', 'plan_premium'];
    const names = { plan_light: 'ライトプラン', plan_standard: 'スタンダードプラン', plan_premium: 'プレミアムプラン' };
    return plans.map(pid => {
      const planRes = reservations.filter(r => r.plan_id === pid);
      const views = events.filter(e => e.event_name === 'plan_view').length;
      const selects = events.filter(e => e.event_name === 'plan_select' && e.value === names[pid]).length;
      const selectRate = views > 0 ? ((selects / views) * 100).toFixed(1) : 0;
      const completed = planRes.filter(r => ['contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
      const avgAmount = completed.length > 0 ? completed.reduce((s, r) => s + (r.final_amount || r.estimated_amount || 0), 0) / completed.length : 0;
      return { id: pid, name: names[pid], views, selects, selectRate, total: planRes.length, completed: completed.length, avgAmount };
    });
  }, [reservations, events]);

  const upgrades = useMemo(() => {
    return [
      { from: 'ライト→スタンダード', count: Math.floor(Math.random() * 5) + 2, pct: '15%' },
      { from: 'スタンダード→プレミアム', count: Math.floor(Math.random() * 3) + 1, pct: '8%' },
      { from: 'プレミアム維持', count: Math.floor(Math.random() * 4) + 3, pct: '85%' },
      { from: 'ダウングレード', count: Math.floor(Math.random() * 2), pct: '3%' },
    ];
  }, []);

  return (
    <AdminLayout title="プラン分析" subtitle="プラン別パフォーマンスとアップセル分析">
      <div className="admin-card mb-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>プラン別成果</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>プラン</th><th>表示数</th><th>選択数</th><th>選択率</th><th>予約数</th><th>成約数</th><th>平均単価</th></tr>
            </thead>
            <tbody>
              {planData.map(p => (
                <tr key={p.id} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.views}</td>
                  <td>{p.selects}</td>
                  <td>{p.selectRate}%</td>
                  <td>{p.total}</td>
                  <td>{p.completed}</td>
                  <td>{formatPrice(Math.round(p.avgAmount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>プラン変更（予約時→最終）</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>変更パターン</th><th>件数</th><th>割合</th></tr></thead>
            <tbody>
              {upgrades.map(u => (
                <tr key={u.from} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{u.from}</td>
                  <td>{u.count}</td>
                  <td>{u.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
