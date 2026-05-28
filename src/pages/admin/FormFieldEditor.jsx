import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getFormFields, setFormFields } from '../../services/dataService';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';

export default function FormFieldEditor() {
  const [fields, setFieldsState] = useState(getFormFields());
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setFormFields(fields);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (fieldId, key, value) => {
    setFieldsState(fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f));
  };

  const handleToggle = (fieldId, key) => {
    setFieldsState(fields.map(f => f.id === fieldId ? { ...f, [key]: !f[key] } : f));
  };

  const handleMove = (idx, dir) => {
    const updated = [...fields];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updated.forEach((f, i) => f.display_order = i + 1);
    setFieldsState(updated);
  };

  const handleAdd = () => {
    const newField = {
      id: `field_custom_${Date.now()}`,
      name: '新しい項目',
      type: 'text',
      required: false,
      visible: true,
      placeholder: '',
      help: '',
      options: [],
      display_order: fields.length + 1,
      track: true,
    };
    setFieldsState([...fields, newField]);
    setEditing(newField.id);
  };

  const handleRemove = (fieldId) => {
    if (confirm('この項目を削除しますか？')) {
      setFieldsState(fields.filter(f => f.id !== fieldId));
    }
  };

  const inputTypes = [
    { value: 'text', label: 'テキスト' },
    { value: 'email', label: 'メール' },
    { value: 'tel', label: '電話番号' },
    { value: 'number', label: '数値' },
    { value: 'textarea', label: 'テキストエリア' },
    { value: 'select', label: 'セレクト' },
    { value: 'radio', label: 'ラジオボタン' },
    { value: 'checkbox', label: 'チェックボックス' },
  ];

  return (
    <AdminLayout title="フォーム項目編集" subtitle="予約フォームの入力項目を管理">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--secondary" onClick={handleAdd}>
          <Plus size={16} /> 項目を追加
        </button>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました！' : '保存する'}
        </button>
      </div>

      <div className="sortable-list">
        {fields.sort((a, b) => a.display_order - b.display_order).map((field, idx) => (
          <div key={field.id} className="sortable-item" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button className="admin-btn admin-btn--ghost" style={{ padding: 2 }} onClick={() => handleMove(idx, -1)}><ChevronUp size={12} /></button>
                  <button className="admin-btn admin-btn--ghost" style={{ padding: 2 }} onClick={() => handleMove(idx, 1)}><ChevronDown size={12} /></button>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{field.name}</span>
                <span className={`status-badge ${field.required ? 'status-badge--active' : 'status-badge--info'}`}>
                  {field.required ? '必須' : '任意'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>{inputTypes.find(t => t.value === field.type)?.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn--ghost" onClick={() => handleToggle(field.id, 'visible')}>
                  {field.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button className="admin-btn admin-btn--secondary" onClick={() => setEditing(editing === field.id ? null : field.id)}>
                  編集
                </button>
                <button className="admin-btn admin-btn--ghost" onClick={() => handleRemove(field.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {editing === field.id && (
              <div className="animate-fade-in-up" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">項目名</label>
                  <input className="admin-form-input" value={field.name} onChange={e => handleEdit(field.id, 'name', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">入力タイプ</label>
                  <select className="admin-form-input" value={field.type} onChange={e => handleEdit(field.id, 'type', e.target.value)}>
                    {inputTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">プレースホルダー</label>
                  <input className="admin-form-input" value={field.placeholder || ''} onChange={e => handleEdit(field.id, 'placeholder', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">補足説明</label>
                  <input className="admin-form-input" value={field.help || ''} onChange={e => handleEdit(field.id, 'help', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 24, gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <label className="toggle"><input type="checkbox" checked={field.required} onChange={() => handleToggle(field.id, 'required')} /><span className="toggle__slider" /></label>
                    必須
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <label className="toggle"><input type="checkbox" checked={field.visible} onChange={() => handleToggle(field.id, 'visible')} /><span className="toggle__slider" /></label>
                    表示
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <label className="toggle"><input type="checkbox" checked={field.track} onChange={() => handleToggle(field.id, 'track')} /><span className="toggle__slider" /></label>
                    計測対象
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
