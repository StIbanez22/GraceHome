
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Screen } from '../../types';

interface LayoutProps {
    children: ReactNode;
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setActiveScreen }) => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <div 
                    className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
                >
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400/10 dark:bg-blue-400/20 opacity-20 blur-[100px]"></div>
                </div>
                {children}
            </main>
        </div>
    );
};

export default Layout;
