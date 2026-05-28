import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import { getPlans } from '../../services/dataService';
import CustomerLayout from '../../components/customer/CustomerLayout';
import StepIndicator from '../../components/customer/StepIndicator';
import { Check, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/constants';

export default function PlanSelect() {
  const navigate = useNavigate();
  const { state, dispatch } = useReservation();
  const { trackEvent } = useEventLog();
  const plans = getPlans().filter(p => p.is_active);
  const [selected, setSelected] = useState(state.plan?.plan_id || plans.find(p => p.initial_select)?.plan_id || '');

  useEffect(() => {
    trackEvent('plan_view', { step: 2 });
    trackEvent('form_start', { step: 2 });
  }, []);

  const handleSelect = (plan) => {
    setSelected(plan.plan_id);
    trackEvent('plan_select', { step: 2, value: plan.plan_name });
  };

  const handleNext = () => {
    const plan = plans.find(p => p.plan_id === selected);
    if (plan) {
      dispatch({ type: 'SET_PLAN', payload: plan });
      navigate('/meeting-method');
    }
  };

  return (
    <CustomerLayout>
      <StepIndicator currentStep={1} />
      <div className="customer-content">
        <div className="page-title-section">
          <h1>プランを選ぶ</h1>
          <p>ご家族に合ったプランをお選びください</p>
        </div>

        <div className="plan-cards">
          {plans.sort((a, b) => a.display_order - b.display_order).map(plan => (
            <div
              key={plan.plan_id}
              className={`plan-card ${plan.is_recommended ? 'plan-card--recommended' : ''} ${selected === plan.plan_id ? 'plan-card--selected' : ''}`}
              onClick={() => handleSelect(plan)}
              id={`plan-${plan.plan_id}`}
            >
              {plan.show_badge && plan.badge_text && (
                <div className="plan-card__badge">{plan.badge_text}</div>
              )}
              <h3 className="plan-card__name">{plan.plan_name}</h3>
              <p className="plan-card__desc">{plan.description}</p>
              <div className="plan-card__price">
                {formatPrice(plan.price)}<span>（税込）</span>
              </div>
              <div className="plan-card__deposit">予約金 {formatPrice(plan.reservation_fee)}</div>
              <div className="plan-card__features">
                {plan.included_items.map((item, j) => (
                  <div key={j} className="plan-card__feature">
                    <Check size={14} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="notice mt-lg">
          アルバム・台紙・祖父母向け商品・家族写真の詳細は、事前打ち合わせにて実物やサンプルを見ながらご相談いただけます。
        </div>

        <div className="text-center mt-xl">
          <button
            className="btn btn--primary btn--large"
            onClick={handleNext}
            disabled={!selected}
            id="plan-next"
          >
            次へ進む
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
