import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import { addReservation } from '../../services/dataService';
import { generateReservationId, formatPrice, formatDate, getSessionId, getUTMParams, getDeviceType } from '../../utils/constants';
import CustomerLayout from '../../components/customer/CustomerLayout';
import StepIndicator from '../../components/customer/StepIndicator';
import { CreditCard, ArrowLeft, Shield, Lock } from 'lucide-react';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useReservation();
  const { trackEvent } = useEventLog();
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    trackEvent('payment_start', { step: 7 });
  }, []);

  if (!state.plan) {
    navigate('/plan-select');
    return null;
  }

  const handlePayment = async () => {
    if (!agreed) return;
    setProcessing(true);

    // モック決済処理
    await new Promise(resolve => setTimeout(resolve, 2000));

    const utm = getUTMParams();
    const reservationId = generateReservationId();

    const reservation = {
      reservation_id: reservationId,
      created_at: new Date().toISOString(),
      customer_name: state.customerInfo.name,
      email: state.customerInfo.email,
      phone: state.customerInfo.phone,
      preferred_contact_method: state.customerInfo.contactMethod,
      plan_id: state.plan.plan_id,
      plan_name: state.plan.plan_name,
      meeting_method: state.meetingMethod,
      meeting_date: state.meetingDate,
      meeting_time: state.meetingTime,
      shooting_preferred_period: state.childInfo.shootingPeriod || '',
      child_count: state.childInfo.count,
      child_ages: state.childInfo.ages,
      reservation_fee: state.plan.reservation_fee,
      payment_status: 'completed',
      reservation_status: 'payment_completed',
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      device: getDeviceType(),
      ab_test_id: '',
      ab_variant: '',
      notes: state.customerInfo.notes || '',
      line_added: false,
      survey_completed: false,
      meeting_online_url: state.meetingMethod === 'online' ? 'https://meet.google.com/mock-meeting' : '',
      meeting_status: 'scheduled',
      meeting_staff: '',
      meeting_notes: '',
      next_action: '',
      shooting_date: '',
      shooting_time: '',
      shooting_location: '',
      final_plan: state.plan.plan_id,
      proposed_options: [],
      confirmed_options: [],
      estimated_amount: state.plan.price,
      final_amount: 0,
      discount: 0,
      remaining_amount: state.plan.price - state.plan.reservation_fee,
      lost_reason: '',
    };

    addReservation(reservation);

    trackEvent('payment_complete', { step: 7, reservation_id: reservationId, value: String(state.plan.reservation_fee) });
    trackEvent('reservation_complete', { step: 8, reservation_id: reservationId });

    dispatch({ type: 'SET_RESERVATION_ID', payload: reservationId });
    dispatch({ type: 'SET_PAYMENT' });
    navigate('/complete');
  };

  return (
    <CustomerLayout>
      <StepIndicator currentStep={6} />
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>予約金のお支払い</h1>
          <p>お申込みには予約金のお支払いが必要です</p>
        </div>

        <div className="payment-summary">
          <div className="payment-summary__row">
            <span>選択プラン</span>
            <strong>{state.plan.plan_name}</strong>
          </div>
          <div className="payment-summary__row">
            <span>プラン価格</span>
            <span>{formatPrice(state.plan.price)}</span>
          </div>
          <div className="payment-summary__row">
            <span>打ち合わせ方法</span>
            <span>{state.meetingMethod === 'onsite' ? '現地' : 'オンライン'}</span>
          </div>
          <div className="payment-summary__row">
            <span>打ち合わせ日時</span>
            <span>{formatDate(state.meetingDate)} {state.meetingTime}</span>
          </div>
          <div className="payment-summary__row payment-summary__row--total">
            <span>予約金（税込）</span>
            <span>{formatPrice(state.plan.reservation_fee)}</span>
          </div>
        </div>

        <div className="notice mb-lg">
          <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>予約金は撮影料金の一部として充当されます。事前打ち合わせ後、撮影日・撮影内容・オプションを確定いたします。</span>
        </div>

        {/* モック決済フォーム */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} /> カード情報
          </h3>
          <div className="form-group">
            <label className="form-label">カード番号</label>
            <input
              className="form-input"
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
            />
            <div className="form-help">※モック決済のため任意の番号で進められます</div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">有効期限</label>
              <input
                className="form-input"
                type="text"
                placeholder="12/28"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVC</label>
              <input
                className="form-input"
                type="text"
                placeholder="123"
                value={cvc}
                onChange={e => setCvc(e.target.value)}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Lock size={12} /> SSL暗号化通信で安全にお支払いいただけます
          </div>
        </div>

        {/* キャンセル規約 */}
        <div className="card mt-lg">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>キャンセル規約</h3>
          <ul style={{ fontSize: 13, color: 'var(--c-text-secondary)', lineHeight: 2, paddingLeft: 20 }}>
            <li>予約金は原則として撮影料金の一部に充当されます</li>
            <li>日程変更は可能です</li>
            <li>体調不良や天候不良の場合はご相談いただけます</li>
            <li>キャンセル時の扱いはスタジオの規約に従います</li>
          </ul>
          <div className="checkbox-group mt-md">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              id="agree-terms"
            />
            <label htmlFor="agree-terms" style={{ fontSize: 14 }}>
              上記キャンセル規約に同意します
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn btn--ghost" onClick={() => navigate('/child-info')}>
            <ArrowLeft size={16} /> 戻る
          </button>
          <button
            className="btn btn--primary btn--large"
            onClick={handlePayment}
            disabled={!agreed || processing}
            id="payment-submit"
          >
            {processing ? '処理中...' : `${formatPrice(state.plan.reservation_fee)}を支払う`}
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
