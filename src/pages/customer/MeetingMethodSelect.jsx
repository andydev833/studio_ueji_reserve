import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import CustomerLayout from '../../components/customer/CustomerLayout';
import StepIndicator from '../../components/customer/StepIndicator';
import { MapPin, Monitor, ArrowRight, ArrowLeft, Shield } from 'lucide-react';

export default function MeetingMethodSelect() {
  const navigate = useNavigate();
  const { state, dispatch } = useReservation();
  const { trackEvent } = useEventLog();
  const [selected, setSelected] = useState(state.meetingMethod || '');

  useEffect(() => {
    trackEvent('meeting_method_view', { step: 3 });
  }, []);

  const handleSelect = (method) => {
    setSelected(method);
    trackEvent('meeting_method_select', { step: 3, value: method });
  };

  const handleNext = () => {
    if (selected) {
      dispatch({ type: 'SET_MEETING_METHOD', payload: selected });
      navigate('/meeting-date');
    }
  };

  return (
    <CustomerLayout>
      <StepIndicator currentStep={2} />
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>事前打ち合わせ方法を選ぶ</h1>
          <p>撮影内容は打ち合わせで詳しくご相談いただけます</p>
        </div>

        <div className="radio-cards">
          <div
            className={`radio-card ${selected === 'onsite' ? 'radio-card--selected' : ''}`}
            onClick={() => handleSelect('onsite')}
            id="method-onsite"
          >
            <div className="radio-card__icon">
              <MapPin size={24} />
            </div>
            <div className="radio-card__title">現地で打ち合わせ</div>
            <div className="radio-card__desc">
              スタジオの雰囲気や写真サンプル、アルバム等を見ながら詳しく相談できます。
            </div>
          </div>

          <div
            className={`radio-card ${selected === 'online' ? 'radio-card--selected' : ''}`}
            onClick={() => handleSelect('online')}
            id="method-online"
          >
            <div className="radio-card__icon">
              <Monitor size={24} />
            </div>
            <div className="radio-card__title">オンラインで打ち合わせ</div>
            <div className="radio-card__desc">
              ご自宅からスマホ・PCで相談できます。忙しい方や遠方のご家族にもおすすめです。
            </div>
          </div>
        </div>

        <div className="notice mt-lg">
          <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>撮影内容・撮影日・オプションは、事前打ち合わせで確認したうえで確定します。</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn btn--ghost" onClick={() => navigate('/plan-select')}>
            <ArrowLeft size={16} /> 戻る
          </button>
          <button
            className="btn btn--primary btn--large"
            onClick={handleNext}
            disabled={!selected}
            id="method-next"
          >
            次へ進む <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
