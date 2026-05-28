import { createContext, useContext, useCallback } from 'react';
import { addEventLog } from '../services/dataService';
import { generateId, getSessionId, getUTMParams, getDeviceType, getBrowser } from '../utils/constants';

const EventLogContext = createContext(null);

export function EventLogProvider({ children }) {
  const trackEvent = useCallback((eventName, data = {}) => {
    const utm = getUTMParams();
    const event = {
      event_id: generateId('evt'),
      event_time: new Date().toISOString(),
      session_id: getSessionId(),
      reservation_id: data.reservation_id || '',
      event_name: eventName,
      step: data.step || 0,
      value: data.value || '',
      source: data.source || utm.source,
      medium: data.medium || utm.medium,
      campaign: data.campaign || utm.campaign,
      device: data.device || getDeviceType(),
      browser: getBrowser(),
      page_url: window.location.pathname,
      ab_test_id: data.ab_test_id || '',
      ab_variant: data.ab_variant || '',
    };
    addEventLog(event);
    console.log('[Event]', eventName, event);
    return event;
  }, []);

  return (
    <EventLogContext.Provider value={{ trackEvent }}>
      {children}
    </EventLogContext.Provider>
  );
}

export const useEventLog = () => useContext(EventLogContext);
