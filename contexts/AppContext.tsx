
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Theme, Language, Currency } from '../types';
import { TRANSLATIONS } from '../constants';

interface AppContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (language: Language) => void;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
    const [language, setLanguage] = useLocalStorage<Language>('language', 'sv');
    const [currency, setCurrency] = useLocalStorage<Currency>('currency', 'SEK');

    const t = (key: string): string => {
        return TRANSLATIONS[language][key] || key;
    };

    return (
        <AppContext.Provider value={{ theme, setTheme, language, setLanguage, currency, setCurrency, t }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};