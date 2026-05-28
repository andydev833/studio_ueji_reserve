import { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getEventLogs } from '../../services/dataService';

export default function FunnelAnalysis() {
  const events = getEventLogs();

  const funnel = useMemo(() => {
    const steps = [
      { name: 'ページ訪問', event: 'page_view' },
      { name: 'CTAクリック', event: 'cta_click' },
      { name: 'フォーム開始', event: 'form_start' },
      { name: 'プラン表示', event: 'plan_view' },
      { name: 'プラン選択', event: 'plan_select' },
      { name: '打ち合わせ方法選択', event: 'meeting_method_select' },
      { name: '打ち合わせ日選択', event: 'meeting_date_select' },
      { name: '顧客情報入力完了', event: 'customer_info_complete' },
      { name: '子ども情報入力完了', event: 'child_info_complete' },
      { name: '決済開始', event: 'payment_start' },
      { name: '決済完了', event: 'payment_complete' },
      { name: '予約完了', event: 'reservation_complete' },
      { name: 'LINE追加', event: 'line_add_click' },
      { name: '事前アンケート回答', event: 'pre_survey_complete' },
    ];

    const sessionEvents = {};
    events.forEach(e => {
      if (!sessionEvents[e.session_id]) sessionEvents[e.session_id] = new Set();
      sessionEvents[e.session_id].add(e.event_name);
    });

    const totalSessions = Object.keys(sessionEvents).length;

    return steps.map((step, i) => {
      const count = Object.values(sessionEvents).filter(s => s.has(step.event)).length;
      const prevCount = i > 0 ? Object.values(sessionEvents).filter(s => s.has(steps[i - 1].event)).length : totalSessions;
      const dropoff = prevCount - count;
      const dropoffRate = prevCount > 0 ? ((dropoff / prevCount) * 100).toFixed(1) : 0;
      const pct = totalSessions > 0 ? ((count / totalSessions) * 100) : 0;
      return { ...step, count, dropoff, dropoffRate, pct };
    });
  }, [events]);

  const maxCount = funnel[0]?.count || 1;

  return (
    <AdminLayout title="予約ファネル分析" subtitle="各ステップの到達数と離脱率">
      <div className="admin-card">
        <div className="funnel">
          {funnel.map((step, i) => (
            <div key={step.event} className="funnel__step">
              <div className="funnel__label">{step.name}</div>
              <div className="funnel__bar-wrapper">
                <div className="funnel__bar" style={{ width: `${Math.max((step.count / maxCount) * 100, 5)}%`, background: `linear-gradient(90deg, hsl(${220 - i * 8}, 70%, ${55 + i * 2}%), hsl(${220 - i * 8}, 60%, ${65 + i * 2}%))` }}>
                  <span className="funnel__bar-label">{step.count}</span>
                </div>
              </div>
              <div className="funnel__values">
                {i > 0 && <span style={{ color: step.dropoffRate > 30 ? 'var(--a-error)' : 'var(--a-text-secondary)' }}>
                  離脱 {step.dropoffRate}%
                </span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card mt-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>ファネル詳細</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ステップ</th>
                <th>到達数</th>
                <th>離脱数</th>
                <th>離脱率</th>
              </tr>
            </thead>
            <tbody>
              {funnel.map((step, i) => (
                <tr key={step.event} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 600 }}>{step.name}</td>
                  <td>{step.count}</td>
                  <td>{i > 0 ? step.dropoff : '-'}</td>
                  <td>
                    {i > 0 ? (
                      <span style={{ color: step.dropoffRate > 30 ? 'var(--a-error)' : step.dropoffRate > 15 ? 'var(--a-warning)' : 'var(--a-success)', fontWeight: 600 }}>
                        {step.dropoffRate}%
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
