import { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getEventLogs } from '../../services/dataService';

export default function PaymentAnalysis() {
  const events = getEventLogs();

  const data = useMemo(() => {
    const starts = new Set(events.filter(e => e.event_name === 'payment_start').map(e => e.session_id)).size;
    const completes = new Set(events.filter(e => e.event_name === 'payment_complete').map(e => e.session_id)).size;
    const dropoffs = starts - completes;
    const rate = starts > 0 ? ((completes / starts) * 100).toFixed(1) : 0;
    return { starts, completes, dropoffs, rate };
  }, [events]);

  return (
    <AdminLayout title="決済分析" subtitle="決済完了率と離脱">
      <div className="stat-cards">
        <div className="stat-card"><div className="stat-card__label">決済開始</div><div className="stat-card__value">{data.starts}</div></div>
        <div className="stat-card"><div className="stat-card__label">決済完了</div><div className="stat-card__value">{data.completes}</div></div>
        <div className="stat-card"><div className="stat-card__label">決済離脱</div><div className="stat-card__value">{data.dropoffs}</div></div>
        <div className="stat-card"><div className="stat-card__label">完了率</div><div className="stat-card__value">{data.rate}%</div></div>
      </div>
      <div className="admin-card">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>改善ポイント</h3>
        {parseFloat(data.rate) < 70 ? (
          <div className="alert-card alert-card--warning"><span>決済完了率が{data.rate}%です。予約金の説明文やUIの改善を検討してください。</span></div>
        ) : (
          <div className="alert-card alert-card--success"><span>決済完了率は{data.rate}%で良好です。</span></div>
        )}
      </div>
    </AdminLayout>
  );
}
