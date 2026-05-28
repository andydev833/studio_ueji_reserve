// 初期サイトコンテンツ
export const initialSiteContent = [
  {
    page_id: 'shichigosan',
    section_id: 'hero',
    section_name: 'ファーストビュー',
    title: 'スタジオうえじ 七五三撮影予約',
    body: '七五三撮影のお申込みと事前打ち合わせ予約ができます',
    sub_body: '撮影日は、事前打ち合わせにて内容を確認したうえで確定します',
    image_url: '',
    cta_text: '七五三撮影を申し込む',
    display_order: 1,
    is_visible: true,
  },
  {
    page_id: 'shichigosan',
    section_id: 'flow',
    section_name: '予約の流れ',
    title: '予約の流れ',
    body: '',
    image_url: '',
    cta_text: '',
    display_order: 2,
    is_visible: true,
  },
  {
    page_id: 'shichigosan',
    section_id: 'plans',
    section_name: 'プラン比較',
    title: 'プランを選ぶ',
    body: 'アルバム・台紙・祖父母向け商品・家族写真の詳細は、事前打ち合わせにて実物やサンプルを見ながらご相談いただけます。',
    image_url: '',
    cta_text: '',
    display_order: 3,
    is_visible: true,
  },
  {
    page_id: 'shichigosan',
    section_id: 'meeting',
    section_name: '事前打ち合わせについて',
    title: '事前打ち合わせについて',
    body: '事前打ち合わせでは、撮影内容・衣装・ヘアメイク・アルバムなどをじっくりご相談いただけます。現地では写真サンプルやアルバムの実物をご覧いただけます。',
    image_url: '',
    cta_text: '',
    display_order: 4,
    is_visible: true,
  },
  {
    page_id: 'shichigosan',
    section_id: 'deposit',
    section_name: '予約金について',
    title: '予約金について',
    body: '七五三撮影のお申込みには、予約金のお支払いが必要です。予約金は撮影料金の一部として充当されます。事前打ち合わせ後、撮影日・撮影内容・オプションを確定いたします。',
    image_url: '',
    cta_text: '',
    display_order: 5,
    is_visible: true,
  },
  {
    page_id: 'shichigosan',
    section_id: 'faq',
    section_name: 'FAQ',
    title: 'よくあるご質問',
    body: '',
    image_url: '',
    cta_text: '',
    display_order: 6,
    is_visible: true,
  },
  {
    page_id: 'shichigosan',
    section_id: 'cta_bottom',
    section_name: '申込CTA',
    title: '七五三の思い出を、最高の形で残しませんか？',
    body: 'まずは事前打ち合わせの日程をお選びください。撮影内容は打ち合わせでじっくりご相談いただけます。',
    image_url: '',
    cta_text: '七五三撮影を申し込む',
    display_order: 7,
    is_visible: true,
  },
];

// フォームフィールド定義
export const initialFormFields = [
  { id: 'field_name', name: 'お名前', type: 'text', required: true, visible: true, placeholder: '山田 太郎', help: '', display_order: 1, track: true },
  { id: 'field_email', name: 'メールアドレス', type: 'email', required: true, visible: true, placeholder: 'example@email.com', help: '', display_order: 2, track: true },
  { id: 'field_phone', name: '電話番号', type: 'tel', required: true, visible: true, placeholder: '090-1234-5678', help: '', display_order: 3, track: true },
  { id: 'field_contact_method', name: '連絡方法', type: 'select', required: false, visible: true, placeholder: '', help: 'LINEを追加いただくと、打ち合わせ前のご案内やリマインドを受け取れます。', options: ['LINE', 'メール'], display_order: 4, track: true },
  { id: 'field_child_count', name: 'お子さまの人数', type: 'number', required: true, visible: true, placeholder: '1', help: '', display_order: 5, track: true },
  { id: 'field_child_ages', name: 'お子さまの年齢', type: 'text', required: true, visible: true, placeholder: '3歳、5歳', help: '複数のお子さまの場合はカンマ区切り', display_order: 6, track: true },
  { id: 'field_shooting_period', name: '撮影希望時期・候補日', type: 'textarea', required: false, visible: true, placeholder: '10月の土日希望\n11月15日前後\nまだ未定', help: '撮影日はこの画面では確定しません。事前打ち合わせにて確定します。', display_order: 7, track: true },
  { id: 'field_notes', name: '備考', type: 'textarea', required: false, visible: true, placeholder: '何かあればご記入ください', help: '', display_order: 8, track: true },
];

// 打ち合わせ枠設定
export const initialMeetingSlots = {
  available_days: [1, 2, 3, 4, 5, 6], // 0=日, 1=月...6=土
  available_hours: { start: 10, end: 18 },
  slot_duration: 60, // 分
  onsite_slots_per_day: 3,
  online_slots_per_day: 4,
  booking_deadline_hours: 24,
  unavailable_dates: [],
  buffer_minutes: 30,
  max_bookings_per_slot: 1,
};

// 画像設定
export const initialImages = [
  { id: 'img_hero', name: 'ファーストビュー画像', url: '', category: 'hero' },
  { id: 'img_plan_light', name: 'ライトプラン画像', url: '', category: 'plan' },
  { id: 'img_plan_standard', name: 'スタンダードプラン画像', url: '', category: 'plan' },
  { id: 'img_plan_premium', name: 'プレミアムプラン画像', url: '', category: 'plan' },
  { id: 'img_family', name: '家族写真サンプル', url: '', category: 'sample' },
  { id: 'img_album', name: 'アルバム写真', url: '', category: 'sample' },
  { id: 'img_grandparents', name: '祖父母写真', url: '', category: 'sample' },
  { id: 'img_studio', name: 'スタジオ内観', url: '', category: 'studio' },
];

// 通知設定
export const initialNotificationSettings = {
  admin: [
    { id: 'notif_new_reservation', name: '新規予約', email: true, in_app: true, line: false },
    { id: 'notif_payment_complete', name: '決済完了', email: true, in_app: true, line: false },
    { id: 'notif_payment_failed', name: '決済失敗', email: true, in_app: true, line: false },
    { id: 'notif_survey_complete', name: '事前アンケート回答', email: false, in_app: true, line: false },
    { id: 'notif_meeting_tomorrow', name: '打ち合わせ前日', email: true, in_app: true, line: false },
    { id: 'notif_meeting_incomplete', name: '打ち合わせ未完了', email: true, in_app: true, line: false },
    { id: 'notif_shooting_before', name: '撮影日前', email: true, in_app: true, line: false },
    { id: 'notif_cancellation', name: 'キャンセル発生', email: true, in_app: true, line: false },
  ],
  customer: [
    { id: 'cnotif_reservation_complete', name: '予約完了', email: true, line: true },
    { id: 'cnotif_line_promotion', name: 'LINE追加促進', email: true, line: false },
    { id: 'cnotif_survey_request', name: '事前アンケート依頼', email: true, line: true },
    { id: 'cnotif_meeting_tomorrow', name: '打ち合わせ前日', email: true, line: true },
    { id: 'cnotif_date_confirmed', name: '撮影日確定', email: true, line: true },
    { id: 'cnotif_shooting_3days', name: '撮影3日前', email: true, line: true },
    { id: 'cnotif_shooting_after', name: '撮影後', email: true, line: true },
    { id: 'cnotif_delivery_after', name: '納品後', email: true, line: true },
  ],
};
