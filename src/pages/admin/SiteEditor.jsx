import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getSiteContent, updateSiteContent, setSiteContent } from '../../services/dataService';
import { Eye, EyeOff, GripVertical, Save, ChevronDown, ChevronUp } from 'lucide-react';

export default function SiteEditor() {
  const [content, setContent] = useState(getSiteContent());
  const [editingSection, setEditingSection] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleToggleVisibility = (sectionId) => {
    const updated = content.map(s => s.section_id === sectionId ? { ...s, is_visible: !s.is_visible } : s);
    setContent(updated);
    setSiteContent(updated);
  };

  const handleEdit = (sectionId, field, value) => {
    const updated = content.map(s => s.section_id === sectionId ? { ...s, [field]: value } : s);
    setContent(updated);
  };

  const handleSave = () => {
    setSiteContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...content];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    updated.forEach((s, i) => s.display_order = i + 1);
    setContent(updated);
  };

  const handleMoveDown = (idx) => {
    if (idx === content.length - 1) return;
    const updated = [...content];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    updated.forEach((s, i) => s.display_order = i + 1);
    setContent(updated);
  };

  return (
    <AdminLayout title="サイト編集" subtitle="七五三予約ページのコンテンツを編集">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました' : '保存する'}
        </button>
      </div>

      <div className="sortable-list">
        {content.sort((a, b) => a.display_order - b.display_order).map((section, idx) => (
          <div key={section.section_id} className="admin-card mb-md">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editingSection === section.section_id ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <GripVertical size={16} style={{ color: 'var(--a-text-muted)', cursor: 'grab' }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="admin-btn admin-btn--ghost" onClick={() => handleMoveUp(idx)} style={{ padding: 4 }}><ChevronUp size={14} /></button>
                  <button className="admin-btn admin-btn--ghost" onClick={() => handleMoveDown(idx)} style={{ padding: 4 }}><ChevronDown size={14} /></button>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>{section.section_name}</h3>
                <span className={`status-badge ${section.is_visible ? 'status-badge--active' : 'status-badge--cancelled'}`}>
                  {section.is_visible ? '表示' : '非表示'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn--ghost" onClick={() => handleToggleVisibility(section.section_id)}>
                  {section.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button className="admin-btn admin-btn--secondary" onClick={() => setEditingSection(editingSection === section.section_id ? null : section.section_id)}>
                  {editingSection === section.section_id ? '閉じる' : '編集'}
                </button>
              </div>
            </div>

            {editingSection === section.section_id && (
              <div className="animate-fade-in-up">
                <div className="admin-form-group">
                  <label className="admin-form-label">見出し</label>
                  <input className="admin-form-input" value={section.title || ''} onChange={e => handleEdit(section.section_id, 'title', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">本文</label>
                  <textarea className="admin-form-input" rows={3} value={section.body || ''} onChange={e => handleEdit(section.section_id, 'body', e.target.value)} />
                </div>
                {section.cta_text !== undefined && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">CTA文言</label>
                    <input className="admin-form-input" value={section.cta_text || ''} onChange={e => handleEdit(section.section_id, 'cta_text', e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
