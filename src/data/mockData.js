import { generateId, generateReservationId, TRAFFIC_SOURCES } from '../utils/constants';

// モック予約データ（20件）
const names = ['山田太郎', '鈴木花子', '田中美咲', '佐藤健一', '高橋あゆみ', '伊藤陽子', '渡辺大輔', '小林真由', '加藤誠', '吉田さくら', '松本雄太', '井上優子', '木村拓也', '林めぐみ', '清水翔太', '森田恵子', '中村和也', '石田美香', '前田隆志', '藤田里奈'];
const emails = names.map((n, i) => `user${i + 1}@example.com`);
const phones = names.map((_, i) => `090-${String(1000 + i).padStart(4, '0')}-${String(5000 + i).padStart(4, '0')}`);
const statuses = ['payment_completed', 'before_meeting', 'survey_pending', 'meeting_done', 'date_adjusting', 'date_confirmed', 'contract_confirmed', 'before_shooting', 'shooting_done', 'delivered', 'payment_completed', 'before_meeting', 'meeting_done', 'date_confirmed', 'contract_confirmed', 'cancelled', 'lost', 'payment_completed', 'before_meeting', 'survey_pending'];
const plans = ['plan_light', 'plan_standard', 'plan_premium', 'plan_standard', 'plan_standard', 'plan_premium', 'plan_light', 'plan_standard', 'plan_premium', 'plan_standard', 'plan_standard', 'plan_light', 'plan_standard', 'plan_premium', 'plan_standard', 'plan_light', 'plan_standard', 'plan_standard', 'plan_premium', 'plan_light'];
const planNames = { plan_light: 'ライトプラン', plan_standard: 'スタンダードプラン', plan_premium: 'プレミアムプラン' };
const fees = { plan_light: 5000, plan_standard: 10000, plan_premium: 15000 };
const methods = ['onsite', 'online', 'onsite', 'online', 'onsite', 'onsite', 'online', 'onsite', 'online', 'onsite', 'online', 'onsite', 'onsite', 'online', 'online', 'onsite', 'online', 'onsite', 'online', 'onsite'];
const sources = ['Instagram', 'Google検索', 'Google広告', 'LINE', 'チラシQR', 'Instagram', 'Google検索', '紹介URL', '既存HP', '七五三LP', 'Instagram', 'Google検索', 'LINE', 'Google広告', '紹介URL', 'Instagram', 'Google検索', 'チラシQR', '既存HP', 'Instagram'];

