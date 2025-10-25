import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Screen } from './types';
import LoginScreen from './components/screens/LoginScreen';
import Layout from './components/layout/Layout';
import DashboardScreen from './components/screens/DashboardScreen';
import FinanceScreen from './components/screens/FinanceScreen';
import CalendarScreen from './components/screens/CalendarScreen';
import ShoppingListScreen from './components/screens/ShoppingListScreen';
import DevotionalScreen from './components/screens/DevotionalScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import useLocalStorage from './hooks/useLocalStorage';

const AppContent: React.FC = () => {
    const { theme } = useApp();
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', true); // Temporarily set to true to bypass login during development
    const [activeScreen, setActiveScreen] = useLocalStorage<Screen>('activeScreen', 'dashboard');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    if (!isAuthenticated) {
        return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'dashboard':
                return <DashboardScreen />;
            case 'finances':
                return <FinanceScreen />;
            case 'calendar':
                return <CalendarScreen />;
            case 'shopping':
                return <ShoppingListScreen />;
            case 'devotional':
                return <DevotionalScreen />;
            case 'settings':
                return <SettingsScreen />;
            default:
                return <DashboardScreen />;
        }
    };

    return (
        <Layout activeScreen={activeScreen} setActiveScreen={setActiveScreen}>
            {renderScreen()}
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;