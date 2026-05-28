import { useParams } from 'react-router-dom';
import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservation, updateReservation, getSurvey, getEventLogs } from '../../services/dataService';
import { formatDate, formatDateTime, formatPrice, getStatusLabel, getStatusColor, RESERVATION_STATUSES } from '../../utils/constants';
import { User, Calendar, FileText, Camera, DollarSign, CreditCard, MessageCircle, StickyNote, Clock, AlertTriangle, Star } from 'lucide-react';

export default function ReservationDetail() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(getReservation(id));
  const [activeTab, setActiveTab] = useState('basic');
  const survey = getSurvey(id);
  const events = getEventLogs().filter(e => e.reservation_id === id || e.session_id?.includes('mock'));

  if (!reservation) {
    return <AdminLayout title="予約が見つかりません" />;
  }

  const handleStatusChange = (newStatus) => {
    const updated = updateReservation(id, { reservation_status: newStatus });
    if (updated) setReservation(updated);
  };

  const tabs = [
    { id: 'basic', label: '基本情報', icon: <User size={14} /> },
    { id: 'meeting', label: '打ち合わせ', icon: <Calendar size={14} /> },
    { id: 'survey', label: 'アンケート', icon: <FileText size={14} /> },
    { id: 'shooting', label: '撮影内容', icon: <Camera size={14} /> },
    { id: 'proposal', label: '提案・見積', icon: <DollarSign size={14} /> },
    { id: 'payment', label: '決済情報', icon: <CreditCard size={14} /> },
    { id: 'contact', label: '連絡履歴', icon: <MessageCircle size={14} /> },
    { id: 'memo', label: 'メモ', icon: <StickyNote size={14} /> },
    { id: 'log', label: 'イベントログ', icon: <Clock size={14} /> },
  ];

  const InfoRow = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--a-border)', fontSize: 13 }}>
      <span style={{ color: 'var(--a-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: highlight ? 'var(--a-primary)' : 'var(--a-text)' }}>{value || '-'}</span>
    </div>
  );

  const SurveyHint = ({ condition, text }) => condition ? (
    <div className="alert-card alert-card--success mb-sm" style={{ fontSize: 12 }}>
      <Star size={14} /> <span>{text}</span>
    </div>
  ) : null;

  return (
    <AdminLayout title={`${reservation.customer_name}さんの予約`} subtitle={`予約ID: ${reservation.reservation_id}`}>
      {/* ステータス変更 */}
      <div className="admin-card mb-lg" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>ステータス:</span>
        <span className={`status-badge status-badge--${getStatusColor(reservation.reservation_status)}`} style={{ fontSize: 13, padding: '5px 14px' }}>
          {getStatusLabel(reservation.reservation_status)}
        </span>
        <select
          className="filter-input"
          value={reservation.reservation_status}
          onChange={e => handleStatusChange(e.target.value)}
          style={{ minWidth: 180 }}
        >
          {RESERVATION_STATUSES.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* タブ */}
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} <span style={{ marginLeft: 4 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-card animate-fade-in-up">
        {activeTab === 'basic' && (
          <div>
            <InfoRow label="顧客名" value={reservation.customer_name} />
            <InfoRow label="メール" value={reservation.email} />
            <InfoRow label="電話番号" value={reservation.phone} />
            <InfoRow label="LINE連携" value={reservation.line_added ? '追加済み' : '未追加'} />
            <InfoRow label="連絡方法" value={reservation.preferred_contact_method} />
            <InfoRow label="プラン" value={reservation.plan_name} highlight />
            <InfoRow label="予約金" value={formatPrice(reservation.reservation_fee)} />
            <InfoRow label="申込日時" value={formatDateTime(reservation.created_at)} />
            <InfoRow label="流入元" value={reservation.source} />
            <InfoRow label="デバイス" value={reservation.device} />
            <InfoRow label="お子さまの人数" value={`${reservation.child_count}名`} />
            <InfoRow label="お子さまの年齢" value={reservation.child_ages} />
          </div>
        )}

        {activeTab === 'meeting' && (
          <div>
            <InfoRow label="打ち合わせ方法" value={reservation.meeting_method === 'onsite' ? '現地' : 'オンライン'} />
            <InfoRow label="打ち合わせ日時" value={`${formatDate(reservation.meeting_date)} ${reservation.meeting_time}`} />
            <InfoRow label="オンラインURL" value={reservation.meeting_online_url} />
            <InfoRow label="実施状況" value={reservation.meeting_status === 'completed' ? '完了' : '予定'} />
            <InfoRow label="担当者" value={reservation.meeting_staff} />
            <InfoRow label="撮影希望時期" value={reservation.shooting_preferred_period} />
          </div>
        )}

        {activeTab === 'survey' && (
          <div>
            {!survey ? (
              <div className="alert-card alert-card--warning">
                <AlertTriangle size={16} /> <span>事前アンケート未回答です</span>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--a-primary)' }}>提案チャンス</h3>
                <SurveyHint condition={survey.grandparents_join === 'はい'} text="祖父母参加予定あり → 三世代写真・祖父母向け商品を提案" />
                <SurveyHint condition={survey.album_interest === 'はい' || survey.album_interest === '実物を見て考えたい'} text="アルバム興味あり → アルバムサンプルを準備" />
                <SurveyHint condition={survey.three_generation_photo_interest === 'はい'} text="三世代写真に興味あり → 構成を提案" />
                <SurveyHint condition={survey.grandparent_gift_interest === 'はい' || survey.grandparent_gift_interest === '実物を見て考えたい'} text="祖父母向け台紙に興味あり → 実物を準備" />
                <SurveyHint condition={survey.costume_status === '相談したい'} text="衣装相談あり → 衣装オプションを提案" />

                <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 16px', color: 'var(--a-text)' }}>回答内容</h3>
                <InfoRow label="お子さまの名前" value={survey.child_name} />
                <InfoRow label="性別" value={survey.child_gender} />
                <InfoRow label="性格" value={survey.child_personality} />
                <InfoRow label="兄弟姉妹" value={survey.siblings} />
                <InfoRow label="祖父母参加" value={survey.grandparents_join} />
                <InfoRow label="家族写真" value={survey.family_photo_interest} />
                <InfoRow label="衣装" value={survey.costume_status} />
                <InfoRow label="ヘアメイク" value={survey.hair_make_interest} />
                <InfoRow label="撮影場所" value={survey.preferred_location} />
                <InfoRow label="参拝神社" value={survey.shrine_plan} />
                <InfoRow label="撮影の雰囲気" value={survey.desired_mood} />
                <InfoRow label="不安なこと" value={survey.concerns} />
                <InfoRow label="アルバム" value={survey.album_interest} />
                <InfoRow label="祖父母向け台紙" value={survey.grandparent_gift_interest} />
                <InfoRow label="三世代写真" value={survey.three_generation_photo_interest} />
              </>
            )}
          </div>
        )}

        {activeTab === 'shooting' && (
          <div>
            <InfoRow label="撮影日" value={reservation.shooting_date ? formatDate(reservation.shooting_date) : '未確定'} />
            <InfoRow label="撮影時間" value={reservation.shooting_time || '-'} />
            <InfoRow label="撮影場所" value={reservation.shooting_location || '-'} />
            <InfoRow label="確定プラン" value={reservation.final_plan ? reservation.plan_name : '-'} />
          </div>
        )}

        {activeTab === 'proposal' && (
          <div>
            <InfoRow label="予約時プラン" value={reservation.plan_name} />
            <InfoRow label="見積金額" value={formatPrice(reservation.estimated_amount)} />
            <InfoRow label="成約金額" value={formatPrice(reservation.final_amount)} />
            <InfoRow label="予約金" value={formatPrice(reservation.reservation_fee)} />
            <InfoRow label="残金" value={formatPrice(reservation.remaining_amount)} />
            <InfoRow label="値引き" value={formatPrice(reservation.discount)} />
            <InfoRow label="失注理由" value={reservation.lost_reason} />
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <InfoRow label="予約金" value={formatPrice(reservation.reservation_fee)} />
            <InfoRow label="決済ステータス" value={reservation.payment_status === 'completed' ? '決済完了' : '未決済'} />
            <InfoRow label="決済日時" value={reservation.payment_status === 'completed' ? formatDateTime(reservation.created_at) : '-'} />
            <InfoRow label="残金" value={formatPrice(reservation.remaining_amount)} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <InfoRow label="LINE追加" value={reservation.line_added ? 'クリック済み' : '未クリック'} />
            <InfoRow label="事前アンケート" value={reservation.survey_completed ? '回答済み' : '未回答'} />
            <p style={{ fontSize: 13, color: 'var(--a-text-muted)', marginTop: 16 }}>※連絡履歴は将来的にメール・LINE連携で自動記録されます</p>
          </div>
        )}

        {activeTab === 'memo' && (
          <div>
            <textarea
              className="admin-form-input"
              placeholder="管理者メモを入力..."
              rows={6}
              defaultValue={reservation.notes}
              onBlur={e => updateReservation(id, { notes: e.target.value })}
            />
          </div>
        )}

        {activeTab === 'log' && (
          <div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>日時</th><th>イベント</th><th>値</th><th>デバイス</th></tr>
                </thead>
                <tbody>
                  {events.slice(0, 30).sort((a, b) => new Date(b.event_time) - new Date(a.event_time)).map(e => (
                    <tr key={e.event_id} style={{ cursor: 'default' }}>
                      <td style={{ fontSize: 12 }}>{formatDateTime(e.event_time)}</td>
                      <td><span className="status-badge status-badge--info">{e.event_name}</span></td>
                      <td style={{ fontSize: 12 }}>{e.value || '-'}</td>
                      <td style={{ fontSize: 12 }}>{e.device}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
