// ユーティリティ関数

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${formatDate(dateStr)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const formatPrice = (price) => {
  if (price == null) return '-';
  return `¥${Number(price).toLocaleString()}`;
};

export const generateId = (prefix = '') => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${ts}-${rand}` : `${ts}-${rand}`;
};

export const generateReservationId = () => {
  const y = new Date().getFullYear().toString().slice(-2);
  const m = String(new Date().getMonth() + 1).padStart(2, '0');
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `SU${y}${m}-${num}`;
};

export const getSessionId = () => {
  let sid = sessionStorage.getItem('session_id');
  if (!sid) {
    sid = generateId('sess');
    sessionStorage.setItem('session_id', sid);
  }
  return sid;
};

export const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'none',
    campaign: params.get('utm_campaign') || '',
  };
};

export const getDeviceType = () => {
  return window.innerWidth <= 768 ? 'mobile' : 'desktop';
};

export const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
};

// ステータス定義
export const RESERVATION_STATUSES = [
  { id: 'temporary', label: '仮申込', color: 'pending' },
  { id: 'payment_pending', label: '予約金決済待ち', color: 'warning' },
  { id: 'payment_completed', label: '予約金決済済', color: 'active' },
  { id: 'before_meeting', label: '打ち合わせ前', color: 'info' },
  { id: 'survey_pending', label: '事前アンケート待ち', color: 'warning' },
  { id: 'meeting_done', label: '打ち合わせ済', color: 'completed' },
  { id: 'date_adjusting', label: '撮影日調整中', color: 'info' },
  { id: 'date_confirmed', label: '撮影日確定', color: 'active' },
  { id: 'option_proposed', label: 'オプション提案済', color: 'info' },
  { id: 'contract_confirmed', label: '成約確定', color: 'active' },
  { id: 'before_shooting', label: '撮影前', color: 'info' },
  { id: 'shooting_done', label: '撮影済', color: 'completed' },
  { id: 'delivered', label: '納品済', color: 'completed' },
  { id: 'cancelled', label: 'キャンセル', color: 'cancelled' },
  { id: 'lost', label: '失注', color: 'cancelled' },
];

export const getStatusLabel = (statusId) => {
  const s = RESERVATION_STATUSES.find(st => st.id === statusId);
  return s ? s.label : statusId;
};

export const getStatusColor = (statusId) => {
  const s = RESERVATION_STATUSES.find(st => st.id === statusId);
  return s ? s.color : 'pending';
};

// イベント名定義
export const EVENT_NAMES = [
  'page_view', 'cta_click', 'form_start', 'plan_view', 'plan_select',
  'meeting_method_view', 'meeting_method_select', 'meeting_date_view',
  'meeting_date_select', 'customer_info_start', 'customer_info_complete',
  'child_info_start', 'child_info_complete', 'payment_start', 'payment_complete',
  'reservation_complete', 'line_add_click', 'pre_survey_click',
  'pre_survey_start', 'pre_survey_complete', 'reservation_confirm_view',
  'admin_status_update', 'meeting_completed', 'shooting_date_confirmed',
  'option_proposed', 'option_purchased', 'contract_confirmed',
  'cancellation', 'lost'
];

// 流入元定義
export const TRAFFIC_SOURCES = [
  'Instagram', 'Google検索', 'Google広告', 'LINE', 'チラシQR',
  '名刺QR', '紹介URL', '既存HP', '七五三LP', 'direct'
];
