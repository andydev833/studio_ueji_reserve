import { useParams } from 'react-router-dom';
import { getReservation } from '../../services/dataService';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { formatDate, formatPrice, getStatusLabel } from '../../utils/constants';
import { Calendar, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';

export default function ReservationConfirm() {
  const { reservationId } = useParams();
  const reservation = getReservation(reservationId);

  if (!reservation) {
    return (
      <CustomerLayout>
        <div className="customer-content customer-content--narrow text-center" style={{ paddingTop: 80 }}>
          <h1 style={{ fontSize: 20 }}>予約が見つかりません</h1>
          <p style={{ color: 'var(--c-text-secondary)', marginTop: 8 }}>予約番号をご確認ください: {reservationId}</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>予約内容確認</h1>
          <p>予約番号: {reservation.reservation_id}</p>
        </div>

        <div className="card mb-lg">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} /> お客様情報
          </h3>
          <div className="completion__details" style={{ background: 'var(--c-sakura)', borderRadius: 12, padding: 20 }}>
            <div className="completion__detail-row">
              <span className="completion__detail-label"><User size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> お名前</span>
              <span className="completion__detail-value">{reservation.customer_name}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label"><Mail size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> メール</span>
              <span className="completion__detail-value">{reservation.email}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label"><Phone size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> 電話番号</span>
              <span className="completion__detail-value">{reservation.phone}</span>
            </div>
          </div>
        </div>

        <div className="card mb-lg">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={18} /> 予約内容
          </h3>
          <div className="completion__details" style={{ background: 'var(--c-sakura)', borderRadius: 12, padding: 20 }}>
            <div className="completion__detail-row">
              <span className="completion__detail-label">プラン</span>
              <span className="completion__detail-value">{reservation.plan_name}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">事前打ち合わせ方法</span>
              <span className="completion__detail-value">{reservation.meeting_method === 'onsite' ? '現地' : 'オンライン'}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">事前打ち合わせ日時</span>
              <span className="completion__detail-value">{formatDate(reservation.meeting_date)} {reservation.meeting_time}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">お子さまの人数</span>
              <span className="completion__detail-value">{reservation.child_count}名</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">お子さまの年齢</span>
              <span className="completion__detail-value">{reservation.child_ages}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">ステータス</span>
              <span className="completion__detail-value">{getStatusLabel(reservation.reservation_status)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} /> 決済情報
          </h3>
          <div className="completion__details" style={{ background: 'var(--c-sakura)', borderRadius: 12, padding: 20 }}>
            <div className="completion__detail-row">
              <span className="completion__detail-label">予約金</span>
              <span className="completion__detail-value">{formatPrice(reservation.reservation_fee)}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">決済状況</span>
              <span className="completion__detail-value" style={{ color: reservation.payment_status === 'completed' ? 'var(--c-success)' : 'var(--c-warning)' }}>
                {reservation.payment_status === 'completed' ? 'お支払い済み' : '未決済'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
