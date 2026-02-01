'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  MoveState,
  MoveBasics,
  Room,
  SpecialItem,
  AdditionalService,
  MoveEstimate,
  BoxCounts,
  ContactInfo,
  ContactPreferences,
  FurnitureItem,
  BoxEstimates,
} from '@/types';
import { DEFAULT_SPECIAL_ITEMS, DEFAULT_SERVICES } from '@/lib/constants';

const STORAGE_KEY = 'moving-funnel-state';

const initialState: MoveState = {
  currentStep: 'landing',
  completedSteps: [],

  basics: {
    fromAddress: null,
    toAddress: null,
    routeInfo: null,
    moveDate: null,
    isFlexible: false,
    homeSize: null,
  },

  rooms: [],

  specialItems: DEFAULT_SPECIAL_ITEMS,
  services: DEFAULT_SERVICES,

  estimate: null,
  boxCounts: null,

  contactInfo: null,
  contactPreferences: {
    method: 'call',
    bestTime: 'anytime',
    consentToContact: true,
  },

  selectedMovers: [],

  exitIntentShown: false,
  emailCaptured: false,
  capturedEmail: '',

  aiInsight: null,
};

type MoveAction =
  | { type: 'SET_STEP'; step: string }
  | { type: 'COMPLETE_STEP'; step: string }
  | { type: 'SET_BASICS'; basics: Partial<MoveBasics> }
  | { type: 'SET_ROOMS'; rooms: Room[] }
  | { type: 'ADD_ROOM'; room: Room }
  | { type: 'UPDATE_ROOM'; roomId: string; room: Partial<Room> }
  | { type: 'REMOVE_ROOM'; roomId: string }
  | { type: 'UPDATE_ROOM_FURNITURE'; roomId: string; furniture: FurnitureItem[] }
  | { type: 'UPDATE_ROOM_BOXES'; roomId: string; boxes: Partial<BoxEstimates> }
  | { type: 'SET_ROOM_STATUS'; roomId: string; status: Room['status'] }
  | { type: 'TOGGLE_SPECIAL_ITEM'; itemId: string }
  | { type: 'SET_SPECIAL_ITEM_QUANTITY'; itemId: string; quantity: number }
  | { type: 'TOGGLE_SERVICE'; serviceId: string }
  | { type: 'TOGGLE_SERVICE_SUBOPTION'; serviceId: string; subOptionId: string }
  | { type: 'SET_ESTIMATE'; estimate: MoveEstimate }
  | { type: 'SET_BOX_COUNTS'; boxCounts: BoxCounts }
  | { type: 'SET_CONTACT_INFO'; info: ContactInfo }
  | { type: 'SET_CONTACT_PREFERENCES'; prefs: Partial<ContactPreferences> }
  | { type: 'TOGGLE_MOVER'; moverId: string }
  | { type: 'SET_EXIT_INTENT_SHOWN' }
  | { type: 'SET_EMAIL_CAPTURED'; email: string }
  | { type: 'SET_AI_INSIGHT'; insight: string }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; state: MoveState };

