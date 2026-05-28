import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import CustomerLayout from '../../components/customer/CustomerLayout';
import StepIndicator from '../../components/customer/StepIndicator';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function CustomerInfoForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useReservation();
  const { trackEvent } = useEventLog();
  const [form, setForm] = useState(state.customerInfo);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    trackEvent('customer_info_start', { step: 5 });
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'お名前を入力してください';
    if (!form.email.trim()) e.email = 'メールアドレスを入力してください';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '正しいメールアドレスを入力してください';
    if (!form.phone.trim()) e.phone = '電話番号を入力してください';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      trackEvent('customer_info_complete', { step: 5 });
      dispatch({ type: 'SET_CUSTOMER_INFO', payload: form });
      navigate('/child-info');
    }
  };

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <CustomerLayout>
      <StepIndicator currentStep={4} />
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>お客様情報の入力</h1>
          <p>ご連絡先を入力してください</p>
        </div>

        <div className="card">
          <div className="form-group">
            <label className="form-label">
              お名前 <span className="form-label__required">必須</span>
            </label>
            <input
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              type="text"
              placeholder="山田 太郎"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              id="input-name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              メールアドレス <span className="form-label__required">必須</span>
            </label>
            <input
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              id="input-email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              電話番号 <span className="form-label__required">必須</span>
            </label>
            <input
              className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
              type="tel"
              placeholder="090-1234-5678"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              id="input-phone"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              ご連絡方法 <span className="form-label__optional">任意</span>
            </label>
            <select
              className="form-input"
              value={form.contactMethod}
              onChange={e => update('contactMethod', e.target.value)}
            >
              <option value="メール">メール</option>
              <option value="LINE">LINE</option>
            </select>
            <div className="form-help">
              LINEを追加いただくと、打ち合わせ前のご案内やリマインドを受け取れます。
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              備考 <span className="form-label__optional">任意</span>
            </label>
            <textarea
              className="form-input"
              placeholder="何かあればご記入ください"
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn btn--ghost" onClick={() => navigate('/meeting-date')}>
            <ArrowLeft size={16} /> 戻る
          </button>
          <button className="btn btn--primary btn--large" onClick={handleNext} id="customer-next">
            次へ進む <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
