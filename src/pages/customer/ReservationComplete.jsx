import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { CheckCircle, MessageCircle, FileText, Eye, ArrowRight } from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/constants';

export default function ReservationComplete() {
  const navigate = useNavigate();
  const { state } = useReservation();
  const { trackEvent } = useEventLog();

  useEffect(() => {
    if (!state.reservationId) {
      navigate('/');
    }
  }, [state.reservationId, navigate]);

  if (!state.reservationId || !state.plan) return null;

  const handleLineClick = () => {
    trackEvent('line_add_click', { step: 9, reservation_id: state.reservationId });
    alert('LINE追加画面（モック）\n実際にはLINE公式アカウントの友だち追加URLに遷移します');
  };

  const handleSurveyClick = () => {
    trackEvent('pre_survey_click', { step: 9, reservation_id: state.reservationId });
    navigate(`/survey/${state.reservationId}`);
  };

  const handleConfirmClick = () => {
    trackEvent('reservation_confirm_view', { step: 9, reservation_id: state.reservationId });
    navigate(`/confirm/${state.reservationId}`);
  };

  return (
    <CustomerLayout>
      <div className="customer-content customer-content--narrow">
        <div className="completion animate-fade-in-up">
          <div className="completion__icon">
            <CheckCircle size={40} />
          </div>
          <h1 className="completion__title">ご予約ありがとうございます</h1>
          <p className="completion__reservation-id">予約番号: {state.reservationId}</p>

          <div className="completion__details">
            <div className="completion__detail-row">
              <span className="completion__detail-label">選択プラン</span>
              <span className="completion__detail-value">{state.plan.plan_name}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">事前打ち合わせ方法</span>
              <span className="completion__detail-value">{state.meetingMethod === 'onsite' ? '現地' : 'オンライン'}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">事前打ち合わせ日時</span>
              <span className="completion__detail-value">{formatDate(state.meetingDate)} {state.meetingTime}</span>
            </div>
            <div className="completion__detail-row">
              <span className="completion__detail-label">予約金</span>
              <span className="completion__detail-value" style={{ color: 'var(--c-success)' }}>
                {formatPrice(state.plan.reservation_fee)} お支払い済み
              </span>
            </div>
          </div>

          <div className="completion__next-steps">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>次のステップ</h3>
            <div className="completion__step">
              <div className="completion__step-number">1</div>
              <div className="completion__step-text">予約内容をメールで送信しました</div>
            </div>
            <div className="completion__step">
              <div className="completion__step-number">2</div>
              <div className="completion__step-text">LINEを追加すると、打ち合わせ前の案内・リマインドを受け取れます</div>
            </div>
            <div className="completion__step">
              <div className="completion__step-number">3</div>
              <div className="completion__step-text">事前アンケートにご回答ください（打ち合わせをスムーズに進めるための確認です）</div>
            </div>
            <div className="completion__step">
              <div className="completion__step-number">4</div>
              <div className="completion__step-text">事前打ち合わせにて撮影日・撮影内容を決定します</div>
            </div>
          </div>

          <div className="completion__actions">
            <button className="btn btn--line btn--full" onClick={handleLineClick} id="line-add">
              <MessageCircle size={18} />
              LINEで案内を受け取る
            </button>
            <button className="btn btn--primary btn--full" onClick={handleSurveyClick} id="survey-start">
              <FileText size={18} />
              事前アンケートに回答する
            </button>
            <button className="btn btn--outline btn--full" onClick={handleConfirmClick} id="confirm-view">
              <Eye size={18} />
              予約内容を確認する
            </button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
