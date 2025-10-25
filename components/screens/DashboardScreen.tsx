import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { GoogleGenAI } from '@google/genai';
import { CURRENCIES } from '../../constants';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Transaction, BudgetGoal } from '../../types';
import Icon from '../common/Icon';

const USER_NAME = "Family";

const DashboardScreen: React.FC = () => {
    const { t, currency, language } = useApp();
    const [verse, setVerse] = useState('');
    const [loadingVerse, setLoadingVerse] = useState(true);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [budgetGoals] = useLocalStorage<BudgetGoal[]>('budgetGoals', []);

    const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    useEffect(() => {
        const fetchVerse = async () => {
            setLoadingVerse(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: t('todays_verse_prompt'),
                });
                setVerse(response.text);
            } catch (error) {
                console.error("Error fetching verse:", error);
                setVerse("I can do all this through him who gives me strength.\n- Philippians 4:13");
            } finally {
                setLoadingVerse(false);
            }
        };

        fetchVerse();
    }, [language, t]);
    
    const budgetSummary = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const totalBudget = budgetGoals.reduce((sum, goal) => sum + goal.amount, 0);
        if (totalBudget === 0) {
            return null;
        }
        
        const budgetedCategories = new Set(budgetGoals.map(g => g.category));

        const totalSpentOnBudgets = transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return (
                    txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear &&
                    budgetedCategories.has(tx.category)
                );
            })
            .reduce((sum, tx) => sum + tx.amount, 0);

        return { totalBudget, totalSpentOnBudgets };
    }, [transactions, budgetGoals]);

    const upcomingEvents = [
        { id: 1, name: 'Sunday Service', time: '10:00 AM' },
        { id: 2, name: 'Bible Study', time: 'Wednesday, 7:00 PM' },
    ];

    const verseParts = verse.split('\n');
    const verseText = verseParts[0] || '';
    const verseRef = verseParts.length > 1 ? verseParts[verseParts.length - 1] : '';

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{`${t('welcome_user')} ${USER_NAME}!`}</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{t('todays_verse')}</h2>
                    {loadingVerse ? (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                        </div>
                    ) : (
                        <blockquote className="text-lg italic text-gray-600 dark:text-gray-300 border-l-4 border-blue-500 pl-4">
                            <p>"{verseText}"</p>
                            {verseRef && <footer className="text-sm not-italic mt-2 text-right text-gray-500 dark:text-gray-400">{verseRef}</footer>}
                        </blockquote>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{t('budget_overview')}</h2>
                    {budgetSummary ? (
                        <div>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-semibold text-2xl text-gray-800 dark:text-gray-200">
                                    {currencySymbol}{budgetSummary.totalSpentOnBudgets.toFixed(2)}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    / {currencySymbol}{budgetSummary.totalBudget.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('total_spent_vs_budgeted')}</p>
                            
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-blue-500 h-4 rounded-full"
                                    style={{ width: `${Math.min((budgetSummary.totalSpentOnBudgets / budgetSummary.totalBudget) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
                            <Icon name="target" className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                            <p className="font-semibold">{t('no_budget_set')}</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{t('upcoming_events')}</h2>
                     <ul className="space-y-3">
                        {upcomingEvents.map(event => (
                            <li key={event.id} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{event.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;