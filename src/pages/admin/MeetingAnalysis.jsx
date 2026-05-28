import { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations } from '../../services/dataService';
import { formatPrice } from '../../utils/constants';

export default function MeetingAnalysis() {
  const reservations = getReservations();

  const data = useMemo(() => {
    const methods = ['onsite', 'online'];
    const names = { onsite: '現地打ち合わせ', online: 'オンライン打ち合わせ' };
    return methods.map(m => {
      const methodRes = reservations.filter(r => r.meeting_method === m);
      const total = methodRes.length;
      const meetingDone = methodRes.filter(r => ['meeting_done', 'date_adjusting', 'date_confirmed', 'contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
      const contracted = methodRes.filter(r => ['contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
      const cancelled = methodRes.filter(r => r.reservation_status === 'cancelled').length;
      const lost = methodRes.filter(r => r.reservation_status === 'lost').length;
      const avgAmount = contracted.length > 0 ? contracted.reduce((s, r) => s + (r.final_amount || r.estimated_amount || 0), 0) / contracted.length : 0;
      const dateConfirmed = methodRes.filter(r => ['date_confirmed', 'contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
      return {
        name: names[m], total,
        meetingRate: total > 0 ? ((meetingDone.length / total) * 100).toFixed(1) : 0,
        dateConfirmedRate: total > 0 ? ((dateConfirmed.length / total) * 100).toFixed(1) : 0,
        avgAmount, contracted: contracted.length,
        cancelRate: total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0,
        lostRate: total > 0 ? ((lost / total) * 100).toFixed(1) : 0,
      };
    });
  }, [reservations]);

  return (
    <AdminLayout title="打ち合わせ分析" subtitle="現地 vs オンライン比較">
      <div className="admin-card mb-lg">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>方法</th><th>選択数</th><th>実施率</th><th>撮影日確定率</th><th>成約数</th><th>平均単価</th><th>キャンセル率</th><th>失注率</th></tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.name} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td>{d.total}</td>
                  <td>{d.meetingRate}%</td>
                  <td>{d.dateConfirmedRate}%</td>
                  <td>{d.contracted}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(Math.round(d.avgAmount))}</td>
                  <td>{d.cancelRate}%</td>
                  <td>{d.lostRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>分析仮説</h3>
        <div className="alert-card alert-card--info mb-sm">
          <span>現地打ち合わせは件数は少ないが、実物サンプルを見せながら提案できるため、平均成約単価が高い傾向があります。</span>
        </div>
        <div className="alert-card alert-card--info">
          <span>オンライン打ち合わせは気軽に予約できるため件数が多いが、オプション購入率が低い可能性があります。</span>
        </div>
      </div>
    </AdminLayout>
  );
}
