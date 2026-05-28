import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useReservation } from '../../contexts/ReservationContext';
import { useEventLog } from '../../contexts/EventLogContext';
import { getMeetingSlots } from '../../services/dataService';
import CustomerLayout from '../../components/customer/CustomerLayout';
import StepIndicator from '../../components/customer/StepIndicator';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Info } from 'lucide-react';

export default function MeetingDateSelect() {
  const navigate = useNavigate();
  const { state, dispatch } = useReservation();
  const { trackEvent } = useEventLog();
  const slots = getMeetingSlots();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(state.meetingDate ? new Date(state.meetingDate) : null);
  const [selectedTime, setSelectedTime] = useState(state.meetingTime || '');
  const [shootingPeriod, setShootingPeriod] = useState('');

  useEffect(() => {
    trackEvent('meeting_date_view', { step: 4 });
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, available: false, other: true });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const isPast = date < today;
      const isAvailable = !isPast && slots.available_days?.includes(dayOfWeek) &&
        !(slots.unavailable_dates || []).includes(date.toISOString().split('T')[0]);
      days.push({ day: d, date, available: isAvailable, today: date.getTime() === today.getTime() });
    }
    return days;
  }, [year, month, daysInMonth, firstDay, slots]);

  const timeSlots = useMemo(() => {
    if (!slots.available_hours) return [];
    const ts = [];
    for (let h = slots.available_hours.start; h < slots.available_hours.end; h++) {
      ts.push(`${String(h).padStart(2, '0')}:00`);
    }
    return ts;
  }, [slots]);

  const handleDateClick = (dayInfo) => {
    if (!dayInfo.available) return;
    setSelectedDate(dayInfo.date);
    setSelectedTime('');
    trackEvent('meeting_date_select', { step: 4, value: dayInfo.date.toISOString() });
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      dispatch({
        type: 'SET_MEETING_DATE',
        payload: { date: selectedDate.toISOString(), time: selectedTime }
      });
      navigate('/customer-info');
    }
  };

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const monthNames = `${year}年${month + 1}月`;

  return (
    <CustomerLayout>
      <StepIndicator currentStep={3} />
      <div className="customer-content customer-content--narrow">
        <div className="page-title-section">
          <h1>事前打ち合わせ日を選ぶ</h1>
          <p>{state.meetingMethod === 'onsite' ? '現地' : 'オンライン'}打ち合わせの日程を選択してください</p>
        </div>

        <div className="calendar">
          <div className="calendar__header">
            <button className="calendar__nav-btn" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
              <ChevronLeft size={16} />
            </button>
            <h3 className="calendar__title">{monthNames}</h3>
            <button className="calendar__nav-btn" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="calendar__grid">
            {weekdays.map(w => (
              <div key={w} className="calendar__weekday">{w}</div>
            ))}
            {calendarDays.map((dayInfo, i) => (
              <div
                key={i}
                className={`calendar__day ${dayInfo.other ? 'calendar__day--other' : ''} ${dayInfo.today ? 'calendar__day--today' : ''} ${dayInfo.available ? 'calendar__day--available' : ''} ${!dayInfo.available && dayInfo.day > 0 ? 'calendar__day--unavailable' : ''} ${selectedDate && dayInfo.date && selectedDate.toDateString() === dayInfo.date.toDateString() ? 'calendar__day--selected' : ''}`}
                onClick={() => dayInfo.day > 0 && handleDateClick(dayInfo)}
              >
                {dayInfo.day > 0 ? dayInfo.day : ''}
              </div>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-lg animate-fade-in-up">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日の空き時間
            </h3>
            <div className="time-slots">
              {timeSlots.map(time => (
                <div
                  key={time}
                  className={`time-slot ${selectedTime === time ? 'time-slot--selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group mt-xl">
          <label className="form-label">
            撮影希望時期・候補日
            <span className="form-label__optional">任意</span>
          </label>
          <textarea
            className="form-input"
            placeholder="10月の土日希望&#10;11月15日前後&#10;〇〇神社での参拝日に合わせたい&#10;まだ未定"
            value={shootingPeriod}
            onChange={(e) => setShootingPeriod(e.target.value)}
            rows={3}
          />
        </div>

        <div className="notice">
          <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>撮影日はこの画面では確定しません。事前打ち合わせにて、撮影場所・参加人数・衣装・ご希望内容を確認したうえで確定します。</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn btn--ghost" onClick={() => navigate('/meeting-method')}>
            <ArrowLeft size={16} /> 戻る
          </button>
          <button
            className="btn btn--primary btn--large"
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
            id="date-next"
          >
            次へ進む <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
