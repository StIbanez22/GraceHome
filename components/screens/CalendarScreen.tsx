import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { CalendarEvent, Recurrence } from '../../types';
import Icon from '../common/Icon';
import useLocalStorage from '../../hooks/useLocalStorage';

const initialEvents: CalendarEvent[] = [
    { id: '1', name: 'Sunday Service', date: '2024-01-07', description: 'Weekly church service', recurring: 'weekly' },
    { id: '2', name: 'Family Dinner', date: '2024-07-08', description: 'With the Johnsons', recurring: 'none' },
    { id: '3', name: 'Youth Group', date: '2024-01-05', description: 'Friday night youth meeting', recurring: 'weekly' },
    { id: '5', name: 'Bible Study', date: '2024-01-10', description: 'Study of Genesis', recurring: 'weekly' },
    { id: '6', name: 'Church Cleaning', date: '2024-01-28', description: 'Monthly cleaning duty', recurring: 'monthly' },
];

const emptyEvent: Omit<CalendarEvent, 'id'> = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    recurring: 'none'
};

const CalendarScreen: React.FC = () => {
    const { t, language } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendarEvents', initialEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | Omit<CalendarEvent, 'id'>> (emptyEvent);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const eventsForMonth = useMemo(() => {
        const eventsMap = new Map<number, CalendarEvent[]>();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayDate = new Date(year, month, day);
            const dayEvents: CalendarEvent[] = [];

            for (const event of events) {
                const [y, m, d] = event.date.split('-').map(Number);
                const eventStartDate = new Date(y, m - 1, d);
                
                if (eventStartDate > currentDayDate) continue;

                let shouldAdd = false;
                switch (event.recurring) {
                    case 'none':
                        if (eventStartDate.toDateString() === currentDayDate.toDateString()) {
                            shouldAdd = true;
                        }
                        break;
                    case 'weekly':
                        if (eventStartDate.getDay() === currentDayDate.getDay()) {
                           shouldAdd = true;
                        }
                        break;
                    case 'monthly':
                        if (eventStartDate.getDate() === currentDayDate.getDate()) {
                            shouldAdd = true;
                        }
                        break;
                }
                if (shouldAdd) {
                    dayEvents.push(event);
                }
            }
            if (dayEvents.length > 0) {
                 eventsMap.set(day, dayEvents);
            }
        }
        return eventsMap;
    }, [events, year, month]);

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthName = currentDate.toLocaleString(language, { month: 'long' });
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
        setSelectedDate(null);
    };

    const handleDayClick = (day: number) => setSelectedDate(new Date(year, month, day));

    const handleOpenModal = (event?: CalendarEvent) => {
        setEditingEvent(event || emptyEvent);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(emptyEvent);
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if ('id' in editingEvent) { // Editing existing event
            setEvents(events.map(ev => ev.id === editingEvent.id ? editingEvent as CalendarEvent : ev));
        } else { // Adding new event
            setEvents([...events, { ...editingEvent, id: Date.now().toString() } as CalendarEvent]);
        }
        handleCloseModal();
    };
    
    const handleDeleteEvent = (id: string) => {
        setEvents(events.filter(ev => ev.id !== id));
        handleCloseModal();
    };

    const selectedDayEvents = selectedDate ? eventsForMonth.get(selectedDate.getDate()) || [] : [];

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('calendar')}</h1>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition flex items-center gap-2">
                    <Icon name="plus" className="w-5 h-5" />
                    {t('add_event')}
                </button>
            </header>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Icon name="chevron_down" className="w-6 h-6 transform rotate-90" /></button>
                    <h2 className="text-xl font-semibold">{`${monthName} ${year}`}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Icon name="chevron_down" className="w-6 h-6 transform -rotate-90" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                    {daysOfWeek.map(day => <div key={day} className="font-bold text-gray-600 dark:text-gray-400 py-2 text-sm">{day}</div>)}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }).map((_, day) => {
                        const dayNumber = day + 1;
                        const dayDate = new Date(year, month, dayNumber);
                        const isToday = new Date().toDateString() === dayDate.toDateString();
                        const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
                        const hasEvents = eventsForMonth.has(dayNumber);
                        
                        return (
                            <div key={dayNumber}>
                                <button onClick={() => handleDayClick(dayNumber)} className={`w-12 h-12 mx-auto flex flex-col items-center justify-center rounded-full transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isToday ? 'bg-blue-600 text-white font-bold hover:bg-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <span>{dayNumber}</span>
                                    {hasEvents && <div className={`mt-1 h-1.5 w-1.5 rounded-full ${isToday || isSelected ? 'bg-white/70' : 'bg-red-500'}`}></div>}
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 min-h-[150px]">
                     <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        {selectedDate ? `Events on ${selectedDate.toLocaleDateString(language, { month: 'long', day: 'numeric' })}` : 'Select a day to see events'}
                    </h3>
                    {selectedDate && (
                        <ul className="space-y-3">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map(event => (
                                    <li key={event.id} onClick={() => handleOpenModal(event)} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fade-in cursor-pointer hover:shadow-md transition-shadow">
                                        <div className="w-1.5 h-full bg-blue-500 rounded-full mt-1 self-stretch"></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 pt-4 text-center">No events for this day.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{'id' in editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                        <form onSubmit={handleSaveEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('event_name')}</label>
                                <input type="text" value={editingEvent.name} onChange={e => setEditingEvent({...editingEvent, name: e.target.value})} required className="mt-1 w-full input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('date')}</label>
                                <input type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} required className="mt-1 w-full input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                                <textarea value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} rows={3} className="mt-1 w-full input-style" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recurrence</label>
                                <select value={editingEvent.recurring} onChange={e => setEditingEvent({...editingEvent, recurring: e.target.value as Recurrence})} className="mt-1 w-full input-style">
                                    <option value="none">Does not repeat</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                {'id' in editingEvent ? 
                                    <button type="button" onClick={() => handleDeleteEvent(editingEvent.id)} className="p-2 text-red-500 hover:text-red-700"><Icon name="trash" className="w-6 h-6" /></button> 
                                    : <div></div>
                                }
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold rounded-lg transition">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">Save Event</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`.input-style { background-color: #f3f4f6; border-color: transparent; border-radius: 0.5rem; padding: 0.5rem 1rem; color: #1f2937; } .dark .input-style { background-color: #374151; color: #f9fafb; } .input-style:focus { --tw-ring-color: #3b82f6; border-color: #3b82f6; }`}</style>
        </div>
    );
};

export default CalendarScreen;