// データサービス - localStorage CRUD（将来API置換可能）
import { initialPlans } from '../data/initialPlans';
import { initialFAQ } from '../data/initialFAQ';
import { initialSiteContent, initialFormFields, initialMeetingSlots, initialImages, initialNotificationSettings } from '../data/initialSiteContent';
import { mockReservations, mockSurveys, mockEventLogs, mockABTests } from '../data/mockData';

const KEYS = {
  RESERVATIONS: 'ueji_reservations',
  EVENTS: 'ueji_events',
  PLANS: 'ueji_plans',
  FAQ: 'ueji_faq',
  SITE_CONTENT: 'ueji_site_content',
  FORM_FIELDS: 'ueji_form_fields',
  MEETING_SLOTS: 'ueji_meeting_slots',
  IMAGES: 'ueji_images',
  AB_TESTS: 'ueji_ab_tests',
  SURVEYS: 'ueji_surveys',
  NOTIFICATIONS: 'ueji_notifications',
};

// 初期化
export const initializeData = () => {
  if (!localStorage.getItem(KEYS.RESERVATIONS)) {
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(mockReservations));
  }
  if (!localStorage.getItem(KEYS.EVENTS)) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(mockEventLogs));
  }
  if (!localStorage.getItem(KEYS.PLANS)) {
    localStorage.setItem(KEYS.PLANS, JSON.stringify(initialPlans));
  }
  if (!localStorage.getItem(KEYS.FAQ)) {
    localStorage.setItem(KEYS.FAQ, JSON.stringify(initialFAQ));
  }
  if (!localStorage.getItem(KEYS.SITE_CONTENT)) {
    localStorage.setItem(KEYS.SITE_CONTENT, JSON.stringify(initialSiteContent));
  }
  if (!localStorage.getItem(KEYS.FORM_FIELDS)) {
    localStorage.setItem(KEYS.FORM_FIELDS, JSON.stringify(initialFormFields));
  }
  if (!localStorage.getItem(KEYS.MEETING_SLOTS)) {
    localStorage.setItem(KEYS.MEETING_SLOTS, JSON.stringify(initialMeetingSlots));
  }
  if (!localStorage.getItem(KEYS.IMAGES)) {
    localStorage.setItem(KEYS.IMAGES, JSON.stringify(initialImages));
  }
  if (!localStorage.getItem(KEYS.AB_TESTS)) {
    localStorage.setItem(KEYS.AB_TESTS, JSON.stringify(mockABTests));
  }
  if (!localStorage.getItem(KEYS.SURVEYS)) {
    localStorage.setItem(KEYS.SURVEYS, JSON.stringify(mockSurveys));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotificationSettings));
  }
};

// 汎用CRUD
const getData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// 予約
export const getReservations = () => getData(KEYS.RESERVATIONS);
export const getReservation = (id) => getReservations().find(r => r.reservation_id === id);
export const addReservation = (reservation) => {
  const data = getReservations();
  data.push(reservation);
  setData(KEYS.RESERVATIONS, data);
  return reservation;
};
export const updateReservation = (id, updates) => {
  const data = getReservations();
  const idx = data.findIndex(r => r.reservation_id === id);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...updates };
    setData(KEYS.RESERVATIONS, data);
    return data[idx];
  }
  return null;
};

// イベントログ
export const getEventLogs = () => getData(KEYS.EVENTS);
export const addEventLog = (event) => {
  const data = getEventLogs();
  data.push(event);
  setData(KEYS.EVENTS, data);
};

// プラン
export const getPlans = () => getData(KEYS.PLANS);
export const updatePlan = (planId, updates) => {
  const data = getPlans();
  const idx = data.findIndex(p => p.plan_id === planId);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...updates };
    setData(KEYS.PLANS, data);
  }
  return data;
};
export const setPlans = (plans) => setData(KEYS.PLANS, plans);

// FAQ
export const getFAQ = () => getData(KEYS.FAQ);
export const setFAQ = (faq) => setData(KEYS.FAQ, faq);

// サイトコンテンツ
export const getSiteContent = () => getData(KEYS.SITE_CONTENT);
export const updateSiteContent = (sectionId, updates) => {
  const data = getSiteContent();
  const idx = data.findIndex(s => s.section_id === sectionId);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...updates };
    setData(KEYS.SITE_CONTENT, data);
  }
  return data;
};
export const setSiteContent = (content) => setData(KEYS.SITE_CONTENT, content);

// フォームフィールド
export const getFormFields = () => getData(KEYS.FORM_FIELDS);
export const setFormFields = (fields) => setData(KEYS.FORM_FIELDS, fields);

// 打ち合わせ枠
export const getMeetingSlots = () => JSON.parse(localStorage.getItem(KEYS.MEETING_SLOTS) || '{}');
export const setMeetingSlots = (slots) => localStorage.setItem(KEYS.MEETING_SLOTS, JSON.stringify(slots));

// 画像
export const getImages = () => getData(KEYS.IMAGES);
export const setImages = (images) => setData(KEYS.IMAGES, images);

// ABテスト
export const getABTests = () => getData(KEYS.AB_TESTS);
export const addABTest = (test) => {
  const data = getABTests();
  data.push(test);
  setData(KEYS.AB_TESTS, data);
};
export const updateABTest = (testId, updates) => {
  const data = getABTests();
  const idx = data.findIndex(t => t.ab_test_id === testId);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...updates };
    setData(KEYS.AB_TESTS, data);
  }
  return data;
};
export const setABTests = (tests) => setData(KEYS.AB_TESTS, tests);

// アンケート
export const getSurveys = () => getData(KEYS.SURVEYS);
export const getSurvey = (reservationId) => getSurveys().find(s => s.reservation_id === reservationId);
export const addSurvey = (survey) => {
  const data = getSurveys();
  data.push(survey);
  setData(KEYS.SURVEYS, data);
};

// 通知設定
export const getNotificationSettings = () => JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '{}');
export const setNotificationSettings = (settings) => localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(settings));

// データリセット
export const resetAllData = () => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  initializeData();
};
