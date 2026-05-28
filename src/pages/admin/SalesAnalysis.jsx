import { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations } from '../../services/dataService';
import { formatPrice } from '../../utils/constants';

export default function SalesAnalysis() {
  const reservations = getReservations();

  const data = useMemo(() => {
    const contracted = reservations.filter(r => ['contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
    const depositTotal = reservations.filter(r => r.payment_status === 'completed').reduce((s, r) => s + r.reservation_fee, 0);
    const salesTotal = contracted.reduce((s, r) => s + (r.final_amount || r.estimated_amount || 0), 0);
    const avg = contracted.length > 0 ? salesTotal / contracted.length : 0;

    const planSales = {};
    contracted.forEach(r => {
      planSales[r.plan_name] = (planSales[r.plan_name] || 0) + (r.final_amount || r.estimated_amount || 0);
    });

    const sourceSales = {};
    contracted.forEach(r => {
      sourceSales[r.source] = (sourceSales[r.source] || 0) + (r.final_amount || r.estimated_amount || 0);
    });

    const methodSales = {};
    contracted.forEach(r => {
      const m = r.meeting_method === 'onsite' ? '現地' : 'オンライン';
      methodSales[m] = (methodSales[m] || 0) + (r.final_amount || r.estimated_amount || 0);
    });

    return { depositTotal, salesTotal, avg, contracted: contracted.length, planSales, sourceSales, methodSales };
  }, [reservations]);

  return (
    <AdminLayout title="売上分析" subtitle="売上の内訳と傾向">
      <div className="stat-cards">
        <div className="stat-card"><div className="stat-card__label">予約金売上</div><div className="stat-card__value" style={{ fontSize: 22 }}>{formatPrice(data.depositTotal)}</div></div>
        <div className="stat-card"><div className="stat-card__label">成約売上</div><div className="stat-card__value" style={{ fontSize: 22 }}>{formatPrice(data.salesTotal)}</div></div>
        <div className="stat-card"><div className="stat-card__label">成約件数</div><div className="stat-card__value">{data.contracted}</div></div>
        <div className="stat-card"><div className="stat-card__label">平均成約単価</div><div className="stat-card__value" style={{ fontSize: 22 }}>{formatPrice(Math.round(data.avg))}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>プラン別売上</h3>
          {Object.entries(data.planSales).map(([name, amount]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--a-border)', fontSize: 13 }}>
              <span>{name}</span><strong>{formatPrice(amount)}</strong>
            </div>
          ))}
        </div>
        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>流入元別売上</h3>
          {Object.entries(data.sourceSales).sort((a, b) => b[1] - a[1]).map(([name, amount]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--a-border)', fontSize: 13 }}>
              <span>{name}</span><strong>{formatPrice(amount)}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card mt-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>打ち合わせ方法別売上</h3>
        {Object.entries(data.methodSales).map(([name, amount]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--a-border)', fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>{name}</span><strong style={{ color: 'var(--a-primary)' }}>{formatPrice(amount)}</strong>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
