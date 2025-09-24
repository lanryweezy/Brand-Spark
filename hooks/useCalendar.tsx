
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ContentCalendarEvent } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface CalendarContextType {
  events: ContentCalendarEvent[];
  brandEvents: ContentCalendarEvent[];
  addEvent: (event: Omit<ContentCalendarEvent, 'id' | 'brandId'>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  isLoading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [events, setEvents] = useState<ContentCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await apiService.fetchCalendarEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addEvent = async (event: Omit<ContentCalendarEvent, 'id' | 'brandId'>) => {
    if (!currentBrand) {
        throw new Error("A brand must be selected to add an event.");
    }
    const newEvent = await apiService.addCalendarEvent({ ...event, brandId: currentBrand.id });
    setEvents(prev => [newEvent, ...prev]);
  };

  const deleteEvent = async (eventId: string) => {
    await apiService.deleteCalendarEvent(eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };
  
  const brandEvents = useMemo(() => {
    if (!currentBrand) return [];
    return events.filter(e => e.brandId === currentBrand.id);
  }, [events, currentBrand]);

  const value = useMemo(() => ({
    events,
    brandEvents,
    addEvent,
    deleteEvent,
    isLoading
  }), [events, brandEvents, isLoading]);

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
