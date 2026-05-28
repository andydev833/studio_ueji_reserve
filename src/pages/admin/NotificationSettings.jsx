import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Bell, Mail, MessageCircle } from 'lucide-react';

export default function NotificationSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    new_reservation_email: true,
    new_reservation_line: true,
    payment_complete_email: true,
    payment_complete_line: false,
    survey_complete_email: true,
    survey_complete_line: false,
    meeting_reminder_email: true,
    meeting_reminder_line: true,
    meeting_reminder_hours: 24,
    shooting_reminder_email: true,
    shooting_reminder_line: true,
    shooting_reminder_hours: 48,
    daily_summary_email: true,
    weekly_report_email: true,
    alert_dropoff_threshold: 30,
    alert_low_bookings: true,
    alert_low_bookings_threshold: 3,
    admin_email: 'admin@studio-ueji.com',
    line_webhook_url: '',
  });

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('ueji_notification_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleRow = ({ label, emailKey, lineKey, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--a-border)', flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {emailKey && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Mail size={12} />
            <label className="toggle"><input type="checkbox" checked={settings[emailKey]} onChange={() => update(emailKey, !settings[emailKey])} /><span className="toggle__slider" /></label>
          </label>
        )}
        {lineKey && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <MessageCircle size={12} />
            <label className="toggle"><input type="checkbox" checked={settings[lineKey]} onChange={() => update(lineKey, !settings[lineKey])} /><span className="toggle__slider" /></label>
          </label>
        )}
        {children}
      </div>
    </div>
  );

  return (
    <AdminLayout title="通知設定" subtitle="管理者通知・リマインダーの設定">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました！' : '保存する'}
        </button>
      </div>

      <div className="admin-card mb-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>
          <Bell size={16} style={{ marginRight: 8 }} />
          管理者通知
        </h3>
        <p style={{ fontSize: 12, color: 'var(--a-text-secondary)', marginBottom: 16, display: 'flex', gap: 24 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> メール</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageCircle size={12} /> LINE通知</span>
        </p>
        <ToggleRow label="新規予約" emailKey="new_reservation_email" lineKey="new_reservation_line" />
        <ToggleRow label="決済完了" emailKey="payment_complete_email" lineKey="payment_complete_line" />
        <ToggleRow label="事前アンケート回答" emailKey="survey_complete_email" lineKey="survey_complete_line" />
      </div>

      <div className="admin-card mb-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>リマインダー</h3>
        <ToggleRow label="打ち合わせリマインダー" emailKey="meeting_reminder_email" lineKey="meeting_reminder_line">
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input className="admin-form-input" type="number" style={{ width: 60, padding: '4px 8px' }} value={settings.meeting_reminder_hours} onChange={e => update('meeting_reminder_hours', parseInt(e.target.value))} />
            <span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>時間前</span>
          </div>
        </ToggleRow>
        <ToggleRow label="撮影日リマインダー" emailKey="shooting_reminder_email" lineKey="shooting_reminder_line">
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input className="admin-form-input" type="number" style={{ width: 60, padding: '4px 8px' }} value={settings.shooting_reminder_hours} onChange={e => update('shooting_reminder_hours', parseInt(e.target.value))} />
            <span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>時間前</span>
          </div>
        </ToggleRow>
      </div>

      <div className="admin-card mb-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>定期レポート</h3>
        <ToggleRow label="日次サマリー" emailKey="daily_summary_email" />
        <ToggleRow label="週次レポート" emailKey="weekly_report_email" />
      </div>

      <div className="admin-card mb-lg">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>アラート</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--a-border)', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>離脱率が高い場合にアラート</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input className="admin-form-input" type="number" style={{ width: 60, padding: '4px 8px' }} value={settings.alert_dropoff_threshold} onChange={e => update('alert_dropoff_threshold', parseInt(e.target.value))} />
            <span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>%以上</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--a-border)' }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>予約数が少ない週にアラート</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label className="toggle"><input type="checkbox" checked={settings.alert_low_bookings} onChange={() => update('alert_low_bookings', !settings.alert_low_bookings)} /><span className="toggle__slider" /></label>
            <input className="admin-form-input" type="number" style={{ width: 60, padding: '4px 8px' }} value={settings.alert_low_bookings_threshold} onChange={e => update('alert_low_bookings_threshold', parseInt(e.target.value))} />
            <span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>件/週未満</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card__title" style={{ marginBottom: 16 }}>連携設定</h3>
        <div className="admin-form-group">
          <label className="admin-form-label">管理者メールアドレス</label>
          <input className="admin-form-input" type="email" value={settings.admin_email} onChange={e => update('admin_email', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">LINE Webhook URL</label>
          <input className="admin-form-input" value={settings.line_webhook_url} onChange={e => update('line_webhook_url', e.target.value)} placeholder="https://..." />
          <p style={{ fontSize: 11, color: 'var(--a-text-muted)', marginTop: 4 }}>※PoC版ではモック出力のみ。本番でLINE Messaging API連携予定</p>
        </div>
      </div>
    </AdminLayout>
  );
}
