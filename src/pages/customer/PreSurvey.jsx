import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEventLog } from '../../contexts/EventLogContext';
import { addSurvey, getReservation } from '../../services/dataService';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PreSurvey() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { trackEvent } = useEventLog();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    child_name: '', child_gender: '', child_personality: '',
    siblings: '', grandparents_join: '', family_photo_interest: '',
    costume_status: '', hair_make_interest: '', preferred_location: '',
    shrine_plan: '', desired_mood: '', concerns: '',
    album_interest: '', grandparent_gift_interest: '', three_generation_photo_interest: '',
  });

  useEffect(() => {
    trackEvent('pre_survey_start', { reservation_id: reservationId });
  }, []);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    addSurvey({ reservation_id: reservationId, ...form });
    trackEvent('pre_survey_complete', { reservation_id: reservationId });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <CustomerLayout>
        <div className="customer-content customer-content--narrow">
          <div className="completion animate-fade-in-up">
            <div className="completion__icon">
              <CheckCircle size={40} />
            </div>
            <h1 className="completion__title">アンケートを送信しました</h1>
            <p style={{ color: 'var(--c-text-secondary)', marginBottom: 32 }}>
              ご回答ありがとうございます。事前打ち合わせにて、回答内容をもとにご相談させていただきます。
            </p>
            <button className="btn btn--primary" onClick={() => navigate(`/confirm/${reservationId}`)}>
              予約内容を確認する <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const RadioGroup = ({ label, field, options }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button
            key={opt}
            className={`btn ${form[field] === opt ? 'btn--primary' : 'btn--outline'}`}
            style={{ padding: '8px 16px', fontSize: 13 }}
            onClick={() => update(field, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <CustomerLayout>
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>事前アンケート</h1>
          <p>打ち合わせをスムーズに進めるための確認です</p>
        </div>

        <div className="notice mb-lg">
          ご回答いただいた内容をもとに、事前打ち合わせで最適なご提案をさせていただきます。すべて任意ですので、分かる範囲でお答えください。
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--c-primary)' }}>お子さまについて</h3>
          <div className="form-group">
            <label className="form-label">お子さまのお名前</label>
            <input className="form-input" placeholder="太郎" value={form.child_name} onChange={e => update('child_name', e.target.value)} />
          </div>
          <RadioGroup label="お子さまの性別" field="child_gender" options={['男の子', '女の子']} />
          <div className="form-group">
            <label className="form-label">お子さまの性格</label>
            <input className="form-input" placeholder="例: やんちゃ、おとなしめ、人見知り" value={form.child_personality} onChange={e => update('child_personality', e.target.value)} />
          </div>
          <RadioGroup label="兄弟姉妹の有無" field="siblings" options={['あり', 'なし']} />
        </div>

        <div className="card mt-lg">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--c-primary)' }}>ご家族・撮影について</h3>
          <RadioGroup label="祖父母の参加予定" field="grandparents_join" options={['はい', 'いいえ', '未定']} />
          <RadioGroup label="家族写真の希望" field="family_photo_interest" options={['はい', 'いいえ', '未定']} />
          <RadioGroup label="衣装の有無" field="costume_status" options={['持ち込み衣装あり', 'レンタル希望', '相談したい']} />
          <RadioGroup label="ヘアメイク希望" field="hair_make_interest" options={['おまかせしたい', '自分でする', '相談したい']} />
          <div className="form-group">
            <label className="form-label">撮影希望場所</label>
            <input className="form-input" placeholder="例: スタジオ、屋外、神社" value={form.preferred_location} onChange={e => update('preferred_location', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">参拝予定の神社</label>
            <input className="form-input" placeholder="例: 〇〇神社" value={form.shrine_plan} onChange={e => update('shrine_plan', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">撮影で残したい雰囲気</label>
            <input className="form-input" placeholder="例: 自然な笑顔、きちんとした感じ、家族の温かさ" value={form.desired_mood} onChange={e => update('desired_mood', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">不安なこと</label>
            <textarea className="form-input" placeholder="例: 人見知りが心配、じっとしていられるか心配" value={form.concerns} onChange={e => update('concerns', e.target.value)} rows={2} />
          </div>
        </div>

        <div className="card mt-lg">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--c-primary)' }}>商品について</h3>
          <p style={{ fontSize: 13, color: 'var(--c-text-secondary)', marginBottom: 16 }}>事前打ち合わせにて、実物やサンプルを見ながらご検討いただけます。</p>
          <RadioGroup label="アルバムに興味がありますか？" field="album_interest" options={['はい', 'いいえ', '実物を見て考えたい']} />
          <RadioGroup label="祖父母向け台紙・ミニアルバムに興味がありますか？" field="grandparent_gift_interest" options={['はい', 'いいえ', '実物を見て考えたい']} />
          <RadioGroup label="三世代写真に興味がありますか？" field="three_generation_photo_interest" options={['はい', 'いいえ', '未定']} />
        </div>

        <div className="text-center mt-xl">
          <button className="btn btn--primary btn--large" onClick={handleSubmit} id="survey-submit">
            アンケートを送信する <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
