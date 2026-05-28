import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImages, setImages } from '../../services/dataService';
import { Save, Image as ImageIcon, Upload } from 'lucide-react';

export default function ImageEditor() {
  const [images, setImagesState] = useState(getImages());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setImages(images);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUrlChange = (imageId, url) => {
    setImagesState(images.map(img => img.id === imageId ? { ...img, url } : img));
  };

  const categories = {
    hero: 'ファーストビュー',
    plan: 'プラン',
    sample: 'サンプル写真',
    studio: 'スタジオ',
  };

  const grouped = Object.entries(categories).map(([key, label]) => ({
    label,
    images: images.filter(img => img.category === key),
  }));

  return (
    <AdminLayout title="画像編集" subtitle="サイト画像のURL管理">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました！' : '保存する'}
        </button>
      </div>

      {grouped.map(group => (
        <div key={group.label} className="admin-card mb-lg">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>{group.label}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {group.images.map(img => (
              <div key={img.id} style={{ border: '1px solid var(--a-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ height: 160, background: 'var(--a-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {img.url ? (
                    <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--a-text-muted)' }}>
                      <ImageIcon size={32} />
                      <p style={{ fontSize: 11, marginTop: 4 }}>画像未設定</p>
                    </div>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{img.name}</p>
                  <input
                    className="admin-form-input"
                    style={{ fontSize: 12 }}
                    placeholder="画像URLを入力"
                    value={img.url}
                    onChange={e => handleUrlChange(img.id, e.target.value)}
                  />
                  <p style={{ fontSize: 11, color: 'var(--a-text-muted)', marginTop: 4 }}>
                    ※本番ではアップロード機能を実装予定
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