const now = new Date();
const day = (daysAgo) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const futureDay = (daysLater, hour = 10) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysLater);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const mockReservations = names.map((name, i) => ({
  reservation_id: `SU2605-${String(1001 + i).padStart(4, '0')}`,
  created_at: day(30 - i),
  customer_name: name,
  email: emails[i],
  phone: phones[i],
  preferred_contact_method: i % 3 === 0 ? 'LINE' : 'メール',
  plan_id: plans[i],
  plan_name: planNames[plans[i]],
  meeting_method: methods[i],
  meeting_date: futureDay(i + 1),
  meeting_time: `${10 + (i % 4)}:00`,
  shooting_preferred_period: i % 2 === 0 ? '10月の土日希望' : '11月中旬希望',
  child_count: i % 3 === 0 ? 2 : 1,
  child_ages: i % 3 === 0 ? '3歳, 5歳' : `${3 + (i % 3) * 2}歳`,
  reservation_fee: fees[plans[i]],
  payment_status: statuses[i] === 'payment_pending' ? 'pending' : 'completed',
  reservation_status: statuses[i],
  source: sources[i],
  medium: 'organic',
  campaign: '',
  device: i % 3 === 0 ? 'desktop' : 'mobile',
  ab_test_id: '',
  ab_variant: '',
  notes: '',
  line_added: i % 4 === 0,
  survey_completed: ['meeting_done', 'date_adjusting', 'date_confirmed', 'contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(statuses[i]),
  // 打ち合わせ情報
  meeting_online_url: methods[i] === 'online' ? 'https://meet.google.com/mock-meeting' : '',
  meeting_status: ['meeting_done', 'date_adjusting', 'date_confirmed', 'contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(statuses[i]) ? 'completed' : 'scheduled',
  meeting_staff: i % 2 === 0 ? '上江洲' : '田中',
  meeting_notes: '',
  next_action: '',
  // 撮影情報
  shooting_date: ['date_confirmed', 'contract_confirmed', 'before_shooting', 'shooting_done', 'delivered'].includes(statuses[i]) ? futureDay(30 + i) : '',
  shooting_time: '10:00',
  shooting_location: 'スタジオうえじ',
  // 提案・見積
  final_plan: plans[i],
  proposed_options: [],
  confirmed_options: [],
  estimated_amount: 0,
  final_amount: 0,
  discount: 0,
  remaining_amount: 0,
  lost_reason: statuses[i] === 'lost' ? '他社を選択' : '',
}));

// モック事前アンケート
export const mockSurveys = mockReservations
  .filter(r => r.survey_completed)
  .map(r => ({
    reservation_id: r.reservation_id,
    child_name: '太郎',
    child_gender: '男の子',
    child_personality: 'やんちゃ',
    siblings: r.child_count > 1 ? 'あり' : 'なし',
    grandparents_join: Math.random() > 0.4 ? 'はい' : 'いいえ',
    family_photo_interest: 'はい',
    costume_status: '持ち込み衣装あり',
    hair_make_interest: 'おまかせしたい',
    preferred_location: 'スタジオ',
    shrine_plan: '〇〇神社で参拝予定',
    desired_mood: '自然な笑顔',
    concerns: '人見知りが心配',
    album_interest: Math.random() > 0.3 ? 'はい' : 'いいえ',
    grandparent_gift_interest: Math.random() > 0.5 ? 'はい' : 'いいえ',
    three_generation_photo_interest: Math.random() > 0.4 ? 'はい' : 'いいえ',
  }));

// モックイベントログ
const eventNames = ['page_view', 'cta_click', 'form_start', 'plan_view', 'plan_select', 'meeting_method_view', 'meeting_method_select', 'meeting_date_view', 'meeting_date_select', 'customer_info_start', 'customer_info_complete', 'child_info_start', 'child_info_complete', 'payment_start', 'payment_complete', 'reservation_complete', 'line_add_click', 'pre_survey_click', 'pre_survey_start', 'pre_survey_complete'];

export const mockEventLogs = [];
// 各予約に対応するイベントログを生成
for (let r = 0; r < mockReservations.length; r++) {
  const res = mockReservations[r];
  const completedIndex = statuses[r] === 'cancelled' || statuses[r] === 'lost' ? 10 : 16;
  const sessionId = `sess-mock-${r}`;
  
  for (let e = 0; e < Math.min(completedIndex, eventNames.length); e++) {
    const eventTime = new Date(res.created_at);
    eventTime.setMinutes(eventTime.getMinutes() + e * 2);
    mockEventLogs.push({
      event_id: generateId('evt'),
      event_time: eventTime.toISOString(),
      session_id: sessionId,
      reservation_id: e >= 4 ? res.reservation_id : '',
      event_name: eventNames[e],
      step: e + 1,
      value: eventNames[e] === 'plan_select' ? res.plan_name : '',
      source: res.source,
      medium: res.medium,
      campaign: res.campaign,
      device: res.device,
      browser: 'Chrome',
      page_url: '/',
      ab_test_id: '',
      ab_variant: '',
    });
  }
}

// 追加のpage_viewイベント（離脱ユーザー）
for (let i = 0; i < 50; i++) {
  const src = TRAFFIC_SOURCES[Math.floor(Math.random() * TRAFFIC_SOURCES.length)];
  const daysAgo = Math.floor(Math.random() * 30);
  const eventTime = new Date(now);
  eventTime.setDate(eventTime.getDate() - daysAgo);
  
  mockEventLogs.push({
    event_id: generateId('evt'),
    event_time: eventTime.toISOString(),
    session_id: `sess-visitor-${i}`,
    reservation_id: '',
    event_name: 'page_view',
    step: 1,
    value: '',
    source: src,
    medium: 'organic',
    campaign: '',
    device: Math.random() > 0.4 ? 'mobile' : 'desktop',
    browser: 'Chrome',
    page_url: '/',
    ab_test_id: '',
    ab_variant: '',
  });
  
  // 一部はCTAまで到達
  if (Math.random() > 0.4) {
    mockEventLogs.push({
      event_id: generateId('evt'),
      event_time: new Date(eventTime.getTime() + 30000).toISOString(),
      session_id: `sess-visitor-${i}`,
      reservation_id: '',
      event_name: 'cta_click',
      step: 2,
      value: '',
      source: src,
      medium: 'organic',
      campaign: '',
      device: Math.random() > 0.4 ? 'mobile' : 'desktop',
      browser: 'Chrome',
      page_url: '/',
      ab_test_id: '',
      ab_variant: '',
    });
  }
  
  // 一部はフォーム開始
  if (Math.random() > 0.6) {
    mockEventLogs.push({
      event_id: generateId('evt'),
      event_time: new Date(eventTime.getTime() + 60000).toISOString(),
      session_id: `sess-visitor-${i}`,
      reservation_id: '',
      event_name: 'form_start',
      step: 3,
      value: '',
      source: src,
      medium: 'organic',
      campaign: '',
      device: Math.random() > 0.4 ? 'mobile' : 'desktop',
      browser: 'Chrome',
      page_url: '/plan-select',
      ab_test_id: '',
      ab_variant: '',
    });
  }
}

// ABテスト初期データ
export const mockABTests = [
  {
    ab_test_id: 'ab-001',
    test_name: 'CTAボタン文言テスト',
    page: 'shichigosan',
    target_element: 'cta_text',
    pattern_a: '七五三撮影を申し込む',
    pattern_b: '事前打ち合わせ日を選ぶ',
    traffic_split: 50,
    start_date: day(14),
    end_date: futureDay(14),
    success_metric: 'cta_click_rate',
    status: 'running',
    results: {
      a_views: 234,
      b_views: 228,
      a_conversions: 45,
      b_conversions: 62,
    }
  },
  {
    ab_test_id: 'ab-002',
    test_name: 'スタンダードプラン強調表示テスト',
    page: 'shichigosan',
    target_element: 'plan_highlight',
    pattern_a: '強調なし（3プラン均等）',
    pattern_b: '強調あり（スタンダード拡大）',
    traffic_split: 50,
    start_date: day(7),
    end_date: futureDay(21),
    success_metric: 'plan_select_rate',
    status: 'running',
    results: {
      a_views: 120,
      b_views: 118,
      a_conversions: 28,
      b_conversions: 41,
    }
  },
  {
    ab_test_id: 'ab-003',
    test_name: '予約金説明文テスト',
    page: 'shichigosan',
    target_element: 'deposit_description',
    pattern_a: '予約金は撮影料金の一部に充当されます',
    pattern_b: '予約金は撮影当日のお支払いから差し引かれます。実質負担ゼロ！',
    traffic_split: 50,
    start_date: day(21),
    end_date: day(7),
    success_metric: 'payment_complete_rate',
    status: 'completed',
    results: {
      a_views: 180,
      b_views: 175,
      a_conversions: 42,
      b_conversions: 55,
    }
  },
];