function moveReducer(state: MoveState, action: MoveAction): MoveState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.step)
          ? state.completedSteps
          : [...state.completedSteps, action.step],
      };

    case 'SET_BASICS':
      return {
        ...state,
        basics: { ...state.basics, ...action.basics },
      };

    case 'SET_ROOMS':
      return { ...state, rooms: action.rooms };

    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.room] };

    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map((r) =>
          r.id === action.roomId ? { ...r, ...action.room } : r
        ),
      };

    case 'REMOVE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter((r) => r.id !== action.roomId),
      };

    case 'UPDATE_ROOM_FURNITURE':
      return {
        ...state,
        rooms: state.rooms.map((r) =>
          r.id === action.roomId ? { ...r, furniture: action.furniture } : r
        ),
      };

    case 'UPDATE_ROOM_BOXES':
      return {
        ...state,
        rooms: state.rooms.map((r) =>
          r.id === action.roomId ? { ...r, boxes: { ...r.boxes, ...action.boxes } } : r
        ),
      };

    case 'SET_ROOM_STATUS':
      return {
        ...state,
        rooms: state.rooms.map((r) =>
          r.id === action.roomId ? { ...r, status: action.status } : r
        ),
      };

    case 'TOGGLE_SPECIAL_ITEM':
      return {
        ...state,
        specialItems: state.specialItems.map((item) =>
          item.id === action.itemId ? { ...item, selected: !item.selected } : item
        ),
      };

    case 'SET_SPECIAL_ITEM_QUANTITY':
      return {
        ...state,
        specialItems: state.specialItems.map((item) =>
          item.id === action.itemId ? { ...item, quantity: action.quantity } : item
        ),
      };

    case 'TOGGLE_SERVICE':
      return {
        ...state,
        services: state.services.map((svc) =>
          svc.id === action.serviceId ? { ...svc, selected: !svc.selected } : svc
        ),
      };

    case 'TOGGLE_SERVICE_SUBOPTION':
      return {
        ...state,
        services: state.services.map((svc) =>
          svc.id === action.serviceId && svc.subOptions
            ? {
                ...svc,
                subOptions: svc.subOptions.map((sub) =>
                  sub.id === action.subOptionId ? { ...sub, selected: !sub.selected } : sub
                ),
              }
            : svc
        ),
      };

    case 'SET_ESTIMATE':
      return { ...state, estimate: action.estimate };

    case 'SET_BOX_COUNTS':
      return { ...state, boxCounts: action.boxCounts };

    case 'SET_CONTACT_INFO':
      return { ...state, contactInfo: action.info };

    case 'SET_CONTACT_PREFERENCES':
      return {
        ...state,
        contactPreferences: { ...state.contactPreferences, ...action.prefs },
      };

    case 'TOGGLE_MOVER':
      return {
        ...state,
        selectedMovers: state.selectedMovers.includes(action.moverId)
          ? state.selectedMovers.filter((id) => id !== action.moverId)
          : [...state.selectedMovers, action.moverId],
      };

    case 'SET_EXIT_INTENT_SHOWN':
      return { ...state, exitIntentShown: true };

    case 'SET_EMAIL_CAPTURED':
      return { ...state, emailCaptured: true, capturedEmail: action.email };

    case 'SET_AI_INSIGHT':
      return { ...state, aiInsight: action.insight };

    case 'RESET':
      return initialState;

    case 'HYDRATE':
      return action.state;

    default:
      return state;
  }
}

interface MoveContextValue {
  state: MoveState;
  dispatch: React.Dispatch<MoveAction>;

  // Navigation
  setStep: (step: string) => void;
  completeStep: (step: string) => void;

  // Basics
  setBasics: (basics: Partial<MoveBasics>) => void;

  // Rooms
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, room: Partial<Room>) => void;
  removeRoom: (roomId: string) => void;
  updateRoomFurniture: (roomId: string, furniture: FurnitureItem[]) => void;
  updateRoomBoxes: (roomId: string, boxes: Partial<BoxEstimates>) => void;
  setRoomStatus: (roomId: string, status: Room['status']) => void;

  // Special items & services
  toggleSpecialItem: (itemId: string) => void;
  setSpecialItemQuantity: (itemId: string, quantity: number) => void;
  toggleService: (serviceId: string) => void;
  toggleServiceSuboption: (serviceId: string, subOptionId: string) => void;

  // Estimates
  setEstimate: (estimate: MoveEstimate) => void;
  setBoxCounts: (boxCounts: BoxCounts) => void;

  // Contact
  setContactInfo: (info: ContactInfo) => void;
  setContactPreferences: (prefs: Partial<ContactPreferences>) => void;

  // Movers
  toggleMover: (moverId: string) => void;

  // Engagement
  setExitIntentShown: () => void;
  setEmailCaptured: (email: string) => void;

  // AI
  setAiInsight: (insight: string) => void;

  // Utility
  reset: () => void;
}

const MoveContext = createContext<MoveContextValue | null>(null);

