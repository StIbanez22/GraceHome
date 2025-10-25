
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { LANGUAGES, CURRENCIES } from '../../constants';
import { Language, Currency, Theme } from '../../types';
import Icon from '../common/Icon';

const SettingsScreen: React.FC = () => {
    const { t, theme, setTheme, language, setLanguage, currency, setCurrency } = useApp();

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settings')}</h1>
            </header>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
                
                {/* Theme Settings */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">{t('theme')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${theme === 'light' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                        >
                            <Icon name="sun" className="w-8 h-8 mb-2 text-yellow-500" />
                            <span className="font-medium">{t('light_mode')}</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${theme === 'dark' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                        >
                            <Icon name="moon" className="w-8 h-8 mb-2 text-indigo-400" />
                            <span className="font-medium">{t('dark_mode')}</span>
                        </button>
                    </div>
                </div>

                {/* Language Settings */}
                <div>
                    <label className="block text-lg font-semibold mb-2">{t('language')}</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </div>

                {/* Currency Settings */}
                <div>
                    <label className="block text-lg font-semibold mb-2">{t('currency')}</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        {CURRENCIES.map((curr) => (
                            <option key={curr.code} value={curr.code}>{`${curr.code} (${curr.symbol})`}</option>
                        ))}
                    </select>
                </div>

            </div>
        </div>
    );
};

export default SettingsScreen;
