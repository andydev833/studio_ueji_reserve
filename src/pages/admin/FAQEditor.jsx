import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getFAQ, setFAQ } from '../../services/dataService';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { generateId } from '../../utils/constants';

export default function FAQEditor() {
  const [faqs, setFaqsState] = useState(getFAQ());
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setFAQ(faqs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (faqId, field, value) => {
    setFaqsState(faqs.map(f => f.id === faqId ? { ...f, [field]: value } : f));
  };

  const handleAdd = () => {
    const newFaq = {
      id: generateId('faq'),
      question: '新しい質問',
      answer: '回答を入力してください',
      display_order: faqs.length + 1,
      is_visible: true,
    };
    setFaqsState([...faqs, newFaq]);
    setEditing(newFaq.id);
  };

  const handleRemove = (faqId) => {
    if (confirm('このFAQを削除しますか？')) {
      setFaqsState(faqs.filter(f => f.id !== faqId));
    }
  };

  const handleMove = (idx, dir) => {
    const updated = [...faqs];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updated.forEach((f, i) => f.display_order = i + 1);
    setFaqsState(updated);
  };

  const handleToggleVisibility = (faqId) => {
    setFaqsState(faqs.map(f => f.id === faqId ? { ...f, is_visible: !f.is_visible } : f));
  };

  return (
    <AdminLayout title="FAQ編集" subtitle="よくある質問の追加・編集・並び替え">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--secondary" onClick={handleAdd}>
          <Plus size={16} /> FAQを追加
        </button>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました！' : '保存する'}
        </button>
      </div>

      <div className="sortable-list">
        {faqs.sort((a, b) => a.display_order - b.display_order).map((faq, idx) => (
          <div key={faq.id} className="admin-card mb-sm">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  <button className="admin-btn admin-btn--ghost" style={{ padding: 2 }} onClick={() => handleMove(idx, -1)}><ChevronUp size={12} /></button>
                  <button className="admin-btn admin-btn--ghost" style={{ padding: 2 }} onClick={() => handleMove(idx, 1)}><ChevronDown size={12} /></button>
                </div>
                <div style={{ flex: 1 }}>
                  {editing === faq.id ? (
                    <div className="animate-fade-in-up">
                      <div className="admin-form-group">
                        <label className="admin-form-label">質問</label>
                        <input className="admin-form-input" value={faq.question} onChange={e => handleEdit(faq.id, 'question', e.target.value)} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">回答</label>
                        <textarea className="admin-form-input" rows={3} value={faq.answer} onChange={e => handleEdit(faq.id, 'answer', e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        Q. {faq.question}
                        {!faq.is_visible && <span className="status-badge status-badge--cancelled" style={{ marginLeft: 8 }}>非表示</span>}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--a-text-secondary)' }}>A. {faq.answer}</p>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 12, flexShrink: 0 }}>
                <button className="admin-btn admin-btn--ghost" onClick={() => handleToggleVisibility(faq.id)}>
                  {faq.is_visible ? '表示' : '非表示'}
                </button>
                <button className="admin-btn admin-btn--secondary" onClick={() => setEditing(editing === faq.id ? null : faq.id)}>
                  {editing === faq.id ? '閉じる' : '編集'}
                </button>
                <button className="admin-btn admin-btn--ghost" onClick={() => handleRemove(faq.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
