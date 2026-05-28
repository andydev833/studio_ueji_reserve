import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getMeetingSlots, setMeetingSlots } from '../../services/dataService';
import { Save, Clock } from 'lucide-react';

export default function MeetingSlotSettings() {
  const [slots, setSlotsState] = useState(getMeetingSlots());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setMeetingSlots(slots);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field, value) => {
    setSlotsState({ ...slots, [field]: value });
  };

  const dayNames = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];

  const toggleDay = (dayNum) => {
    const days = slots.available_days || [];
    if (days.includes(dayNum)) {
      update('available_days', days.filter(d => d !== dayNum));
    } else {
      update('available_days', [...days, dayNum].sort());
    }
  };

  return (
    <AdminLayout title="打ち合わせ枠設定" subtitle="予約可能な日時とルールを設定">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '保存しました！' : '保存する'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>
            <Clock size={16} style={{ marginRight: 8 }} />
            予約可能曜日
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {dayNames.map((name, i) => (
              <button
                key={i}
                className={`admin-btn ${(slots.available_days || []).includes(i) ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                onClick={() => toggleDay(i)}
                style={{ minWidth: 60 }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>予約可能時間</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">開始時間</label>
              <select className="admin-form-input" value={slots.available_hours?.start || 10} onChange={e => update('available_hours', { ...slots.available_hours, start: parseInt(e.target.value) })}>
                {Array.from({ length: 12 }, (_, i) => i + 8).map(h => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">終了時間</label>
              <select className="admin-form-input" value={slots.available_hours?.end || 18} onChange={e => update('available_hours', { ...slots.available_hours, end: parseInt(e.target.value) })}>
                {Array.from({ length: 12 }, (_, i) => i + 10).map(h => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>枠設定</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">1枠の長さ（分）</label>
            <input className="admin-form-input" type="number" value={slots.slot_duration || 60} onChange={e => update('slot_duration', parseInt(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">バッファ時間（分）</label>
            <input className="admin-form-input" type="number" value={slots.buffer_minutes || 30} onChange={e => update('buffer_minutes', parseInt(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">受付締切（時間前）</label>
            <input className="admin-form-input" type="number" value={slots.booking_deadline_hours || 24} onChange={e => update('booking_deadline_hours', parseInt(e.target.value))} />
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card__title" style={{ marginBottom: 16 }}>1日の最大枠数</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">現地枠</label>
            <input className="admin-form-input" type="number" value={slots.onsite_slots_per_day || 3} onChange={e => update('onsite_slots_per_day', parseInt(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">オンライン枠</label>
            <input className="admin-form-input" type="number" value={slots.online_slots_per_day || 4} onChange={e => update('online_slots_per_day', parseInt(e.target.value))} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">1枠の最大受付数</label>
            <input className="admin-form-input" type="number" value={slots.max_bookings_per_slot || 1} onChange={e => update('max_bookings_per_slot', parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
