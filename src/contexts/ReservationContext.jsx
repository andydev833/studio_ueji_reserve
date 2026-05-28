import { createContext, useContext, useReducer } from 'react';

const ReservationContext = createContext(null);

const initialState = {
  currentStep: 1,
  plan: null,
  meetingMethod: null,
  meetingDate: null,
  meetingTime: null,
  customerInfo: { name: '', email: '', phone: '', contactMethod: 'メール', notes: '' },
  childInfo: { count: 1, ages: '', shootingPeriod: '', otherNotes: '' },
  paymentCompleted: false,
  reservationId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PLAN':
      return { ...state, plan: action.payload, currentStep: 2 };
    case 'SET_MEETING_METHOD':
      return { ...state, meetingMethod: action.payload, currentStep: 3 };
    case 'SET_MEETING_DATE':
      return { ...state, meetingDate: action.payload.date, meetingTime: action.payload.time, currentStep: 4 };
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload, currentStep: 5 };
    case 'SET_CHILD_INFO':
      return { ...state, childInfo: action.payload, currentStep: 6 };
    case 'SET_PAYMENT':
      return { ...state, paymentCompleted: true, currentStep: 7 };
    case 'SET_RESERVATION_ID':
      return { ...state, reservationId: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function ReservationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ReservationContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservationContext.Provider>
  );
}

export const useReservation = () => useContext(ReservationContext);
