import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { devotionalStudy } from '../../devotionalContent';
import Icon from '../common/Icon';

interface AccordionSectionProps {
    section: typeof devotionalStudy.sections[0];
    userAnswers: Record<string, string>;
    handleInputChange: (id: string, value: string) => void;
    isReviewMode: boolean;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ section, userAnswers, handleInputChange, isReviewMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
                <span>{section.title}</span>
                <Icon name="chevron_down" className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-4 space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-loose">
                    {section.content.map((part, index) => {
                        if (part.type === 'text') {
                            return <span key={index}>{part.value}</span>;
                        }
                        if (part.type === 'blank') {
                            return isReviewMode ? (
                                <span key={part.id} className="font-bold text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/50 underline-offset-2">
                                    {` ${part.answer} `}
                                </span>
                            ) : (
                                <input
                                    key={part.id}
                                    type="text"
                                    value={userAnswers[part.id] || ''}
                                    onChange={(e) => handleInputChange(part.id, e.target.value)}
                                    className="inline-block w-32 mx-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition"
                                    style={{minWidth: `${part.answer.length * 0.8 + 2}rem`}}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

const DevotionalScreen: React.FC = () => {
    const { t } = useApp();
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [isReviewMode, setIsReviewMode] = useState(false);

    const handleInputChange = (id: string, value: string) => {
        setUserAnswers(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('financial_study')}</h1>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
                    <span className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${!isReviewMode ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {t('study_mode')}
                    </span>
                    <label htmlFor="review-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isReviewMode}
                            onChange={() => setIsReviewMode(!isReviewMode)}
                            id="review-toggle"
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${isReviewMode ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {t('review_mode')}
                    </span>
                     <Icon name={isReviewMode ? 'eye' : 'eye-off'} className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{devotionalStudy.title}</h2>
                </div>
                {devotionalStudy.sections.map((section, index) => (
                    <AccordionSection
                        key={index}
                        section={section}
                        userAnswers={userAnswers}
                        handleInputChange={handleInputChange}
                        isReviewMode={isReviewMode}
                    />
                ))}
            </div>
        </div>
    );
};

export default DevotionalScreen;