import { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getEventLogs, getReservations } from '../../services/dataService';
import { formatPrice, TRAFFIC_SOURCES } from '../../utils/constants';

export default function TrafficAnalysis() {
  const events = getEventLogs();
  const reservations = getReservations();

  const data = useMemo(() => {
    return TRAFFIC_SOURCES.map(source => {
      const sourceEvents = events.filter(e => e.source === source);
      const sessions = new Set(sourceEvents.map(e => e.session_id));
      const visits = sessions.size;
      const formStarts = new Set(sourceEvents.filter(e => e.event_name === 'form_start').map(e => e.session_id)).size;
      const completed = new Set(sourceEvents.filter(e => e.event_name === 'reservation_complete').map(e => e.session_id)).size;
      const cvr = visits > 0 ? ((completed / visits) * 100).toFixed(1) : 0;
      const sourceReservations = reservations.filter(r => r.source === source);
      const contracted = sourceReservations.filter(r => ['contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
      const revenue = contracted.reduce((s, r) => s + (r.final_amount || r.estimated_amount || 0), 0);
      const avgAmount = contracted.length > 0 ? revenue / contracted.length : 0;
      return { source, visits, formStarts, completed, cvr, contracted: contracted.length, revenue, avgAmount };
    }).filter(d => d.visits > 0).sort((a, b) => b.visits - a.visits);
  }, [events, reservations]);

  return (
    <AdminLayout title="流入分析" subtitle="流入元別のパフォーマンス">
      <div className="admin-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>流入元</th>
                <th>訪問数</th>
                <th>フォーム開始</th>
                <th>予約完了</th>
                <th>CVR</th>
                <th>成約数</th>
                <th>平均単価</th>
                <th>売上</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.source} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{d.source}</td>
                  <td>{d.visits}</td>
                  <td>{d.formStarts}</td>
                  <td>{d.completed}</td>
                  <td style={{ fontWeight: 600, color: parseFloat(d.cvr) > 10 ? 'var(--a-success)' : 'var(--a-text)' }}>{d.cvr}%</td>
                  <td>{d.contracted}</td>
                  <td>{formatPrice(Math.round(d.avgAmount))}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
