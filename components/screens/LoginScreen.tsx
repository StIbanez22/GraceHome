
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { LANGUAGES } from '../../constants';
import { Language } from '../../types';

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const { t, language, setLanguage } = useApp();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t('gracehome_welcome')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your family's spiritual and practical life.</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">{t('email')}</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">{t('password')}</label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-blue-500 hover:underline">{t('forgot_password')}</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-1 transition-all duration-200"
                        >
                            {t('login')}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Select Language
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
