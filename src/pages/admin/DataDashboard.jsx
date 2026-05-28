import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations, getEventLogs } from '../../services/dataService';
import { formatPrice } from '../../utils/constants';
import { TrendingUp, Users, CreditCard, Target, ArrowRight } from 'lucide-react';

export default function DataDashboard() {
  const navigate = useNavigate();
  const reservations = getReservations();
  const events = getEventLogs();

  const stats = useMemo(() => {
    const views = events.filter(e => e.event_name === 'page_view').length;
    const ctaClicks = events.filter(e => e.event_name === 'cta_click').length;
    const formStarts = events.filter(e => e.event_name === 'form_start').length;
    const completed = events.filter(e => e.event_name === 'reservation_complete').length;
    const paymentDone = events.filter(e => e.event_name === 'payment_complete').length;
    const lineClicks = events.filter(e => e.event_name === 'line_add_click').length;
    const surveyDone = events.filter(e => e.event_name === 'pre_survey_complete').length;

    const cvr = views > 0 ? ((completed / views) * 100).toFixed(1) : 0;
    const paymentRate = formStarts > 0 ? ((paymentDone / formStarts) * 100).toFixed(1) : 0;
    const lineRate = completed > 0 ? ((lineClicks / completed) * 100).toFixed(1) : 0;
    const surveyRate = completed > 0 ? ((surveyDone / completed) * 100).toFixed(1) : 0;

    const contracted = reservations.filter(r => ['contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(r.reservation_status));
    const totalRevenue = contracted.reduce((s, r) => s + (r.final_amount || r.estimated_amount || 0), 0);
    const avgAmount = contracted.length > 0 ? totalRevenue / contracted.length : 0;

    return { views, ctaClicks, formStarts, completed, paymentDone, lineClicks, surveyDone, cvr, paymentRate, lineRate, surveyRate, totalRevenue, avgAmount, contracted: contracted.length };
  }, [events, reservations]);

  const cards = [
    { label: 'ページ訪問', value: stats.views, icon: <Users size={18} /> },
    { label: 'CTAクリック', value: stats.ctaClicks, icon: <Target size={18} /> },
    { label: 'フォーム開始', value: stats.formStarts, icon: <TrendingUp size={18} /> },
    { label: '予約完了', value: stats.completed, icon: <Users size={18} /> },
    { label: '予約CVR', value: `${stats.cvr}%`, icon: <TrendingUp size={18} /> },
    { label: '決済完了率', value: `${stats.paymentRate}%`, icon: <CreditCard size={18} /> },
    { label: 'LINE追加率', value: `${stats.lineRate}%`, icon: <Target size={18} /> },
    { label: '平均成約単価', value: formatPrice(Math.round(stats.avgAmount)), icon: <CreditCard size={18} /> },
  ];

  const links = [
    { to: '/admin/data/funnel', label: 'ファネル分析', desc: '各ステップの離脱率を確認' },
    { to: '/admin/data/traffic', label: '流入分析', desc: '流入元別のCVRと売上' },
    { to: '/admin/data/form-dropoff', label: 'フォーム離脱分析', desc: '離脱ステップと改善仮説' },
    { to: '/admin/data/plans', label: 'プラン分析', desc: 'プラン別成果とアップセル' },
    { to: '/admin/data/meetings', label: '打ち合わせ分析', desc: '現地vsオンライン比較' },
    { to: '/admin/data/payments', label: '決済分析', desc: '決済完了率と離脱' },
    { to: '/admin/data/sales', label: '売上分析', desc: '月別・プラン別売上' },
  ];

  return (
    <AdminLayout title="データ観測ダッシュボード" subtitle="予約サイトのKPIを確認">
      <div className="stat-cards">
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-card__label">{c.label}</div>
            <div className="stat-card__value" style={{ fontSize: typeof c.value === 'string' && c.value.includes('¥') ? 20 : 28 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {links.map(link => (
          <div key={link.to} className="admin-card" style={{ cursor: 'pointer' }} onClick={() => navigate(link.to)}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{link.label}</h3>
            <p style={{ fontSize: 12, color: 'var(--a-text-secondary)', marginBottom: 12 }}>{link.desc}</p>
            <span style={{ fontSize: 12, color: 'var(--a-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              詳しく見る <ArrowRight size={12} />
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
