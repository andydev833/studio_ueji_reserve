import AdminLayout from '../../components/admin/AdminLayout';
import { getEventLogs } from '../../services/dataService';
import { useMemo } from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export default function FormDropoffAnalysis() {
  const events = getEventLogs();

  const analysis = useMemo(() => {
    const steps = [
      { name: 'プラン選択', from: 'plan_view', to: 'plan_select' },
      { name: '打ち合わせ方法選択', from: 'meeting_method_view', to: 'meeting_method_select' },
      { name: '打ち合わせ日選択', from: 'meeting_date_view', to: 'meeting_date_select' },
      { name: '顧客情報入力', from: 'customer_info_start', to: 'customer_info_complete' },
      { name: '子ども情報入力', from: 'child_info_start', to: 'child_info_complete' },
      { name: '決済', from: 'payment_start', to: 'payment_complete' },
    ];

    return steps.map(step => {
      const started = new Set(events.filter(e => e.event_name === step.from).map(e => e.session_id)).size;
      const completed = new Set(events.filter(e => e.event_name === step.to).map(e => e.session_id)).size;
      const dropoff = started - completed;
      const dropoffRate = started > 0 ? ((dropoff / started) * 100).toFixed(1) : 0;

      const mobileStarted = new Set(events.filter(e => e.event_name === step.from && e.device === 'mobile').map(e => e.session_id)).size;
      const mobileCompleted = new Set(events.filter(e => e.event_name === step.to && e.device === 'mobile').map(e => e.session_id)).size;
      const mobileDropoff = mobileStarted > 0 ? (((mobileStarted - mobileCompleted) / mobileStarted) * 100).toFixed(1) : 0;

      const pcStarted = new Set(events.filter(e => e.event_name === step.from && e.device === 'desktop').map(e => e.session_id)).size;
      const pcCompleted = new Set(events.filter(e => e.event_name === step.to && e.device === 'desktop').map(e => e.session_id)).size;
      const pcDropoff = pcStarted > 0 ? (((pcStarted - pcCompleted) / pcStarted) * 100).toFixed(1) : 0;

      return { ...step, started, completed, dropoff, dropoffRate, mobileDropoff, pcDropoff };
    });
  }, [events]);

  const hypotheses = [
    { condition: (a) => a.find(s => s.name === '打ち合わせ日選択')?.dropoffRate > 20, text: '打ち合わせ日選択で離脱が多いため、空き枠不足またはカレンダーUIが分かりにくい可能性があります。' },
    { condition: (a) => a.find(s => s.name === '決済')?.dropoffRate > 30, text: '決済画面での離脱が多いため、予約金の説明不足や決済UIの改善が必要な可能性があります。' },
    { condition: (a) => a.find(s => s.name === '顧客情報入力')?.mobileDropoff > 30, text: 'スマホでの顧客情報入力の離脱が多いため、入力フォームのスマホ最適化を検討してください。' },
  ];

  return (
    <AdminLayout title="フォーム離脱分析" subtitle="ステップ別離脱率と改善仮説">
      <div className="admin-card mb-lg">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ステップ</th>
                <th>開始</th>
                <th>完了</th>
                <th>離脱</th>
                <th>離脱率</th>
                <th>スマホ離脱率</th>
                <th>PC離脱率</th>
              </tr>
            </thead>
            <tbody>
              {analysis.map(s => (
                <tr key={s.name} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.started}</td>
                  <td>{s.completed}</td>
                  <td>{s.dropoff}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: s.dropoffRate > 30 ? 'var(--a-error)' : s.dropoffRate > 15 ? 'var(--a-warning)' : 'var(--a-success)' }}>
                      {s.dropoffRate}%
                    </span>
                  </td>
                  <td>{s.mobileDropoff}%</td>
                  <td>{s.pcDropoff}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>
          <Lightbulb size={16} style={{ marginRight: 8, color: 'var(--a-warning)' }} />
          改善仮説
        </h3>
        {hypotheses.map((h, i) => (
          h.condition(analysis) && (
            <div key={i} className="alert-card alert-card--warning mb-sm">
              <AlertTriangle size={16} />
              <span>{h.text}</span>
            </div>
          )
        ))}
        {!hypotheses.some(h => h.condition(analysis)) && (
          <div className="alert-card alert-card--success">
            <span>現在、顕著な離脱問題は検出されていません。</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
