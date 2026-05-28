import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useEventLog } from '../../contexts/EventLogContext';
import { getPlans, getFAQ, getSiteContent } from '../../services/dataService';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { Camera, ArrowRight, Check, ChevronDown, ChevronUp, MapPin, Monitor, Calendar, CreditCard, MessageCircle, Star, Users, Heart, Shield } from 'lucide-react';
import { formatPrice } from '../../utils/constants';
import { useState } from 'react';

export default function TopPage() {
  const navigate = useNavigate();
  const { trackEvent } = useEventLog();
  const [openFAQ, setOpenFAQ] = useState(null);
  const plans = getPlans().filter(p => p.is_active);
  const faqs = getFAQ().filter(f => f.is_visible);
  const content = getSiteContent();

  useEffect(() => {
    trackEvent('page_view', { step: 1, value: 'top' });
  }, []);

  const getContent = (sectionId) => content.find(c => c.section_id === sectionId) || {};

  const handleCTA = () => {
    trackEvent('cta_click', { step: 1 });
    navigate('/plan-select');
  };

  const hero = getContent('hero');
  const flowSection = getContent('flow');
  const planSection = getContent('plans');
  const meetingSection = getContent('meeting');
  const depositSection = getContent('deposit');
  const faqSection = getContent('faq');
  const ctaBottom = getContent('cta_bottom');

  const flowSteps = [
    { icon: <Star size={16} />, title: 'プランを選ぶ', desc: '3つのプランからお選びください' },
    { icon: <MessageCircle size={16} />, title: '事前打ち合わせ方法を選ぶ', desc: '現地またはオンライン' },
    { icon: <Calendar size={16} />, title: '事前打ち合わせ日を選ぶ', desc: 'カレンダーから空き日程を選択' },
    { icon: <Users size={16} />, title: 'お客様情報を入力する', desc: 'お名前・連絡先' },
    { icon: <CreditCard size={16} />, title: '予約金を支払う', desc: '撮影料金の一部に充当' },
    { icon: <MessageCircle size={16} />, title: '事前打ち合わせで撮影内容を決める', desc: '衣装・ヘアメイク・オプションを相談' },
    { icon: <Calendar size={16} />, title: '撮影日を確定する', desc: '打ち合わせ後に日程を確定' },
    { icon: <Camera size={16} />, title: '当日撮影', desc: 'リラックスして撮影を楽しむ' },
  ];

  return (
    <CustomerLayout>
      {/* ファーストビュー */}
      {hero.is_visible !== false && (
        <section className="hero">
          <div className="hero__content animate-fade-in-up">
            <div className="hero__badge">
              <Camera size={14} />
              七五三撮影予約
            </div>
            <h1 className="hero__title">{hero.title}</h1>
            <p className="hero__subtitle">{hero.body}</p>
            <p className="hero__note">{hero.sub_body}</p>
            <button className="btn btn--primary btn--large" onClick={handleCTA} id="hero-cta">
              {hero.cta_text || '七五三撮影を申し込む'}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      <div className="customer-content customer-content--wide">
        {/* 予約の流れ */}
        {flowSection.is_visible !== false && (
          <section className="section" id="flow">
            <div className="section__badge">ご予約の流れ</div>
            <h2 className="section__title">{flowSection.title || '予約の流れ'}</h2>
            <div className="flow-steps">
              {flowSteps.map((step, i) => (
                <div key={i} className="flow-step animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flow-step__number">{i + 1}</div>
                  <div className="flow-step__content">
                    <div className="flow-step__title">{step.title}</div>
                    <div className="flow-step__desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="notice mt-lg">
              <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>撮影日は、事前打ち合わせにて撮影場所・ご家族の参加状況・衣装・ご希望内容を確認したうえで確定します。</span>
            </div>
          </section>
        )}

        {/* プラン比較 */}
        {planSection.is_visible !== false && (
          <section className="section" id="plans">
            <div className="section__badge">プラン</div>
            <h2 className="section__title">{planSection.title || 'プランを選ぶ'}</h2>
            <p className="section__subtitle">{planSection.body}</p>
            <div className="plan-cards">
              {plans.sort((a, b) => a.display_order - b.display_order).map(plan => (
                <div
                  key={plan.plan_id}
                  className={`plan-card ${plan.is_recommended ? 'plan-card--recommended' : ''}`}
                  onClick={handleCTA}
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
                  <button className="btn btn--primary btn--full">
                    {plan.cta_text || 'このプランで申し込む'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 事前打ち合わせについて */}
        {meetingSection.is_visible !== false && (
          <section className="section" id="meeting">
            <div className="section__badge">事前打ち合わせ</div>
            <h2 className="section__title">{meetingSection.title}</h2>
            <div className="radio-cards mt-lg">
              <div className="radio-card">
                <div className="radio-card__icon">
                  <MapPin size={24} />
                </div>
                <div className="radio-card__title">現地で打ち合わせ</div>
                <div className="radio-card__desc">
                  スタジオの雰囲気や写真サンプル、アルバム等を見ながら詳しく相談できます。
                </div>
              </div>
              <div className="radio-card">
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
              <Heart size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{meetingSection.body}</span>
            </div>
          </section>
        )}

        {/* 予約金について */}
        {depositSection.is_visible !== false && (
          <section className="section" id="deposit">
            <div className="section__badge">予約金</div>
            <h2 className="section__title">{depositSection.title}</h2>
            <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--c-text-secondary)' }}>
                {depositSection.body}
              </p>
              <div style={{ marginTop: 16 }}>
                {plans.map(p => (
                  <div key={p.plan_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--c-border)', fontSize: 14 }}>
                    <span>{p.plan_name}</span>
                    <strong style={{ color: 'var(--c-primary)' }}>{formatPrice(p.reservation_fee)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqSection.is_visible !== false && (
          <section className="section" id="faq">
            <div className="section__badge">FAQ</div>
            <h2 className="section__title">{faqSection.title || 'よくあるご質問'}</h2>
            <div className="faq-list" style={{ maxWidth: 700, margin: '0 auto' }}>
              {faqs.sort((a, b) => a.display_order - b.display_order).map(faq => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-item__question"
                    onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  >
                    <span>Q. {faq.question}</span>
                    {openFAQ === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openFAQ === faq.id && (
                    <div className="faq-item__answer animate-fade-in-up">
                      A. {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 申込CTA */}
        {ctaBottom.is_visible !== false && (
          <section className="section text-center" id="cta-bottom" style={{ padding: '48px 0' }}>
            <h2 className="section__title">{ctaBottom.title}</h2>
            <p className="section__subtitle">{ctaBottom.body}</p>
            <button className="btn btn--primary btn--large" onClick={handleCTA} id="bottom-cta">
              {ctaBottom.cta_text || '七五三撮影を申し込む'}
              <ArrowRight size={18} />
            </button>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}
