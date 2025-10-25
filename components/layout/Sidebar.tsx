import React, { useState } from 'react';
import Icon from '../common/Icon';
import { useApp } from '../../contexts/AppContext';
import { NAV_ITEMS } from '../../constants';
import { Screen } from '../../types';

interface SidebarProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen }) => {
    const { t } = useApp();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <aside className={`flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className={`flex items-center h-16 p-4 border-b dark:border-gray-700 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                <span className={`font-bold text-xl text-blue-600 dark:text-blue-400 transition-all duration-200 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>GraceHome</span>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} /></svg>
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveScreen(item.id)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 overflow-hidden ${
                            activeScreen === item.id
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        } ${isExpanded ? '' : 'justify-center'}`}
                    >
                        <Icon name={item.icon} className="h-6 w-6 flex-shrink-0" />
                        <span className={`font-semibold transition-all duration-200 whitespace-nowrap ${isExpanded ? 'ml-4 opacity-100 w-auto' : 'opacity-0 w-0'}`}>{t(item.id)}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
                 <button className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 ${isExpanded ? '' : 'justify-center'}`}>
                    <Icon name="logout" className="h-6 w-6 flex-shrink-0" />
                    <span className={`font-semibold transition-all duration-200 whitespace-nowrap ${isExpanded ? 'ml-4 opacity-100 w-auto' : 'opacity-0 w-0'}`}>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;