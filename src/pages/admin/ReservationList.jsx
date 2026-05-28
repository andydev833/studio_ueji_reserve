import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations } from '../../services/dataService';
import { formatDate, formatPrice, getStatusLabel, getStatusColor, RESERVATION_STATUSES } from '../../utils/constants';
import { Search, Filter } from 'lucide-react';

export default function ReservationList() {
  const navigate = useNavigate();
  const allReservations = getReservations();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  const filtered = useMemo(() => {
    return allReservations.filter(r => {
      if (search && !r.customer_name.includes(search) && !r.email.includes(search) && !r.phone.includes(search) && !r.reservation_id.includes(search)) return false;
      if (statusFilter && r.reservation_status !== statusFilter) return false;
      if (planFilter && r.plan_id !== planFilter) return false;
      if (methodFilter && r.meeting_method !== methodFilter) return false;
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [allReservations, search, statusFilter, planFilter, methodFilter]);

  return (
    <AdminLayout title="予約一覧" subtitle={`全${filtered.length}件`}>
      <div className="filters">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text-muted)' }} />
          <input
            className="filter-input"
            style={{ paddingLeft: 36, width: '100%' }}
            placeholder="顧客名・メール・電話・予約ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">全ステータス</option>
          {RESERVATION_STATUSES.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <select className="filter-input" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="">全プラン</option>
          <option value="plan_light">ライトプラン</option>
          <option value="plan_standard">スタンダードプラン</option>
          <option value="plan_premium">プレミアムプラン</option>
        </select>
        <select className="filter-input" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
          <option value="">全方法</option>
          <option value="onsite">現地</option>
          <option value="online">オンライン</option>
        </select>
      </div>

      <div className="admin-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>受付日</th>
                <th>予約ID</th>
                <th>顧客名</th>
                <th>プラン</th>
                <th>打合せ方法</th>
                <th>打合せ日時</th>
                <th>予約金</th>
                <th>ステータス</th>
                <th>アンケート</th>
                <th>流入元</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.reservation_id} onClick={() => navigate(`/admin/reservations/${r.reservation_id}`)}>
                  <td>{formatDate(r.created_at)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.reservation_id}</td>
                  <td style={{ fontWeight: 600 }}>{r.customer_name}</td>
                  <td>{r.plan_name}</td>
                  <td>{r.meeting_method === 'onsite' ? '現地' : 'オンライン'}</td>
                  <td>{formatDate(r.meeting_date)} {r.meeting_time}</td>
                  <td>
                    <span className={`status-badge ${r.payment_status === 'completed' ? 'status-badge--active' : 'status-badge--warning'}`}>
                      {r.payment_status === 'completed' ? '済' : '未'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${getStatusColor(r.reservation_status)}`}>
                      {getStatusLabel(r.reservation_status)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${r.survey_completed ? 'status-badge--active' : 'status-badge--warning'}`}>
                      {r.survey_completed ? '回答済' : '未回答'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
