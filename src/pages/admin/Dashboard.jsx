import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations, getEventLogs } from '../../services/dataService';
import { formatDate, formatPrice, getStatusLabel, getStatusColor } from '../../utils/constants';
import { Calendar, Users, CreditCard, TrendingUp, AlertTriangle, Clock, MapPin, Monitor, Camera, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const reservations = getReservations();
  const events = getEventLogs();
  const today = new Date().toDateString();

  const stats = useMemo(() => {
    const todayMeetings = reservations.filter(r => r.meeting_date && new Date(r.meeting_date).toDateString() === today);
    const onsiteMeetings = todayMeetings.filter(r => r.meeting_method === 'onsite');
    const onlineMeetings = todayMeetings.filter(r => r.meeting_method === 'online');
    const todayShootings = reservations.filter(r => r.shooting_date && new Date(r.shooting_date).toDateString() === today);

    const newReservations = reservations.filter(r => r.reservation_status === 'payment_completed');
    const paymentPending = reservations.filter(r => r.payment_status === 'pending');
    const surveyPending = reservations.filter(r => r.reservation_status === 'survey_pending' || (!r.survey_completed && ['payment_completed', 'before_meeting'].includes(r.reservation_status)));
    const meetingDone = reservations.filter(r => r.reservation_status === 'meeting_done');
    const dateNotConfirmed = reservations.filter(r => ['meeting_done', 'date_adjusting'].includes(r.reservation_status));

    const thisMonth = new Date().getMonth();
    const monthReservations = reservations.filter(r => new Date(r.created_at).getMonth() === thisMonth);
    const completed = reservations.filter(r => ['contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
    const avgAmount = completed.length > 0 ? completed.reduce((s, r) => s + (r.final_amount || r.estimated_amount || 0), 0) / completed.length : 0;

    const totalViews = events.filter(e => e.event_name === 'page_view').length;
    const totalCompleted = events.filter(e => e.event_name === 'reservation_complete').length;
    const cvr = totalViews > 0 ? ((totalCompleted / totalViews) * 100).toFixed(1) : 0;

    return {
      onsiteMeetings, onlineMeetings, todayShootings,
      newReservations, paymentPending, surveyPending, dateNotConfirmed,
      monthReservations: monthReservations.length,
      meetingDoneCount: meetingDone.length,
      completedCount: completed.length,
      avgAmount, cvr, totalViews, totalCompleted,
    };
  }, [reservations, events, today]);

  return (
    <AdminLayout title="ダッシュボード" subtitle="今日の状況と対応事項">
      {/* 今日の対応 */}
      <div className="stat-cards">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--a-primary)' }}>
          <div className="stat-card__label"><MapPin size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 本日の現地打ち合わせ</div>
          <div className="stat-card__value">{stats.onsiteMeetings.length}<span style={{ fontSize: 14, fontWeight: 400 }}>件</span></div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--a-info)' }}>
          <div className="stat-card__label"><Monitor size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 本日のオンライン打ち合わせ</div>
          <div className="stat-card__value">{stats.onlineMeetings.length}<span style={{ fontSize: 14, fontWeight: 400 }}>件</span></div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--a-success)' }}>
          <div className="stat-card__label"><Camera size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 本日の撮影予定</div>
          <div className="stat-card__value">{stats.todayShootings.length}<span style={{ fontSize: 14, fontWeight: 400 }}>件</span></div>
        </div>
      </div>

      {/* 未対応 */}
      <div className="admin-card mb-xl">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><AlertTriangle size={16} style={{ marginRight: 8, color: 'var(--a-warning)' }} /> 未対応</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: '新規予約', count: stats.newReservations.length, color: '#3B82F6' },
            { label: '予約金未決済', count: stats.paymentPending.length, color: '#F59E0B' },
            { label: '事前アンケート未回答', count: stats.surveyPending.length, color: '#8B5CF6' },
            { label: '撮影日未確定', count: stats.dateNotConfirmed.length, color: '#EF4444' },
          ].map(item => (
            <div key={item.label} className="alert-card alert-card--info" style={{ borderLeftColor: item.color, borderLeft: `3px solid ${item.color}` }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--a-text-secondary)' }}>{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--a-text)' }}>{item.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 今月サマリー */}
      <div className="admin-card mb-xl">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><TrendingUp size={16} style={{ marginRight: 8 }} /> 今月サマリー</h2>
        </div>
        <div className="stat-cards" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-card__label">予約完了数</div>
            <div className="stat-card__value">{stats.monthReservations}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">成約確定数</div>
            <div className="stat-card__value">{stats.completedCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">平均成約単価</div>
            <div className="stat-card__value" style={{ fontSize: 22 }}>{formatPrice(Math.round(stats.avgAmount))}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">予約CVR</div>
            <div className="stat-card__value">{stats.cvr}%</div>
          </div>
        </div>
      </div>

      {/* 改善アラート */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title"><AlertTriangle size={16} style={{ marginRight: 8, color: 'var(--a-warning)' }} /> 改善アラート</h2>
        </div>
        <div className="alert-card alert-card--warning mb-sm">
          <AlertTriangle size={16} />
          <span>日程選択画面で離脱が多い可能性があります。空き枠不足またはカレンダーUIの改善を検討してください。</span>
        </div>
        <div className="alert-card alert-card--info mb-sm">
          <TrendingUp size={16} />
          <span>LINE追加率の向上余地があります。予約完了画面のLINE誘導文言のABテストを検討してください。</span>
        </div>
        <div className="alert-card alert-card--warning">
          <AlertTriangle size={16} />
          <span>事前アンケート回答率が{Math.round((reservations.filter(r => r.survey_completed).length / Math.max(reservations.length, 1)) * 100)}%です。リマインド送信を検討してください。</span>
        </div>
      </div>
    </AdminLayout>
  );
}
