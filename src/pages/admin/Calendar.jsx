import { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReservations } from '../../services/dataService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const reservations = getReservations();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('month');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const getEventsForDate = (date) => {
    const dateStr = date.toDateString();
    const meetings = reservations.filter(r => r.meeting_date && new Date(r.meeting_date).toDateString() === dateStr);
    const shootings = reservations.filter(r => r.shooting_date && new Date(r.shooting_date).toDateString() === dateStr);
    return { meetings, shootings };
  };

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [year, month, daysInMonth, firstDay]);

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date().toDateString();

  return (
    <AdminLayout title="カレンダー" subtitle="打ち合わせ・撮影スケジュール">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['month', 'week'].map(v => (
          <button key={v} className={`admin-btn ${view === v ? 'admin-btn--primary' : 'admin-btn--secondary'}`} onClick={() => setView(v)}>
            {v === 'month' ? '月表示' : '週表示'}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button className="admin-btn admin-btn--secondary" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
            <ChevronLeft size={16} />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>{year}年{month + 1}月</h2>
          <button className="admin-btn admin-btn--secondary" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--a-border)' }}>
          {weekdays.map(w => (
            <div key={w} style={{ background: 'var(--a-bg)', padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--a-text-secondary)' }}>
              {w}
            </div>
          ))}
          {calendarDays.map((date, i) => {
            if (!date) return <div key={i} style={{ background: 'white', minHeight: 100 }} />;
            const { meetings, shootings } = getEventsForDate(date);
            const isToday = date.toDateString() === today;
            return (
              <div key={i} style={{ background: isToday ? '#EFF6FF' : 'white', minHeight: 100, padding: 4 }}>
                <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--a-primary)' : 'var(--a-text)', marginBottom: 4, textAlign: 'right', padding: '2px 4px' }}>
                  {date.getDate()}
                </div>
                {meetings.map(m => (
                  <div key={m.reservation_id} className={`admin-calendar__event ${m.meeting_method === 'onsite' ? 'admin-calendar__event--meeting' : 'admin-calendar__event--tentative'}`}>
                    {m.meeting_time} {m.customer_name}
                  </div>
                ))}
                {shootings.map(s => (
                  <div key={s.reservation_id} className="admin-calendar__event admin-calendar__event--shooting">
                    📷 {s.customer_name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12 }}>
          <span><span className="admin-calendar__event admin-calendar__event--meeting" style={{ display: 'inline-block' }}>●</span> 現地打ち合わせ</span>
          <span><span className="admin-calendar__event admin-calendar__event--tentative" style={{ display: 'inline-block' }}>●</span> オンライン打ち合わせ</span>
          <span><span className="admin-calendar__event admin-calendar__event--shooting" style={{ display: 'inline-block' }}>●</span> 撮影</span>
        </div>
      </div>
    </AdminLayout>
  );
}
