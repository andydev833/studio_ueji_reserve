import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getABTests, addABTest, updateABTest, setABTests } from '../../services/dataService';
import { generateId, formatDate } from '../../utils/constants';
import { FlaskConical, Plus, TrendingUp, CheckCircle, XCircle, Play, Pause, Square } from 'lucide-react';

export default function ABTestManager() {
  const [tests, setTestsState] = useState(getABTests());
  const [view, setView] = useState('list'); // list | create | result
  const [selectedTest, setSelectedTest] = useState(null);
  const [newTest, setNewTest] = useState({
    test_name: '', page: 'shichigosan', target_element: 'cta_text',
    pattern_a: '', pattern_b: '', traffic_split: 50,
    start_date: '', end_date: '', success_metric: 'cta_click_rate', status: 'draft',
  });

  const targetElements = [
    { value: 'cta_text', label: 'CTA文言' },
    { value: 'hero_title', label: 'ファーストビュー見出し' },
    { value: 'hero_body', label: 'ファーストビュー本文' },
    { value: 'plan_order', label: 'プラン表示順' },
    { value: 'plan_highlight', label: 'スタンダードプラン強調' },
    { value: 'badge_text', label: '人気No.1バッジ文言' },
    { value: 'deposit_description', label: '予約金説明文' },
    { value: 'meeting_description', label: '事前打ち合わせ説明文' },
    { value: 'onsite_promotion', label: '現地打ち合わせ訴求' },
    { value: 'faq_position', label: 'FAQの位置' },
    { value: 'flow_display', label: '予約の流れ表示' },
    { value: 'line_cta', label: 'LINE誘導文言' },
  ];

  const metrics = [
    { value: 'cta_click_rate', label: 'CTAクリック率' },
    { value: 'form_start_rate', label: 'フォーム開始率' },
    { value: 'plan_select_rate', label: 'プラン選択率' },
    { value: 'payment_complete_rate', label: '決済完了率' },
    { value: 'reservation_complete_rate', label: '予約完了率' },
    { value: 'line_add_rate', label: 'LINE追加率' },
    { value: 'survey_complete_rate', label: 'アンケート回答率' },
    { value: 'meeting_complete_rate', label: '打ち合わせ実施率' },
    { value: 'date_confirmed_rate', label: '撮影日確定率' },
    { value: 'avg_contract_amount', label: '平均成約単価' },
  ];

  const statusLabels = { draft: '下書き', running: '実施中', paused: '停止', completed: '終了' };
  const statusColors = { draft: 'info', running: 'active', paused: 'warning', completed: 'completed' };

  const handleCreate = () => {
    const test = {
      ...newTest,
      ab_test_id: generateId('ab'),
      results: { a_views: 0, b_views: 0, a_conversions: 0, b_conversions: 0 },
    };
    addABTest(test);
    setTestsState([...tests, test]);
    setView('list');
    setNewTest({ test_name: '', page: 'shichigosan', target_element: 'cta_text', pattern_a: '', pattern_b: '', traffic_split: 50, start_date: '', end_date: '', success_metric: 'cta_click_rate', status: 'draft' });
  };

  const handleStatusChange = (testId, status) => {
    updateABTest(testId, { status });
    setTestsState(tests.map(t => t.ab_test_id === testId ? { ...t, status } : t));
  };

  const getWinner = (test) => {
    if (!test.results) return null;
    const aRate = test.results.a_views > 0 ? test.results.a_conversions / test.results.a_views : 0;
    const bRate = test.results.b_views > 0 ? test.results.b_conversions / test.results.b_views : 0;
    if (aRate === bRate) return null;
    return aRate > bRate ? 'A' : 'B';
  };

  return (
    <AdminLayout title="ABテスト管理" subtitle="予約サイトのABテストを作成・管理">
      {view === 'list' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="admin-btn admin-btn--primary" onClick={() => setView('create')}>
              <Plus size={16} /> テストを作成
            </button>
          </div>

          <div className="admin-card mb-lg">
            <h3 className="admin-card__title" style={{ marginBottom: 16 }}>実施中・予定のテスト</h3>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>テスト名</th><th>対象要素</th><th>ステータス</th><th>期間</th><th>A表示/成果</th><th>B表示/成果</th><th>A CVR</th><th>B CVR</th><th>勝ち</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {tests.map(test => {
                    const r = test.results || {};
                    const aCvr = r.a_views > 0 ? ((r.a_conversions / r.a_views) * 100).toFixed(1) : '-';
                    const bCvr = r.b_views > 0 ? ((r.b_conversions / r.b_views) * 100).toFixed(1) : '-';
                    const winner = getWinner(test);
                    return (
                      <tr key={test.ab_test_id} style={{ cursor: 'default' }}>
                        <td style={{ fontWeight: 600 }}>{test.test_name}</td>
                        <td style={{ fontSize: 12 }}>{targetElements.find(t => t.value === test.target_element)?.label || test.target_element}</td>
                        <td><span className={`status-badge status-badge--${statusColors[test.status]}`}>{statusLabels[test.status]}</span></td>
                        <td style={{ fontSize: 12 }}>{formatDate(test.start_date)}〜{formatDate(test.end_date)}</td>
                        <td>{r.a_views || 0}/{r.a_conversions || 0}</td>
                        <td>{r.b_views || 0}/{r.b_conversions || 0}</td>
                        <td style={{ fontWeight: 600, color: winner === 'A' ? 'var(--a-success)' : 'var(--a-text)' }}>{aCvr}%</td>
                        <td style={{ fontWeight: 600, color: winner === 'B' ? 'var(--a-success)' : 'var(--a-text)' }}>{bCvr}%</td>
                        <td>
                          {winner && <span style={{ fontWeight: 700, color: 'var(--a-success)' }}>パターン{winner}</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {test.status === 'draft' && <button className="admin-btn admin-btn--ghost" onClick={() => handleStatusChange(test.ab_test_id, 'running')} title="開始"><Play size={14} /></button>}
                            {test.status === 'running' && <button className="admin-btn admin-btn--ghost" onClick={() => handleStatusChange(test.ab_test_id, 'paused')} title="停止"><Pause size={14} /></button>}
                            {test.status === 'paused' && <button className="admin-btn admin-btn--ghost" onClick={() => handleStatusChange(test.ab_test_id, 'running')} title="再開"><Play size={14} /></button>}
                            {(test.status === 'running' || test.status === 'paused') && <button className="admin-btn admin-btn--ghost" onClick={() => handleStatusChange(test.ab_test_id, 'completed')} title="終了"><Square size={14} /></button>}
                            <button className="admin-btn admin-btn--ghost" onClick={() => { setSelectedTest(test); setView('result'); }} title="結果">
                              <TrendingUp size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card__title" style={{ marginBottom: 16 }}>ABテスト履歴</h3>
            {tests.filter(t => t.status === 'completed').length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--a-text-muted)' }}>完了したテストはまだありません</p>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead><tr><th>テスト名</th><th>対象</th><th>期間</th><th>勝ちパターン</th><th>改善率</th><th>本採用</th></tr></thead>
                  <tbody>
                    {tests.filter(t => t.status === 'completed').map(t => {
                      const r = t.results || {};
                      const aCvr = r.a_views > 0 ? (r.a_conversions / r.a_views) * 100 : 0;
                      const bCvr = r.b_views > 0 ? (r.b_conversions / r.b_views) * 100 : 0;
                      const winner = getWinner(t);
                      const improvement = winner === 'B' ? ((bCvr - aCvr) / Math.max(aCvr, 0.1) * 100).toFixed(1) : winner === 'A' ? ((aCvr - bCvr) / Math.max(bCvr, 0.1) * 100).toFixed(1) : '-';
                      return (
                        <tr key={t.ab_test_id} style={{ cursor: 'default' }}>
                          <td style={{ fontWeight: 600 }}>{t.test_name}</td>
                          <td>{targetElements.find(el => el.value === t.target_element)?.label}</td>
                          <td style={{ fontSize: 12 }}>{formatDate(t.start_date)}〜{formatDate(t.end_date)}</td>
                          <td><span style={{ fontWeight: 700, color: 'var(--a-success)' }}>パターン{winner || '-'}</span></td>
                          <td style={{ fontWeight: 600 }}>+{improvement}%</td>
                          <td><span className="status-badge status-badge--info">未適用</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {view === 'create' && (
        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 20 }}>新しいABテストを作成</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-form-label">テスト名</label>
              <input className="admin-form-input" value={newTest.test_name} onChange={e => setNewTest({ ...newTest, test_name: e.target.value })} placeholder="例: CTAボタン文言テスト" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">テスト対象要素</label>
              <select className="admin-form-input" value={newTest.target_element} onChange={e => setNewTest({ ...newTest, target_element: e.target.value })}>
                {targetElements.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">成功指標</label>
              <select className="admin-form-input" value={newTest.success_metric} onChange={e => setNewTest({ ...newTest, success_metric: e.target.value })}>
                {metrics.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-form-label">パターンA（現行）</label>
              <textarea className="admin-form-input" rows={2} value={newTest.pattern_a} onChange={e => setNewTest({ ...newTest, pattern_a: e.target.value })} placeholder="現行の文言・設定" />
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-form-label">パターンB（テスト）</label>
              <textarea className="admin-form-input" rows={2} value={newTest.pattern_b} onChange={e => setNewTest({ ...newTest, pattern_b: e.target.value })} placeholder="テストする文言・設定" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">配信比率（B側 %）</label>
              <input className="admin-form-input" type="number" min="10" max="90" value={newTest.traffic_split} onChange={e => setNewTest({ ...newTest, traffic_split: parseInt(e.target.value) })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">ステータス</label>
              <select className="admin-form-input" value={newTest.status} onChange={e => setNewTest({ ...newTest, status: e.target.value })}>
                <option value="draft">下書き</option>
                <option value="running">実施中</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">開始日</label>
              <input className="admin-form-input" type="date" value={newTest.start_date} onChange={e => setNewTest({ ...newTest, start_date: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">終了日</label>
              <input className="admin-form-input" type="date" value={newTest.end_date} onChange={e => setNewTest({ ...newTest, end_date: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="admin-btn admin-btn--secondary" onClick={() => setView('list')}>キャンセル</button>
            <button className="admin-btn admin-btn--primary" onClick={handleCreate} disabled={!newTest.test_name}>テストを作成</button>
          </div>
        </div>
      )}

      {view === 'result' && selectedTest && (
        <div>
          <button className="admin-btn admin-btn--secondary mb-lg" onClick={() => setView('list')}>← 一覧に戻る</button>
          <div className="admin-card mb-lg">
            <h3 className="admin-card__title" style={{ marginBottom: 20 }}>
              <FlaskConical size={16} style={{ marginRight: 8 }} />
              {selectedTest.test_name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--a-text-secondary)' }}>対象要素</p>
                <p style={{ fontWeight: 600 }}>{targetElements.find(t => t.value === selectedTest.target_element)?.label}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--a-text-secondary)' }}>実施期間</p>
                <p style={{ fontWeight: 600 }}>{formatDate(selectedTest.start_date)} 〜 {formatDate(selectedTest.end_date)}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ padding: 20, background: 'var(--a-bg)', borderRadius: 'var(--radius-md)', border: getWinner(selectedTest) === 'A' ? '2px solid var(--a-success)' : '1px solid var(--a-border)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>パターンA {getWinner(selectedTest) === 'A' && '🏆'}</h4>
                <p style={{ fontSize: 13, color: 'var(--a-text-secondary)', marginBottom: 12 }}>{selectedTest.pattern_a}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>表示数</span><div style={{ fontSize: 22, fontWeight: 700 }}>{selectedTest.results?.a_views || 0}</div></div>
                  <div><span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>成果数</span><div style={{ fontSize: 22, fontWeight: 700 }}>{selectedTest.results?.a_conversions || 0}</div></div>
                </div>
                <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: getWinner(selectedTest) === 'A' ? 'var(--a-success)' : 'var(--a-text)' }}>
                  {selectedTest.results?.a_views > 0 ? ((selectedTest.results.a_conversions / selectedTest.results.a_views) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div style={{ padding: 20, background: 'var(--a-bg)', borderRadius: 'var(--radius-md)', border: getWinner(selectedTest) === 'B' ? '2px solid var(--a-success)' : '1px solid var(--a-border)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>パターンB {getWinner(selectedTest) === 'B' && '🏆'}</h4>
                <p style={{ fontSize: 13, color: 'var(--a-text-secondary)', marginBottom: 12 }}>{selectedTest.pattern_b}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>表示数</span><div style={{ fontSize: 22, fontWeight: 700 }}>{selectedTest.results?.b_views || 0}</div></div>
                  <div><span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>成果数</span><div style={{ fontSize: 22, fontWeight: 700 }}>{selectedTest.results?.b_conversions || 0}</div></div>
                </div>
                <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: getWinner(selectedTest) === 'B' ? 'var(--a-success)' : 'var(--a-text)' }}>
                  {selectedTest.results?.b_views > 0 ? ((selectedTest.results.b_conversions / selectedTest.results.b_views) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            {getWinner(selectedTest) && (
              <div className="alert-card alert-card--success">
                <CheckCircle size={16} />
                <span>
                  パターン{getWinner(selectedTest)}の「{getWinner(selectedTest) === 'A' ? selectedTest.pattern_a : selectedTest.pattern_b}」は、
                  パターン{getWinner(selectedTest) === 'A' ? 'B' : 'A'}の「{getWinner(selectedTest) === 'A' ? selectedTest.pattern_b : selectedTest.pattern_a}」より
                  成果率が高いため、{getWinner(selectedTest)}を本採用することを推奨します。
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