export function MoveProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(moveReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'HYDRATE', state: { ...initialState, ...parsed } });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  // Navigation
  const setStep = useCallback((step: string) => dispatch({ type: 'SET_STEP', step }), []);
  const completeStep = useCallback((step: string) => dispatch({ type: 'COMPLETE_STEP', step }), []);

  // Basics
  const setBasics = useCallback(
    (basics: Partial<MoveBasics>) => dispatch({ type: 'SET_BASICS', basics }),
    []
  );

  // Rooms
  const setRooms = useCallback((rooms: Room[]) => dispatch({ type: 'SET_ROOMS', rooms }), []);
  const addRoom = useCallback((room: Room) => dispatch({ type: 'ADD_ROOM', room }), []);
  const updateRoom = useCallback(
    (roomId: string, room: Partial<Room>) => dispatch({ type: 'UPDATE_ROOM', roomId, room }),
    []
  );
  const removeRoom = useCallback(
    (roomId: string) => dispatch({ type: 'REMOVE_ROOM', roomId }),
    []
  );
  const updateRoomFurniture = useCallback(
    (roomId: string, furniture: FurnitureItem[]) =>
      dispatch({ type: 'UPDATE_ROOM_FURNITURE', roomId, furniture }),
    []
  );
  const updateRoomBoxes = useCallback(
    (roomId: string, boxes: Partial<BoxEstimates>) =>
      dispatch({ type: 'UPDATE_ROOM_BOXES', roomId, boxes }),
    []
  );
  const setRoomStatus = useCallback(
    (roomId: string, status: Room['status']) =>
      dispatch({ type: 'SET_ROOM_STATUS', roomId, status }),
    []
  );

  // Special items & services
  const toggleSpecialItem = useCallback(
    (itemId: string) => dispatch({ type: 'TOGGLE_SPECIAL_ITEM', itemId }),
    []
  );
  const setSpecialItemQuantity = useCallback(
    (itemId: string, quantity: number) =>
      dispatch({ type: 'SET_SPECIAL_ITEM_QUANTITY', itemId, quantity }),
    []
  );
  const toggleService = useCallback(
    (serviceId: string) => dispatch({ type: 'TOGGLE_SERVICE', serviceId }),
    []
  );
  const toggleServiceSuboption = useCallback(
    (serviceId: string, subOptionId: string) =>
      dispatch({ type: 'TOGGLE_SERVICE_SUBOPTION', serviceId, subOptionId }),
    []
  );

  // Estimates
  const setEstimate = useCallback(
    (estimate: MoveEstimate) => dispatch({ type: 'SET_ESTIMATE', estimate }),
    []
  );
  const setBoxCounts = useCallback(
    (boxCounts: BoxCounts) => dispatch({ type: 'SET_BOX_COUNTS', boxCounts }),
    []
  );

  // Contact
  const setContactInfo = useCallback(
    (info: ContactInfo) => dispatch({ type: 'SET_CONTACT_INFO', info }),
    []
  );
  const setContactPreferences = useCallback(
    (prefs: Partial<ContactPreferences>) => dispatch({ type: 'SET_CONTACT_PREFERENCES', prefs }),
    []
  );

  // Movers
  const toggleMover = useCallback(
    (moverId: string) => dispatch({ type: 'TOGGLE_MOVER', moverId }),
    []
  );

  // Engagement
  const setExitIntentShown = useCallback(() => dispatch({ type: 'SET_EXIT_INTENT_SHOWN' }), []);
  const setEmailCaptured = useCallback(
    (email: string) => dispatch({ type: 'SET_EMAIL_CAPTURED', email }),
    []
  );

  // AI
  const setAiInsight = useCallback(
    (insight: string) => dispatch({ type: 'SET_AI_INSIGHT', insight }),
    []
  );

  // Utility
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <MoveContext.Provider
      value={{
        state,
        dispatch,
        setStep,
        completeStep,
        setBasics,
        setRooms,
        addRoom,
        updateRoom,
        removeRoom,
        updateRoomFurniture,
        updateRoomBoxes,
        setRoomStatus,
        toggleSpecialItem,
        setSpecialItemQuantity,
        toggleService,
        toggleServiceSuboption,
        setEstimate,
        setBoxCounts,
        setContactInfo,
        setContactPreferences,
        toggleMover,
        setExitIntentShown,
        setEmailCaptured,
        setAiInsight,
        reset,
      }}
    >
      {children}
    </MoveContext.Provider>
  );
}

export function useMove() {
  const context = useContext(MoveContext);
  if (!context) {
    throw new Error('useMove must be used within a MoveProvider');
  }
  return context;
}
