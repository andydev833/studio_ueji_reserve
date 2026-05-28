import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import CustomerLayout from '../../components/customer/CustomerLayout';
import StepIndicator from '../../components/customer/StepIndicator';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function ChildInfoForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useReservation();
  const { trackEvent } = useEventLog();
  const [form, setForm] = useState(state.childInfo);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    trackEvent('child_info_start', { step: 6 });
  }, []);

  const validate = () => {
    const e = {};
    if (!form.count || form.count < 1) e.count = 'お子さまの人数を入力してください';
    if (!form.ages.trim()) e.ages = 'お子さまの年齢を入力してください';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      trackEvent('child_info_complete', { step: 6 });
      dispatch({ type: 'SET_CHILD_INFO', payload: form });
      navigate('/payment');
    }
  };

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <CustomerLayout>
      <StepIndicator currentStep={5} />
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>お子さまの情報</h1>
          <p>撮影するお子さまの情報を入力してください</p>
        </div>

        <div className="card">
          <div className="form-group">
            <label className="form-label">
              お子さまの人数 <span className="form-label__required">必須</span>
            </label>
            <input
              className={`form-input ${errors.count ? 'form-input--error' : ''}`}
              type="number"
              min="1"
              max="5"
              value={form.count}
              onChange={e => update('count', parseInt(e.target.value) || 1)}
              id="input-child-count"
            />
            {errors.count && <div className="form-error">{errors.count}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              お子さまの年齢 <span className="form-label__required">必須</span>
            </label>
            <input
              className={`form-input ${errors.ages ? 'form-input--error' : ''}`}
              type="text"
              placeholder="3歳、5歳"
              value={form.ages}
              onChange={e => update('ages', e.target.value)}
              id="input-child-ages"
            />
            <div className="form-help">複数のお子さまの場合はカンマ区切りでご記入ください</div>
            {errors.ages && <div className="form-error">{errors.ages}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              その他伝えておきたいこと <span className="form-label__optional">任意</span>
            </label>
            <textarea
              className="form-input"
              placeholder="何かあればご記入ください"
              value={form.otherNotes}
              onChange={e => update('otherNotes', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="notice mt-lg">
          お子さまのお名前・性別・性格・衣装等の詳細は、予約完了後の事前アンケートにてお伺いします。打ち合わせをスムーズに進めるための確認となります。
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn btn--ghost" onClick={() => navigate('/customer-info')}>
            <ArrowLeft size={16} /> 戻る
          </button>
          <button className="btn btn--primary btn--large" onClick={handleNext} id="child-next">
            次へ進む <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
