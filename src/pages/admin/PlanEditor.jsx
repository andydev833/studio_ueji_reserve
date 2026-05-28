import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getPlans, setPlans } from '../../services/dataService';
import { formatPrice } from '../../utils/constants';
import { Save, Plus, Star, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export default function PlanEditor() {
  const [plans, setPlansState] = useState(getPlans());
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setPlans(plans);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (planId, field, value) => {
    const updated = plans.map(p => p.plan_id === planId ? { ...p, [field]: value } : p);
    setPlansState(updated);
  };

  const handleToggle = (planId, field) => {
    const updated = plans.map(p => p.plan_id === planId ? { ...p, [field]: !p[field] } : p);
    setPlansState(updated);
  };

  const handleIncludedItemChange = (planId, idx, value) => {
    const updated = plans.map(p => {
      if (p.plan_id === planId) {
        const items = [...p.included_items];
        items[idx] = value;
        return { ...p, included_items: items };
      }
      return p;
    });
    setPlansState(updated);
  };

  const handleAddIncludedItem = (planId) => {
    const updated = plans.map(p => {
      if (p.plan_id === planId) {
        return { ...p, included_items: [...p.included_items, ''] };
      }
      return p;
    });
    setPlansState(updated);
  };

  const handleRemoveIncludedItem = (planId, idx) => {
    const updated = plans.map(p => {
      if (p.plan_id === planId) {
        const items = p.included_items.filter((_, i) => i !== idx);
        return { ...p, included_items: items };
      }
      return p;
    });
    setPlansState(updated);
  };

  const handleMove = (idx, direction) => {
    const updated = [...plans];
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updated.forEach((p, i) => p.display_order = i + 1);
    setPlansState(updated);
  };

  return (
    <AdminLayout title="プラン編集" subtitle="プラン情報の追加・編集">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました！' : '保存する'}
        </button>
      </div>

      {plans.sort((a, b) => a.display_order - b.display_order).map((plan, idx) => (
        <div key={plan.plan_id} className="admin-card mb-md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing === plan.plan_id ? 20 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button className="admin-btn admin-btn--ghost" style={{ padding: 2 }} onClick={() => handleMove(idx, -1)}><ChevronUp size={12} /></button>
                <button className="admin-btn admin-btn--ghost" style={{ padding: 2 }} onClick={() => handleMove(idx, 1)}><ChevronDown size={12} /></button>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {plan.plan_name}
                  {plan.is_recommended && <span className="status-badge status-badge--active"><Star size={10} /> おすすめ</span>}
                  {plan.show_badge && <span className="status-badge status-badge--warning">{plan.badge_text}</span>}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--a-text-secondary)' }}>
                  {formatPrice(plan.price)} / 予約金 {formatPrice(plan.reservation_fee)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => handleToggle(plan.plan_id, 'is_active')}>
                {plan.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button className="admin-btn admin-btn--secondary" onClick={() => setEditing(editing === plan.plan_id ? null : plan.plan_id)}>
                {editing === plan.plan_id ? '閉じる' : '編集'}
              </button>
            </div>
          </div>

          {editing === plan.plan_id && (
            <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">プラン名</label>
                <input className="admin-form-input" value={plan.plan_name} onChange={e => handleEdit(plan.plan_id, 'plan_name', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">表示ラベル</label>
                <input className="admin-form-input" value={plan.label} onChange={e => handleEdit(plan.plan_id, 'label', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">価格（税込）</label>
                <input className="admin-form-input" type="number" value={plan.price} onChange={e => handleEdit(plan.plan_id, 'price', parseInt(e.target.value) || 0)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">予約金</label>
                <input className="admin-form-input" type="number" value={plan.reservation_fee} onChange={e => handleEdit(plan.plan_id, 'reservation_fee', parseInt(e.target.value) || 0)} />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">説明文</label>
                <textarea className="admin-form-input" rows={2} value={plan.description} onChange={e => handleEdit(plan.plan_id, 'description', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">CTA文言</label>
                <input className="admin-form-input" value={plan.cta_text} onChange={e => handleEdit(plan.plan_id, 'cta_text', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">バッジ文言</label>
                <input className="admin-form-input" value={plan.badge_text || ''} onChange={e => handleEdit(plan.plan_id, 'badge_text', e.target.value)} />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">含まれる内容</label>
                {plan.included_items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input className="admin-form-input" value={item} onChange={e => handleIncludedItemChange(plan.plan_id, i, e.target.value)} />
                    <button className="admin-btn admin-btn--ghost" onClick={() => handleRemoveIncludedItem(plan.plan_id, i)}><Trash2 size={14} /></button>
                  </div>
                ))}
                <button className="admin-btn admin-btn--secondary" onClick={() => handleAddIncludedItem(plan.plan_id)}>
                  <Plus size={14} /> 項目を追加
                </button>
              </div>
              <div style={{ display: 'flex', gap: 24, gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <label className="toggle"><input type="checkbox" checked={plan.is_recommended} onChange={() => handleToggle(plan.plan_id, 'is_recommended')} /><span className="toggle__slider" /></label>
                  おすすめ強調
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <label className="toggle"><input type="checkbox" checked={plan.show_badge} onChange={() => handleToggle(plan.plan_id, 'show_badge')} /><span className="toggle__slider" /></label>
                  バッジ表示
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <label className="toggle"><input type="checkbox" checked={plan.initial_select} onChange={() => handleToggle(plan.plan_id, 'initial_select')} /><span className="toggle__slider" /></label>
                  初期選択
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <label className="toggle"><input type="checkbox" checked={plan.is_active} onChange={() => handleToggle(plan.plan_id, 'is_active')} /><span className="toggle__slider" /></label>
                  公開
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
    </AdminLayout>
  );
}
